const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require("mongodb");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const { validate, ValidationError, Joi } = require('express-validation');
const uri = process.env.DB_CONNECT;
dotenv.config();

//var sampleQuery = {player_name : "jerry",
//                            player_age: "30",
//                            player_number: "5"};
//                        console.log(JSON.stringify(sampleQuery));


//create players
//validate(createPlayerValidation, {}, {} ),
module.exports = {  
   createPlayer: async function(req, res) { 

        const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');

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
//validate(getIdValidation, {}, {} ),
    readPlayer: async function (req, res) {

        const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
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

//Updating player details based off player id - more work needed
    updatePlayer :async function(req, res) {

        const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');

        try
        {
            console.log("run")
            console.log(JSON.parse(req.query.updateObject));
            const searchQuery = { _id: new MongoDB.ObjectID(req.query._id)};

    //        var sampleQuery = {player_name : "jerry",
    //                            player_age: "30",
    //                            player_number: "5"};
    
            
            

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
//validate(getIdValidation, {}, {} ),
    deletePlayer: async function (req, res) { 

        const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });

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
//returns - code:200,result:null
//validate(searchPlayerValidation, {}, {} ),
    similarName:  async function(req, res){
        const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
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
