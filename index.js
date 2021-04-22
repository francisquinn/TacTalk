let port = process.env.PORT;
if (port == null || port == "") 
{
    //default port number if none is assigned
    port = 8080;
}

const http = require('http');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require('mongodb');
const cp = require('./CommandParser');
const stats = require('./Stats');
const express = require('express');
const app = express();
const uri = process.env.DB_CONNECT
const Games = require("./Games");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var FormData = require('form-data');
const bodyParser = require('body-parser');
const enums = require("./enums");
const cd = require("./CompileDictionary");
var CompileDictionary = require('./CompileDictionary');
var UpdateGame = require('./UpdateGame');
var CloudFunction = require('./CloudFunction');
var passwordHash = require('password-hash');
var jwt = require("jsonwebtoken");

const Util = require("./Util");
const EventToText = require("./EventToText");
const verify = require('./verifyToken');

const Login = require('./login');
const Register = require('./register');
const Player = require('./player');
const Team = require('./team');
const Game = require('./game');
const User = require ('./user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/user/games/delete',  async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');
        try
        {
            const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId) };
            dbo.collection("games").deleteOne(searchQuery);
            res.status(200).send({message: "Game Deleted"});
             db.close();
        }catch(ex)
        {
            res.status(500).send({message: "Unable To Delete Game"});
             db.close();
        }
})

app.get('/user/possessions/delete', async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId), "possessions.possession_id": req.query.pid };
        dbo.collection("games").deleteOne(searchQuery);
        res.status(200).send({message: "Possession Successfully Deleted"});
        db.close();
    }catch(ex)
    {
        res.status(500).send({message: "Unable To Delete Possession"});
        db.close();
    }
})

app.get('/user/game_events/delete', async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId), "possessions.possession_id": req.query.pid, "possessions.events.event_id": req.query.eid };
        dbo.collection("games").deleteOne(searchQuery);
        res.status(200).send({message: "Game Event Deleted"});
        db.close();
    }catch(ex)
    {
        res.status(500).send({message: "Unable To Delete Game Event"});
        db.close();
    }
})


//validate(getIdValidation, {}, {} ),
app.get('/user/games/get/id',  async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId)};
        
        var result = await dbo.collection("games").findOne(searchQuery);
        res.status(200).send({ message: "Game Successfully Retrived", result: result});
        db.close();
        
    }catch(ex)
    {
        res.status(500).send({message: "Unable To Retrieve Game"});
        db.close();
    }
})

//-----------------------------------------------------------------------------------------------------------------------------------------------
app.get('/user/games/get/game_by_id',  async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.object_id)};
        
        var result = await dbo.collection("games").findOne(searchQuery);
        res.status(200).send({message: "Id Retrived", result: result});
        db.close();
       
    }catch(ex)
    {   
        res.status(500).send({message: "Unable To Retireve Id",error:ex.toString()});
        db.close();
    }
})
//--------------------------------------------------------------------------------------------------------------------------------------
app.get('/user/games/get/user_game_details',  async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        //Details used to call method put in here
        const searchQuery = { user_id:  new MongoDB.ObjectID(req.query.user_id) };
        
        var result = await dbo.collection("games").findOne(searchQuery);


        res.status(200).send({message: "Successfully Retreived Game", result: result});
        db.close();
        
    }catch(ex)
    {
        res.status(500).send({message: "Unable To Retrive Game", error:ex.toString()});
        db.close();
    }
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------

app.get('/user/users/get_secure',  async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId)};
        var result = await dbo.collection("games").findOne(searchQuery);
        res.send(200).send({message: "Success", result: result});
        db.close();
        
    }catch(ex)
    {
        res.satus(500).send({message: "Failure"});
        db.close();
    }    
})


app.post('/user/game_events/create', async (req, res) => 
{
    
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        
        var newGameEventObject = cp.parseCommand(req.body.textInput,req.body.time,null);
        const searchQuery = { _id: new MongoDB.ObjectID(req.body.object_id),"possessions.possession_id":new MongoDB.ObjectID(req.body.pid) };
        
        const updateDocument = 
        {
            "$push":
            {
                "possessions.$.events": newGameEventObject
            }
        }
        await dbo.collection("games").updateOne(searchQuery, updateDocument, function(err)
        {
            if (err) return;
            res.status(200).send({message:"Game Event Created",event:newGameEventObject});
            db.close();
        });
    }catch(ex)
    {
        res.status(500).send({message:"Unable To Create Game Event",error:ex.toString()});
        db.close();
    }    
})

app.get('/user/game_events/update', async (req, res) => 
{
    
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        var newGameEventObject = cp.parseCommand(req.query.textInput,req.query.time,null);
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId),"possessions.possession_id":req.query.pid,"possessions.events.event_id": req.query.eid };
        
        const updateDocument = 
        {
            "$set":
                JSON.parse(req.query.updateObject)
            
        }
        await dbo.collection("games").updateOne(searchQuery, updateDocument, function(err)
        {
            if (err) return;
            
            res.write(JSON.stringify(newGameEventObject));
            res.status(200).send({message: "Game Event Updated"});
            db.close();
        });
    }catch(ex)
    {
        res.status(500).send({message:"Unable To Update Game Event",error:ex.toString()});
        db.close();
    }
})

//------------------------------------------------------------------------------------------------------------------
app.get('/user/active_games/move_from_active_to_finished', async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        const searchQuery = { game_id: new MongoDB.ObjectID(req.query.game_id)};
        
        var newActiveGameObject = await dbo.collection("active_games").findOne(searchQuery);
        await dbo.collection("finished_games").insertOne(newActiveGameObject);
        dbo.collection("active_games").deleteOne(searchQuery);
       
        res.status(200).send({message: "Game Successful Moved To Finished", object: newActiveGameObject});
        db.close();
    }catch(ex)
    {
        res.status(500).send({message: "Unable To Move Active Game To Finished Game"});
        db.close();
    }
})

//----------------------------------------------------------------------------------------------------------------
app.get('/', async (req, res) => 
{
    var fs = require("fs");
    fs.readFile(__dirname+'/view/index.html', 'utf8', (err, text) => {
        res.send(text);
    });
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

app.get('/recorder', async (req, res) => 
{
    var fs = require("fs");
    fs.readFile(__dirname+'/recorder/recorder.html', 'utf8', (err, text) => {
        res.send(text);
    });
})

app.get('/compileDictionary', async (req, res) => 
{
    var fs = require("fs");
    fs.readFile(__dirname+'/util/dictionary.html', 'utf8', (err, text) => {
        res.send(text);
    });
})

app.get('/createTrainingMaterial', async (req, res) => 
{
    var fs = require("fs");
    fs.readFile(__dirname+'/training/createTrainingMaterial.html', 'utf8', (err, text) => {
        res.send(text);
    });
})

app.get('/user/games/updateStats',UpdateGame.updateStats);
app.get('/user/games/updateGame', verify.Verify, UpdateGame.updateGame );
app.get('/dictionary', CompileDictionary.dictionary);
app.get('/cloud/dictionary/create', CompileDictionary.createDictionary);
app.get('/cloud/createInput', CloudFunction.createInput);
app.get('/dev/games/event_to_text',EventToText.eventToText);
app.get('/dev/util/clear_game',Util.resetGame);

app.get('/user/players/delete_player', Player.deletePlayer);
app.get('/user/players/get/player_details', Player.readPlayer);
app.get('/user/players/update_player', Player.updatePlayer);
app.get('/user/users/get/search_similar_players_by_name',Player.similarName);
app.get('/user/players/all_players', Player.allPlayers);
app.get('/user/users/get/user_details',verify.Verify, User.getUserDetails);
app.get('/user/users/delete_user',verify.Verify, User.deleteUser);
app.get('/user/users/delete_team',verify.Verify, Team.deleteTeam);
app.get('/user/check_team_exists',verify.Verify, Team.checkTeam);

app.post('/user/register', Register.registerUser);
app.post('/user/login', Login.loginUser);
app.post('/user/create_team',verify.Verify, Team.createTeam);
app.post('/user/players/create_player',verify.Verify, Player.createPlayer);
app.post('/user/games/create',verify.Verify, Game.createGame );
