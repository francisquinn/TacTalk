const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require('mongodb');
const uri = "mongodb+srv://RojakAdmin:RojakIsASalad@rojakcluster.ho1ff.mongodb.net/sample_analytics?retryWrites=true&w=majority";
const eventPropertyList = ["event_type_id","event_position_id","player_id","team_id","outcome_id","outcome_team_id","outcome_player_id"];

const defaultEvent =
        {
                    event_id: new ObjectID(),
                    time:0,
                    event_type_id:-1,
                    event_position_id:-1,
                    player_id:-1,
                    team_id:-1,
                    outcome_id:-1,
                    outcome_team_id:-1,
                    outcome_player_id:-1
        };
        
        
const defaultPossession = 
        {
            possession_team:-1,
            time: 0,
            events: []
        };       
        
        
const defaultStatsResult = 
        {
            teamGoal : 0,
            teamPoints : 0,
            teamShots : 0,
            teamKickouts : 0,
            teamTurnover : 0,
            teamWides : 0,
            teamPass:0,
            oppTeamGoal : 0,
            oppTeamPoints : 0,
            oppTeamShots : 0,
            oppTeamKickouts:0,
            oppTeamTurnover : 0,
            oppTeamPass:0,
            oppTeamWides:0
        }

const stats = require("./Stats");
const cp = require('./CommandParser');
module.exports = 
{
    updateGame: async function(req,res)
    {     
        
            //3-20
            //first is goal second is points
            const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
            const dbo = db.db("TacTalk");
            res.setHeader('Content-Type', 'application/json');
            console.log("call");
            try
            {
                if (req.query.hasOwnProperty("dummyData"))
                {
                    var statsObj = 
                    {
                        teamGoal : 1,
                        teamPoints : 18,
                        teamShots : 28,
                        teamKickouts : 23,
                        teamTurnover : 16,
                        teamWides : 4,
                        oppTeamGoal : 0,
                        oppTeamPoints : 15,
                        oppTeamShots : 14,
                        oppTeamTurnover : 16,
                        
                    }

                    res.end(JSON.stringify({
                    result: statsObj,
                    code: 200
                    }));
                    return;
                }
                const searchQuery = { game_id: new MongoDB.ObjectID(req.query.game_id)};

                var activeGame = await dbo.collection("active_games").findOne(searchQuery);



                if (!activeGame)
                {
                    res.end(JSON.stringify({code:200, gameStatus:"NO_ACTIVE_GAME"}));
                }
                else if(!activeGame.user_id.equals (new MongoDB.ObjectID(req.query.user_id)))
                {
                    res.end(JSON.stringify({code:200, gameStatus:"NOT_AUTHORIZED"}));
                }
                else if (activeGame.input_list.length > 0)
                {
                    //if there is item in input list

                    //sort the input list
                    activeGame.input_list.sort(inputListCompare);

                    for (var i = 0; i < activeGame.input_list.length;i++)
                    {
                        if (activeGame.current_order + 1 === activeGame.input_list[i].audio_order)
                        {
                            activeGame.current_order += 1;
                            for (var j = 0;j < activeGame.input_list[i].text.length; j++)
                            {
                                activeGame.last_string.push(activeGame.input_list[i].text[j]);
                            }


                        }
                    }


                    var segmentString = "";
                    var removeIndex = -1;
                    var newPossession = false;
                    for(var i = 0;i < activeGame.last_string.length;i++)
                    {
                        segmentString += " "+activeGame.last_string[i];
                        console.log("current state: "+segmentString);
                        var parseResult = cp.parseCommand(segmentString,activeGame);

                        //if the parse result extracted a value
                        if (parseResult !== null)
                        {

                            //if the current team possession has been changed, change it in active game too
                            if (parseResult.hasOwnProperty("team_id"))
                            {
                                if (activeGame.current_possession_team !== parseResult.team_id)
                                {
                                    activeGame.current_possession_team = parseResult.team_id;
                                    newPossession = true;

                                }
                            }
                            console.log("%c parse result: ["+JSON.stringify(parseResult)+"]",'background: #222; color: #bada55')
           
                                


                            //cycle through the list of properties
                            for (var j = 0; j < eventPropertyList.length; j++)
                            {
                                if (parseResult.hasOwnProperty(eventPropertyList[j]))
                                {
                                    if (!activeGame.current_event.hasOwnProperty(eventPropertyList[j]))
                                    {
                                        activeGame.current_event = Object.assign({},defaultEvent);
                                    }

                                    // if the current event already has this property, upload this event, and replace it with a new one
                                    if (activeGame.current_event[eventPropertyList[j]] !== -1)
                                    {
                                        await createGameEvent(activeGame.game_id,activeGame.current_event,activeGame.current_possession_team,newPossession);
                                        activeGame.current_event = Object.assign({},defaultEvent);
                                        activeGame.current_event[eventPropertyList[j]] = parseResult[eventPropertyList[j]];
                                        newPossession = false;
                                    }
                                    else // or else, add this new property to the exisiting event
                                    {
                                        activeGame.current_event[eventPropertyList[j]] = parseResult[eventPropertyList[j]];
                                    }


                                    //reset segment string because the information is extracted
                                    segmentString = "";
                                    removeIndex = i;


                                }
                            }





                        }

                    }

                    //remove the used strings that has already been parsed
                    if (removeIndex !== -1)
                    {
                        activeGame.last_string = activeGame.last_string.slice(removeIndex);
                    }



                    //update the active_game document in the database to match with the current one

                    var newActiveGameValues = 
                            {
                                $set:
                                activeGame
                            }

                    await dbo.collection("active_games").updateOne(searchQuery,newActiveGameValues);

                    console.log(req.query.game_id +"me");
                    var gameSearchQuery = {_id:new MongoDB.ObjectID(req.query.game_id)};

                    //compile stats and send the response back to user
                    var gameObject = await dbo.collection("games").findOne(gameSearchQuery);
                    if (gameObject)
                    {


                        console.log(gameObject);
                        var statResult = await stats.getCurrentStats(gameObject);
                        console.log(statResult);
                        res.end(JSON.stringify({code:200, gameStatus: "UPDATING",result: statResult}));
                        console.log("finish output");

                    }


                }
                else if (activeGame.input_list.length === 0)
                {
                    res.end(JSON.stringify(({code:200, gameStatus:"NO_INPUT", result: defaultStatsResult})));
                }




            }catch(ex)
            {
                res.end(JSON.stringify({code:500, error:ex.toString()}));
                db.close();
            }

        
    }
}

function inputListCompare(inputA,inputB)
{
    if (inputA.order < inputB.order)
    {
        return -1;
    }
    else if(inputA.order > inputB.order)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

async function createGameEvent(gameID,gameEvent,currentPossessionTeam, newPossession)
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    try
    {
        
        const searchQuery = { _id: new MongoDB.ObjectID(gameID) };
        var gameObj = await dbo.collection("games").findOne(searchQuery);
        
        if (gameEvent.team_id === -1)
        {
            gameEvent.team_id = currentPossessionTeam;
        }
        
        if (gameObj.possessions.length === 0)
        {
            gameObj.possessions.push(
                    {
                        possession_team:currentPossessionTeam,
                        time:0,
                        events:[gameEvent]
                    });
        }
        else if (gameEvent.event_type_id === 8)
        {
            //turnover
            gameObj.possessions[gameObj.possessions.length-1].events.push(gameEvent);
            var newTeamId = Math.abs(currentPossessionTeam - 1);
            gameObj.possessions.push(
                    {
                        possession_team:newTeamId,
                        time:0,
                        events:[]
                    });
        }
        else if (newPossession)
        {
            var newPossessionObj = 
                    {
                        possession_team:currentPossessionTeam,
                        time:0,
                        events:[gameEvent]
                    }
            gameObj.possessions.push(newPossessionObj);
        }
        else
        {
            gameObj.possessions[gameObj.possessions.length-1].events.push(gameEvent);
        }
        
        const updateDocument = 
        {
            "$set": gameObj 
        }
        
        
        await dbo.collection("games").updateOne(searchQuery, updateDocument, function(err)
        {
            if (err) return;
            console.log("A new event has been inserted into the game:");
            console.log(JSON.stringify(gameEvent));
            db.close();
        });
    }catch(ex)
    {
        console.log(ex)
        db.close();
    }
    
}