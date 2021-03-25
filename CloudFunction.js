const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require('mongodb');
const uri = "mongodb+srv://RojakAdmin:RojakIsASalad@rojakcluster.ho1ff.mongodb.net/sample_analytics?retryWrites=true&w=majority";
module.exports = 
{
    createInput: async function(req,res)
    {

        
        const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');
        try
        {

            var gameID = new MongoDB.ObjectID(req.query.object_id);

            var searchQuery = { game_id:gameID }


            var jsonObj = JSON.parse(req.query.package.replace(/u'/g, '\"'));
            
            console.log(jsonObj);
            
            var fullText = [];

            for (var i = 0;i < jsonObj.length; i++)
            {
                fullText.push(jsonObj[i].text);
                console.log(jsonObj[i]);
                console.log(jsonObj[i].text);
            }




            var currentTime = new Date();
            var newLogObject = 
                    {
                        submit_time:currentTime,
                        text:fullText,
                        game_id:gameID,
                        audio_order: parseInt(req.query.audioOrder,10)
                    }

            var updateDocument =
                {
                    $push:
                    {
                        "input_list":newLogObject
                    }
                };

            await dbo.collection("active_games").updateOne(searchQuery, updateDocument, function(err){
                if (err) return;
                // Object inserted successfully.



                res.end(JSON.stringify({code:200,_id:newLogObject._id}));
            });

        }catch(ex)
        {
            res.end(JSON.stringify({code:500,error:ex.toString()}));
        }

        
    }
    

}
            
