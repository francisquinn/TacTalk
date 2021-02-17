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
                                    console.log("different team detected");
                                    activeGame.current_possession_team = parseResult.team_id;
                                    newPossession = true;

                                }
                            }


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

                                    //remembers the index which has already been parsed
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
                        var statResult = stats.getCurrentStats(gameObject);
                        res.end(JSON.stringify({code:200, gameStatus: "UPDATING",result: statResult}));

                    }


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