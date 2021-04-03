const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require("mongodb");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const {createPlayerValidation} = require('./validation');
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
            if(error) return res.status(400).send(error.details[0].message);  

        try
        {
            var newPlayerObject = 
                    {
                        player_name:req.body.player_name,
                        player_number:req.body.player_number
                    };

            await dbo.collection("players").insertOne(newPlayerObject, function(err){

                res.end(JSON.stringify({code:200,_id:newPlayerObject._id}));
                db.close();
            });

        }catch(ex)
        { 
            res.end(JSON.stringify({code:500,error:ex}));
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

            res.end(JSON.stringify({code:200, player_name: result.player_name, player_number: result.player_number}));
            db.close();

        }catch(ex)
        {
            res.end(JSON.stringify({code:500, error:ex.toString()}));
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
            //Details used to call method put in here
//            const searchQuery = { _id: new MongoDB.ObjectID(req.query._id) };

            await dbo.collection("players").find({}, {projection: {_id: 0, player_name: 1, player_number: 1} }).toArray(function(err,result)
            {           
                
                if (err) throw err;
                res.end(JSON.stringify({code:200, result}));
                db.close();  
            
            });
            
//            db.close();

        }catch(ex)
        {
            res.end(JSON.stringify({code:500, error:ex.toString()}));
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


                res.end(JSON.stringify({code:200}));
                db.close();
            });
        }catch(ex)
        {
            res.end(JSON.stringify({code:500,error:ex.toString()}));
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
            res.end(JSON.stringify({code:200}));
            db.close();
        }catch(ex)
        {
            res.end(JSON.stringify({code:500}));
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
            res.end(JSON.stringify({code:200, result: result}));
            db.close();

        }catch(ex)
        {
            res.end(JSON.stringify({code:500}));
            db.close();
        }
    }
};
