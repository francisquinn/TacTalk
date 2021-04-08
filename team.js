const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require("mongodb");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  createTeam: async function (req, res) {
    const db = await MongoClient.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');

                //checking for duplicate teams
        const teamExist = await dbo.collection("teams").findOne({teamName:req.body.teamName});
        if(teamExist) return res.end(JSON.stringify({code:400, message: "Team already exists"}));

        try
        {
            var newTeamObject = 
                    {
//                        team_id:new MongoDB.ObjectID(req.body.team_id),
                        teamName:req.body.teamName,
                        teamColor:req.body.teamColor,
                        teamLevel:req.body.teamLevel

                    };

           await dbo.collection("teams").insertOne(newTeamObject, function(err){
                
//            const teamToken = jwt.sign(
//              { _id: newTeamObject._id },
//              process.env.TOKEN_SECRET
//            );
//
//            // Add token in header
//            res.setHeader("TeamAuth", teamToken);
//            console.log(teamToken)
//            var decoded = jwt.decode(teamToken);
//            console.log(decoded);
        
                res.end(JSON.stringify({code:200,_id:newTeamObject._id}));
                

            
                db.close();
            });

        }catch(ex)
        { 
            res.end(JSON.stringify({code:500,error:ex}));
            db.close();
        }
     }
    
    
    
    
    
}
