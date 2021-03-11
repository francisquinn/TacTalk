const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require('mongodb');
const uri = "mongodb+srv://RojakAdmin:RojakIsASalad@rojakcluster.ho1ff.mongodb.net/sample_analytics?retryWrites=true&w=majority";
module.exports = 
{
    resetGame: async function(req,res)
    {
        const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');
        try
        {
            const searchQuery = { _id: new MongoDB.ObjectID(req.query.game_id)};
            const activeGameSearchQuery = { game_id: new MongoDB.ObjectID(req.query.game_id)};
                
            var game = await dbo.collection("games").findOne(searchQuery);
            
            var active_game = await dbo.collection(("active_games")).findOne(activeGameSearchQuery);
            
            if (game && active_game)
            {
                active_game.current_order = 0;
                active_game.current_event = {};
                active_game.last_string = [];
                active_game.current_possession_team = -1;
                if (req.query.hasOwnProperty("clearInput"))
                {
                    if (req.query.clearInput == 1)
                    {
                        active_game.input_list = [];
                    }
                }
                if (req.query.hasOwnProperty(("clearEvent")))
                {
                    if (req.query.clearEvent == 1)
                    {
                        game.possessions = [];
                    }
                }
                
                var updateGame = 
                {
                    "$set":game
                    
                }
                
                var updateActiveGame = 
                {
                    "$set": active_game
                    
                }
                
                await dbo.collection("games").updateOne(searchQuery,updateGame);
                await dbo.collection("active_games").updateOne(activeGameSearchQuery, updateActiveGame);
                db.close();
                res.end(JSON.stringify({code:200}));
                
                
            }
            else
            {
                db.close();
                res.end(JSON.stringify(({code:200, error:"NO SUCH GAME"})));
                
            }


            
            
        }catch(ex)
        {
            res.end(JSON.stringify({code:500, error: ex.toString()}));
            db.close();
        }
    }
}