const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require("mongodb");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const {createPlayerValidation} = require('./validation');
var jwt = require("jsonwebtoken");
dotenv.config();

//create players
module.exports = {  
  createPlayer: async function (req, res) {
    const db = await MongoClient.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');

           //getting validation and displaying the error message if details are entered incorrectly
            const {error} = createPlayerValidation(req.body);
            if(error) return res.status(400).send(error.details[0]);  

        try
        {
            
                const token = req.header('Authentication');
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET);  
                var userId = decoded.user_id;  
                console.log(userId);
                
                
                
            var newPlayerObject = 
                    {
                        user_id: new MongoDB.ObjectID(userId),
                        team_id:new MongoDB.ObjectID(req.body.team_id),
                        player_name:req.body.playerName,
                        player_number:req.body.playerNumber
                    };

            await dbo.collection("players").insertOne(newPlayerObject, function(err){

                res.status(200).send({message: "Player Successfully Created", player_id:newPlayerObject._id,player_name:req.body.playerName,
                                        player_number:req.body.playerNumber});
                db.close();
            });

        }catch(ex)
        { 
            res.status(500).send({message: "Unable To Create Player", error:ex});
            db.close();
        }

    },

//getting player info based off id
    readPlayer: async function (req, res) {
        const db = await MongoClient.connect(process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');
        try
        {
            //Details used to call method put in here
            const searchQuery = { _id: new MongoDB.ObjectID(req.query._id) };

            var result = await dbo.collection("players").findOne(searchQuery);

            res.status(200).send({message: "Successfully Retrieved Player", player_name: result.player_name, player_number: result.player_number});
            db.close();

        }catch(ex)
        {
            res.status(500).send({message:"Unable To Retrieve Player", error:ex.toString()});
            db.close();
        }
    
    },
    
    
    //getting all players
    allPlayers: async function (req, res) {
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

            await dbo.collection("players").find({user_id: new MongoDB.ObjectID(userId),team_id:new MongoDB.ObjectID(req.body.team_id) }, 
            {projection: {_id: 0, player_name: 1, player_number: 1} }).toArray(function(err,result)
            {           
                
                if (err) throw err;
                if (result.length >= 1)
                {
                res.status(200).send({message: "Retrieved All Players", result});
                }else
                {
                res.status(404).send({message: "No Players Found"}); 
                }
                db.close();  
            
            });


        }catch(ex)
        {
            res.status(500).send({message: "Unable To Retrieve Players", error:ex.toString()});
            db.close();
        }
    
    },
    
    
    
//Updating player details based off player id - more work needed
    updatePlayer :async function (req, res) {
        const db = await MongoClient.connect(process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');

        try
        {
            console.log("run")
            console.log(JSON.parse(req.query.updateObject));
            const searchQuery = { _id: new MongoDB.ObjectID(req.query._id)};

            const updateDocument = 
            {
                "$set":
                    JSON.parse(req.query.updateObject)

            }
            await dbo.collection("players").updateOne(searchQuery, updateDocument, function(err)
            {
                if (err) return;


                res.status(200).send({message:"Successfully Updated Player"});
                db.close();
            });
        }catch(ex)
        {
            res.status(500).send({message: "Unable To Update Player", error:ex.toString()});
            db.close();
        }

    },

//Delete player by id
    deletePlayer: async function (req, res) {
        const db = await MongoClient.connect(process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');
        try
        {
            const searchQuery = { _id: new MongoDB.ObjectID(req.query._id)};
            await dbo.collection("players").deleteOne(searchQuery);
            res.status(200).send({message: "Player Successfully Deleted"});
            db.close();
        }catch(ex)
        {
            res.status(500).send({message:"Unable To Delete Player"});
            db.close();
        }

    },

//getting user with name similar to one typed in
    similarName:  async function (req, res) {
        const db = await MongoClient.connect(process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');
        try
        {
            //Details used to call method put in here
            const searchQuery = { player_name: req.query.player_name };

            var result = await dbo.collection("players").findOne(searchQuery);
            res.status(200).send({message: "Found Players", result: result});
            db.close();

        }catch(ex)
        {
            res.status(500).send({message: "No Players With That Name"});
            db.close();
        }
    }
};
