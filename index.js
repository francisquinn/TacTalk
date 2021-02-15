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
const cors = require("cors");
var CompileDictionary = require('./CompileDictionary');
var UpdateGame = require('./UpdateGame');
var CloudFunction = require('./CloudFunction');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

//var sampleQuery = {player_name : "jerry",
//                            player_age: "30",
//                            player_number: "5"};
//                        console.log(JSON.stringify(sampleQuery));



//Validation
//---------------------------------------------------------------------------------------------------------------------------
//validation for creating a player
const createPlayerValidation = {
  body: Joi.object({
    player_name: Joi.string()
      .regex(/[a-zA-Z]/)
      .max(20)
      .min(2)
      .required()
      .messages({'string.base': `Name should be a type of 'text'`,
                 'string.empty': `Name cannot be an empty field`,
                 'string.min': `Name should have a minimum length of {#limit} characters`,
                 'string.max': `Name should have a maximum length of {#limit} characters`,
                 'string.pattern.base': `Name can only contain text`,
                 'any.required': `"Name" is a required field`}),
    player_age: Joi.string()
    //only allow ages between 1 - 59
      .regex(/^[1-5]?[0-9]$/)
      .required()
      .messages({'string.base': `Age was not input in the correct format. It should be a number between 1 and 59`,
                 'string.pattern.base': `Age was not input in the correct format. It should be a number between 1 and 59`,
                 'string.empty' : `Age is a required field`,
                 'any.required': `Age is a required field`}),
    player_number: Joi.string()
    //only allow jersey numbers from 1 - 29
      .regex(/^[1-2]?[0-9]$/)
      .required()
      .messages({'string.base': `Number was not input in the correct format. It should be a number between 1 and 29`,
                 'string.pattern.base': `Number should between 1 and 29`,
                 'string.empty' : `Number is a required field`,
                 'any.required': `Number is a required field`}),
      
  }),
  
}

//---------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------------------
//validation for searching for a player
const searchPlayerValidation = {
  body: Joi.object({
    player_name: Joi.string()
      .regex(/[a-zA-Z]/)
      .max(50)
      .min(2)
      .required()
      .messages({'string.base': `Name should be a type of 'text'`,
                 'string.empty': `Name cannot be an empty field`,
                 'string.min': `Name should have a minimum length of {#limit} characters`,
                 'string.max': `Name should have a maximum length of {#limit} characters`,
                 'string.pattern.base': `Name can only contain text`,
                 'any.required': `"Name" is a required field`}),
      
  }),
  
}
//---------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------------------
//validation for calls getting details by id
const getIdValidation = {
  body: Joi.object({
    _id: Joi.string()
      .required()
      .messages({'string.base':  `Details input incorrectly`,
                 'string.empty': `Needs id to continue`,
                 'any.required': `The id field is required`}),
      
  }),
  
}

//---------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------------------
//validation for getting user match details based off their id
const getUserMatchDetailsByIdValidation = {
  body: Joi.object({
    user_id: Joi.string()
      .required()
      .messages({'string.base':  `Details input incorrectly`,
                 'string.empty': `The id is required`,
                 'any.required': `This field is required`}),
      
  }),
  
}

//---------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------------------
//valduation for login 
const loginValidation = {
  body: Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required()
      .messages({'string.base': `Email is required`,
                 'string.empty': `You need to input an email`,
                 'string.email': `Email must end in .com or .net and contain an @`,
                 'any.required': `Email is a required field`}),
    password: Joi.string()
    //minimum 1 upper and lower case letter, 8 characters, 1 special character and 1 number
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-><\/:;~]).{8,}$/)
      .min(8)
      .required()
      .messages({'string.base': `Password was not input in the correct format.`,
                 'string.pattern.base': `Incorrect Password format, needs at least: 1 upper and lower case letter, 8 characters, 1 special character and 1 number `,
                 'string.min': `Password should have a minimum length of {#limit} characters`,
                 'string.empty' : `Password is a required field`,
                 'any.required': `Password is a required field`})      
  }),
  
}

//---------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------------------
//valduation for register
const registerValidation = {
  body: Joi.object({
    username: Joi.string()
      .regex(/[a-zA-Z]/)
      .max(50)
      .min(2)
      .required()
      .messages({'string.base': `Name should be text`,
                 'string.empty': `Name cannot be an empty field`,
                 'string.min': `Name should have a minimum length of {#limit} characters`,
                 'string.max': `Name should have a maximum length of {#limit} characters`,
                 'string.pattern.base': `Name can only contain text`,
                 'any.required': `Name is a required field`}),
    password: Joi.string()
    //minimum 1 upper and lower case letter, 8 characters, 1 special character and 1 number
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-><\/:;~]).{8,}$/)
      .min(8)
      .required()
      .messages({'string.base': `Password was not input in the correct format.`,
                 'string.pattern.base': `Incorrect Password format, needs at least: 1 upper and lower case letter, 8 characters, 1 special character and 1 number `,
                 'string.min': `Password should have a minimum length of {#limit} characters`,
                 'string.empty' : `Password is a required field`,
                 'any.required': `Password is a required field`}), 
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required()
      .messages({'string.base': `Email is required`,
                 'string.empty': `You need to input an email`,
                 'string.email': `Email must end in .com or .net and contain an @`,
                 'any.required': `Email is a required field`}),
  }),
}

//---------------------------------------------------------------------------------------------------------------------------


app.get('/user/games/delete', validate(getIdValidation, {}, {} ), async (req, res) => 
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
app.get('/user/users/delete_user_by_id', validate(getIdValidation, {}, {} ), async (req, res) => 
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

//---------------------------------------------------------------------------------------------------------------------------------------
//Delete player by id
app.get('/user/players/delete_player_by_id', validate(getIdValidation, {}, {} ), async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId)};
        dbo.collection("players").deleteOne(searchQuery);
        res.end(JSON.stringify({code:200}));
        db.close();
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
        db.close();
    }
    
})
//------------------------------------------------------------------------------------------------------------------------------------------

app.get('/user/games/get/id', validate(getIdValidation, {}, {} ), async (req, res) => 
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

async function createGameEvent(gameID,gameEvent)
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    console.log("called")
    try
    {
        
        const searchQuery = { _id: new MongoDB.ObjectID(gameID) };
        
        const updateDocument = 
        {
            "$push":
            {
                "possessions": 
                {
                    $last:"$possessions"
                }
            }
        }
        await dbo.collection("games").updateOne(searchQuery, updateDocument, function(err)
        {
            if (err) return;
            console.log("success")
            db.close();
        });
    }catch(ex)
    {
        console.log(ex)
        db.close();
    }
    
}




//-----------------------------------------------------------------------------------------------------------------------------------------------
//getting game details by game id
app.get('/user/games/get/game_by_id', validate(getIdValidation, {}, {} ), async (req, res) => 
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
app.get('/user/games/get/user_game_details', validate(getUserMatchDetailsByIdValidation, {}, {} ), async (req, res) => 
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
app.get('/user/users/get/user_details_by_id', validate(getIdValidation, {}, {} ), async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        //Details used to call method put in here
        const searchQuery = { _id: new MongoDB.ObjectID(req.query._id)};
        
        var result = await dbo.collection("users").findOne(searchQuery);
        res.end(JSON.stringify({code:200, result: result}));
        db.close();
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
        db.close();
    }
    
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------------------
//getting user with name similar to one typed in
//returns - code:200,result:null
app.get('/user/users/get/search_similar_players_by_name', validate(searchPlayerValidation, {}, {} ), async (req, res) => 
{
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
    
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------------------
//(read )getting player info based off id- WORKS
app.get('/user/players/get/player_details_by_id', validate(getIdValidation, {}, {} ), async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        //Details used to call method put in here
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId) };
      
        var result = await dbo.collection("players").findOne(searchQuery);

        res.end(JSON.stringify({code:200, result: result}));
        db.close();
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500, error:ex.toString()}));
        db.close();
    }
    
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------


app.get('/user/users/get_secure', validate(getIdValidation, {}, {} ), async (req, res) => 
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

app.get('/user/games/create', async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    console.log("run");
    try
    {
        var newGameObject = 
                {
                    game_name:req.body.gameName,
                    user_id:req.body.userId,
                    team_id:req.body.teamId,
                    start_time:req.body.matchTime,
                    public:req.body.public,
                    date:req.body.matchDate.toString(),
                    location:req.body.location,
                    team_color:req.body.teamColor,
                    opp_team_color:req.body.oppTeamColor,
                    possessions:[]
                };
        
        await dbo.collection("games").insertOne(newGameObject, function(err){
            if (err)
                console.log(err.toString());
                return;
            // Object inserted successfully.
           console.log("stage 1");
            var newActiveGameObject =
                    {
                        game_id: newGameObject._id,
                        last_string:[],
                        input_list:[],
                        current_order:0
                    }
            dbo.collection("active_games").insertOne(newActiveGameObject)
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

//---------------------------------------------------------------------------------------------------------------------------------------------------
//create players - WORKS
//
app.post('/user/players/create_player', validate(createPlayerValidation, {}, {} ), async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    
    try
    {
        var newPlayerObject = 
                {
                    player_name:req.body.player_name,
                    player_age:req.body.player_age,
                    player_number:req.body.player_number
                };
        
        await dbo.collection("players").insertOne(newPlayerObject, function(err){
            //if (err) return;
            // Object inserted successfully.

            
            res.end(JSON.stringify({code:200,_id:newPlayerObject._id}));
            db.close();
        });
        
    }catch(ex)
    { 
        res.end(JSON.stringify({code:500,error:ex}));
        db.close();
    }

})



//---------------------------------------------------------------------------------------------------------------------------------------------------


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

//--------------------------------------------------------------------------------------------------------------------------------------------
//Updating player details based off player id - more work needed
app.get('/user/players/update_player', async (req, res) => 
{
    
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    
    try
    {
     
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId)};
        
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
    
})

//------------------------------------------------------------------------------------------------------------------------------------------------

app.post('/user/login', validate(loginValidation, {}, {} ), async (req, res) => 
{
    
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        
        var result = await dbo.collection("users").findOne(
                {
                    email: req.body.email,
                    password: req.body.password
                });
        
        
        
        if (result)
        {
            res.end(JSON.stringify({code:200, user_id: result._id}));
            db.close();
        }
        else
        {
            res.end(JSON.stringify({code:200, user_id: 0}));
            db.close();
        }
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
        db.close();
    }
    
})

app.post('/user/register', validate(registerValidation, {}, {} ), async (req, res) =>
{

    
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        var newUserObject =
        {
            username: req.body.username,
            password: req.body.password,
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
            return res.status(err.statusCode).json(err)
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
app.post('/cloud/game_events/create', CloudFunction.createInput);

