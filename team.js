const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require("mongodb");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { createTeamValidation } = require("./validation");

dotenv.config();

module.exports = {
  createTeam: async function (req, res) {
    const db = await MongoClient.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');


      //getting validation and displaying the error message if details are entered incorrectly
      const { error } = createTeamValidation(req.body);
      if (error) return res.status(400).send(error.details[0]);

                //checking for duplicate teams
        const teamExist = await dbo.collection("teams").findOne({teamName:req.body.teamName});
        if(teamExist) return res.status(400).send({message: "Team already exists"});

        try
        {
            
                const token = req.header('Authentication');
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET);  
                var userId = decoded.user_id;  
                console.log(userId);
            
            var newTeamObject = 
                    {
                       user_id: new MongoDB.ObjectID(userId),
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
        
                res.status(200).send({message:"Successfully created your team", _id:newTeamObject._id, teamName:req.body.teamName,
                                     teamColor:req.body.teamColor, teamLevel:req.body.teamLevel });
                

            
                db.close();
            });

        }catch(ex)
        { 
            res.status(500).send({message:"Unable to create your team", error:ex});
            db.close();
        }
     },
     
     //Delete teanm
    deleteTeam: async function (req, res) {
        const db = await MongoClient.connect(process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');
        try
        {
            const teamExist = await dbo.collection("teams").findOne({teamName:req.body.teamName});
            if(teamExist)
            { 
                await dbo.collection("teams").deleteOne(teamExist); 
                return res.status(400).send({message: "Team Successfully deleted"});
            }
        else {return res.status(400).send({message: "Team does not exist"});}
        
//            const searchQuery = { teamName: new MongoDB.ObjectID(req.query.teamName)};
//            await dbo.collection("teams").deleteOne(searchQuery);
//            res.status(200).send({message: "Team Successfully deleted"});
            db.close();
        }catch(ex)
        {
            res.status(500).send({message:"Unable to delete team"});
            db.close();
        }

    },
    
    
    checkTeam: async function (req, res) {
    const db = await MongoClient.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');

        try
        {
                        
            const token = req.header('Authentication');
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);  
            var userId = decoded.user_id;  
            console.log(userId);


        const teamExist = await dbo.collection("teams").findOne({user_id: new MongoDB.ObjectID(userId)});
        
        if (teamExist) return res.status(200).send({message: "Retrieved a team", team_id:teamExist._id, teamName:teamExist.teamName, 
            teamColor:teamExist.teamColor, teamLevel:teamExist.teamLevel});
        else return res.status(404).send({message: "No team exists"});

        db.close();
        }catch(ex)
        { 
            res.status(500).send({message:"Unable to load a team", error:ex});
            db.close();
        }
     },
    
    
}
