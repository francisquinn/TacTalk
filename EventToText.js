const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require('mongodb');
const uri = "mongodb+srv://RojakAdmin:RojakIsASalad@rojakcluster.ho1ff.mongodb.net/sample_analytics?retryWrites=true&w=majority";
const enums = require("./enums");
module.exports = 
{
    eventToText: async function(req,res)
    {
        const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');
        try
        {
            const searchQuery = { _id: new MongoDB.ObjectID(req.query.game_id)};

            var result = await dbo.collection("games").findOne(searchQuery);



            if (result)
            {
                var textResult = parseEventToText(result);
                db.close();
                
                res.end(JSON.stringify({code:200, result: textResult}));
            }
            else
            {
                res.end(JSON.stringify({code:200, result: "NO GAME WITH ID"}));
                db.close();
            }
        }catch(ex)
        {
            res.end(JSON.stringify({code:500, error: ex.toString()}));
            db.close();
        }
    }
}

function parseEventToText(input)
{
    var result = [];
    
    for (var i = 0; i < input.possessions.length; i++)
    {
        for (var j = 0; j < input.possessions[i].events.length; j++)
        {
            var event = input.possessions[i].events[j];
            var text = "";
            if (event.player_id === -1)
            {
                text = "Unknown player";
            }
            else
            {
                text = "Plyaer "+event.player_id;
            }
            
            if (event.team_id === -1)
            {
                text += " of unknown team";
            }
            else if (event.team_id === 0)
            {
                text += " of "+input.team_colour+" team";
            }
            else if (event.team_id === 1)
            {
                text += "of "+input.opp_team_colour+" team";
            }
            
            if (event.event_type_id !== -1)
            {
                var e = enums.event.filter(obj => {
                    return obj.eventID === event.event_type_id;
                  });
                text += " performed " + e[0].keywords[0];
            }
            
            if (event.event_position_id !== -1)
            {
                var p = enums.position.filter(obj => {
                    return obj.positionID === event.event_position_id;
                })
                console.log(p);
                text += " at "+ p[0].keywords[0];
            }
            
            if (event.outcome_id !== -1)
            {
                var o = enums.outcome.filter(obj => {
                    return obj.outcomeID === event.outcome_id;
                })
                text += " and resulted in a "+ o[0].keywords[0];
            }
            
            result.push(text);
            
        }
    }
    
    return result;
}
