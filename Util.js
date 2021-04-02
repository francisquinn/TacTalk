const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require('mongodb');
const uri = process.env.DB_CONNECT;
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
                
            var game = await dbo.collection("games").findOne(searchQuery);
            
            if (game)
            {
                game.current_order = 0;
                game.current_event = {};
                game.last_string = [];
                game.current_possession_team = -1;
                if (req.query.hasOwnProperty("clearInput"))
                {

                    game.input_list = [];

                }
                if (req.query.hasOwnProperty(("clearEvent")))
                {
                    game.possessions = [];
                }
                
                var updateGame = 
                {
                    "$set":game
                    
                }
                
                
                await dbo.collection("games").updateOne(searchQuery,updateGame);
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