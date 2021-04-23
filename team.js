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
        if(teamExist) return res.status(400).send({message: "Team Already Exists"});

        try
        {
            
                const token = req.header('Authentication');
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET);  
                var userId = decoded.user_id;  
                console.log(userId);
            
            var newTeamObject = 
                    {
                       user_id: new MongoDB.ObjectID(userId),
                        team_name:req.body.teamName,
                        team_color:req.body.teamColor,
                        team_level:req.body.teamLevel

                    };

           await dbo.collection("teams").insertOne(newTeamObject, function(err){
                
        
                res.status(200).send({message:"Successfully Created Your Team", team_id:newTeamObject._id, team_name:req.body.teamName,
                                     team_color:req.body.teamColor, team_level:req.body.teamLevel });
                db.close();
            });

        }catch(ex)
        { 
            res.status(500).send({message:"Unable To Create Your Team", error:ex});
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
            const teamExist = await dbo.collection("teams").findOne({team_name:req.body.teamName});
            if(teamExist)
            { 
                await dbo.collection("teams").deleteOne(teamExist); 
                return res.status(200).send({message: "Team Successfully Deleted"});
            }
        else {return res.status(400).send({message: "Team Does Not Exist"});}
        
            db.close();
        }catch(ex)
        {
            res.status(500).send({message:"Unable To Delete Team"});
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
        
        if (teamExist) return res.status(200).send({message: "Retrieved A Team", team_id:teamExist._id, team_name:teamExist.team_name, 
            team_color:teamExist.team_color, team_level:teamExist.team_level});
        else return res.status(404).send({message: "No Team Exists"});

        db.close();
        }catch(ex)
        { 
            res.status(500).send({message:"Unable To Load A Team", error:ex});
            db.close();
        }
     },
    
    
}
