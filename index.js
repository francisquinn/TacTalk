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
const uri = "mongodb+srv://RojakAdmin:RojakIsASalad@rojakcluster.ho1ff.mongodb.net/sample_analytics?retryWrites=true&w=majority";
const Games = require("./Games");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var FormData = require('form-data');
const bodyParser = require('body-parser');
const { validate, ValidationError, Joi } = require('express-validation');
const enums = require("./enums");
const cd = require("./CompileDictionary");
var CompileDictionary = require('./CompileDictionary');
var UpdateGame = require('./UpdateGame');
var CloudFunction = require('./CloudFunction');
var passwordHash = require('password-hash');
const verify = require('./verifyToken');
var jwt = require("jsonwebtoken");

const Util = require("./Util");
const EventToText = require("./EventToText");

const Login = require('./login');
const Player = require('./player');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//validate(getIdValidation, {}, {} ),
app.get('/user/games/delete',  async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');
        try
        {
            const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId) };
            dbo.collection("games").deleteOne(searchQuery);
            res.end(JSON.stringify({code:200}));
             db.close();
        }catch(ex)
        {
            res.end(JSON.stringify({code:500}));
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
        res.end(JSON.stringify({code:200}));
        db.close();
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
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
        res.end(JSON.stringify({code:200}));
        db.close();
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
        db.close();
    }
    
})
//---------------------------------------------------------------------------------------------------------------------------------------
//Delete user by id -WORKS
//validate(getIdValidation, {}, {} ),
app.get('/user/users/delete_user_by_id',  async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId)};
        dbo.collection("users").deleteOne(searchQuery);
        res.end(JSON.stringify({code:200}));
        db.close();
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
        db.close();
    }
    
})
//------------------------------------------------------------------------------------------------------------------------------------------


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
        res.end(JSON.stringify({code:200, result: result}));
        db.close();
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
        db.close();
    }
   
})





//-----------------------------------------------------------------------------------------------------------------------------------------------
//getting game details by game id
//validate(getIdValidation, {}, {} ),
app.get('/user/games/get/game_by_id',  async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.object_id)};
        
        var result = await dbo.collection("games").findOne(searchQuery);
        res.end(JSON.stringify({code:200, result: result}));
        db.close();
        
    }catch(ex)
    {
        
        res.end(JSON.stringify({code:500 , error:ex.toString()}));
        db.close();
    }
    
})
//--------------------------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------------------
//getting game details based off userid - WORKS
//currently dispays all details
//validate(getUserMatchDetailsByIdValidation, {}, {} ),
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


        res.end(JSON.stringify({code:200, result: result}));
        db.close();
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500, error:ex.toString()}));
        db.close();
    }
    
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------------------
//getting user by id - WORKS
//currently dispays all details
//validate(getIdValidation, {}, {} ),
app.get('/user/users/get/user_details_by_id',  async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        //Details used to call method put in here
        const searchQuery = { _id: new MongoDB.ObjectID(req.query._id)};
        
        var result = await dbo.collection("users").findOne(searchQuery);
        res.end(JSON.stringify({code:200, username: result.username, email: result.email}));
        db.close();
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
        db.close();
    }
    
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------



//validate(getIdValidation, {}, {} ),
app.get('/user/users/get_secure',  async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId)};
        var result = await dbo.collection("games").findOne(searchQuery);
        res.end(JSON.stringify({code:200, result: result}));
        db.close();
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
        db.close();
    }
    
})

//validate(createMatchValidation, {}, {} ),
app.post('/user/games/create', verify, async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
//    console.log("run");
    try
    {
        var newGameObject = 
                {
                    user_id:new MongoDB.ObjectID(req.body.user_id),
                    team_id:new MongoDB.ObjectID(req.body.team_id),
                    startTime:req.body.startTime,
                    public:req.body.public,
                    gameType : req.body.gameType,
                    startDate:req.body.startDate,
                    location:req.body.location,
                    teamColor:req.body.teamColor,
                    teamName:req.body.teamName,
                    oppColor:req.body.oppColor,
                    opposition:req.body.opposition,
                    possessions:[]
                };
                
        const token = jwt.sign(
          { user_id: new MongoDB.ObjectID(req.body.user_id) },
          process.env.TOKEN_SECRET
        );

        res.header("Authentication", token);
        
        await dbo.collection("games").insertOne(newGameObject, function(err){
//            if (err)
//                console.log(err.toString());
//                return;
//            // Object inserted successfully.
//           console.log("stage 1");
//            res.end(JSON.stringify({code:200, game_name:req.body.game_name}));
//            db.close();
            

        });
        var newActiveGameObject =
                    {
                        game_id: newGameObject._id,
                        user_id: new MongoDB.ObjectID(req.body.user_id),
                        last_string:[],
                        input_list:[],
                        current_order:0,
                        current_event:{},
                        active: 1,
                        current_possession: -1,
                        teamColor: req.body.teamColor,
                        oppColor: req.body.oppColor
                        
                    }
            await dbo.collection("active_games").insertOne(newActiveGameObject, function(err){
            console.log("done");
            res.end(JSON.stringify({code:200,_id:newGameObject._id}));

            
            db.close();                
            });
    }catch(ex)
    { 
        res.end(JSON.stringify({code:500,error:ex}));
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
            res.end(JSON.stringify({event:newGameEventObject},{code:200}));
            db.close();
        });
    }catch(ex)
    {
        res.end(JSON.stringify({code:500,error:ex.toString()}));
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
            res.end(JSON.stringify({code:200}));
            db.close();
        });
    }catch(ex)
    {
        res.end(JSON.stringify({code:500,error:ex.toString()}));
        db.close();
    }
    
})



//keyByField: true
//validate(registerValidation, {}, {} ),
app.post('/user/register',  async (req, res) =>
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        var hashedPassword = passwordHash.generate(req.body.password)
        var newUserObject =
        {
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email
        };
        
        await dbo.collection("users").insertOne(newUserObject, function(err){
//            if (err) 
                
            // Object inserted successfully.
           
        
            res.end(JSON.stringify({code:200,_id:newUserObject._id}));
            db.close();
        });
       
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500,error:ex.toString()}));
        db.close();
    }
});

app.get('/user/register/checkNameDuplicates', async (req, res) => 
{
    
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        const searchQuery = { username: req.query.username};
        
        var result = await dbo.collection("users").findOne(searchQuery);
        
        
        
        if (result)
        {
            res.end(JSON.stringify({code:200, result: 1}));
            db.close();
        }
        else
        {
            res.end(JSON.stringify({code:200, result: 0}));
            db.close();
        }
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
        db.close();
    }
    
})

//---------------------------------------------------------------------------------------------------------------------------------------
//checking duplicate team names
app.get('/user/teams/check_team_name_duplicates', async (req, res) => 
{
    
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        const searchQuery = { team_name: req.query.team_name};
        
        var result = await dbo.collection("teams").findOne(searchQuery);
        
        
        
        if (result)
        {
            res.end(JSON.stringify({code:200, result: 1}));
            db.close();
        }
        else
        {
            res.end(JSON.stringify({code:200, result: 0}));
            db.close();
        }
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
        db.close();
    }
    
})

//------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------------------------------
//checking duplicate game names
app.get('/user/teams/check_game_name_duplicates', async (req, res) => 
{
    
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        const searchQuery = { game_name: req.query.game_name};
        
        var result = await dbo.collection("games").findOne(searchQuery);
        
        
        
        if (result)
        {
            res.end(JSON.stringify({code:200, result: 1}));
            db.close();
        }
        else
        {
            res.end(JSON.stringify({code:200, result: 0}));
            db.close();
        }
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
        db.close();
    }
    
})

//------------------------------------------------------------------------------------------------------------------------------------

app.get('/user/register/checkEmailDuplicates', async (req, res) => 
{
    
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        
        var result = await dbo.collection("users").findOne({ "email" : { $regex : new RegExp(req.query.email, "i") } });
        
        
        
        if (result)
        {
            res.end(JSON.stringify({code:200, result: 1}));
            db.close();
        }
        else
        {
            res.end(JSON.stringify({code:200, result: 0}));
            db.close();
        }
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
        db.close();
    }
    
})

//------------------------------------------------------------------------------------------------------------------
//moving match from active to finished
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
        
        
        
        
        res.end(JSON.stringify({code:200, object: newActiveGameObject}));
        db.close();s
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
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

//----------------------------------------------------------------------------------------------------------------------------
//Error message for validation
        app.use(function(err, req, res, next) {
          if (err instanceof ValidationError) {
            return res.status(err.statusCode).json(err.details)
          }

          return res.status(500).json(err)
        })
        
//----------------------------------------------------------------------------------------------------------------------

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

app.get('/user/games/updateGame', UpdateGame.updateGame );
app.get('/dictionary', CompileDictionary.dictionary);
app.get('/cloud/dictionary/create', CompileDictionary.createDictionary);
app.get('/cloud/game_events/create', CloudFunction.createInput);
app.get('/dev/games/event_to_text',EventToText.eventToText);
app.get('/dev/util/clear_game',Util.resetGame);

app.get('/user/players/delete_player_by_id', Player.deletePlayer);
app.get('/user/players/get/player_details_by_id', Player.readPlayer);
app.get('/user/players/update_player', Player.updatePlayer);
app.get('/user/users/get/search_similar_players_by_name',Player.similarName);

app.post('/user/login', Login.loginUser);
app.post('/user/players/create_player', Player.createPlayer);