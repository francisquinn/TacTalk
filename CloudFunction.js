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
                var jsonObj = JSON.parse(req.query.package);

                var fullText = [];

                for (var i = 0;i < jsonObj.length; i++)
                {
                    fullText.push(jsonObj[i].text);
                }

                var currentTime = new Date();
                var newLogObject = 
                        {
                            submit_time:currentTime,
                            text:fullText,
                            game_id:req.query.object_id

                        };
                await dbo.collection("log").insertOne(newLogObject, function(err){
                    if (err) return;
                    // Object inserted successfully.



                    res.end(JSON.stringify({code:200,_id:newLogObject._id}));
                    db.close();
                });

            }catch(ex)
            {
                res.end(JSON.stringify({code:500,error:ex}));
                db.close();
            }

        
    },
    

}
            
