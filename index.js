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
var passwordHash = require('password-hash');


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
      .messages({'string.base':  `Incorrect Id was used`,
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
                 'string.empty': `Email is required`,
                 'string.email': `Email must end in .com or .net and contain an @`,
                 'any.required': `Email is a required field`}),
    password: Joi.string()
    //minimum 1 upper and lower case letter, 8 characters, 1 special character and 1 number
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-><\/:;~]).{8,}$/)
      .min(8)
      .required()
      .messages({'string.base': `Password was not input in the correct format.`,
                 'string.pattern.base': `Password format incorrect, needs at least: 1 upper and lower case letter, 8 characters, 1 special character and 1 number `,
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
                 'string.pattern.base': `Password format incorrect, needs at least: 1 upper and lower case letter, 8 characters, 1 special character and 1 number `,
                 'string.min': `Password should have a minimum length of {#limit} characters`,
                 'string.empty' : `Password is a required field`,
                 'any.required': `Password is a required field`}), 
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required()
      .messages({'string.base': `Email is required`,
                 'string.empty': `Email is required`,
                 'string.email': `Email must end in .com or .net and contain an @`,
                 'any.required': `Email is a required field`}),
  }),
}

//---------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------------------
//valduation for creating match
const createMatchValidation = {
  body: Joi.object({
    game_name: Joi.string()
      .regex(/[a-zA-Z0-9]/)
      .max(50)
      .min(5)
      .required()
      .messages({'string.base': `Name should be text`,
                 'string.empty': `Name cannot be an empty field`,
                 'string.min': `Name should have a minimum length of {#limit} characters`,
                 'string.max': `Name should have a maximum length of {#limit} characters`,
                 'string.pattern.base': `Name can only contain text and numbers`,
                 'any.required': `Name is a required field`}),
    start_time: Joi.string()
    //only allows time in 24 our format - e.g. 13:25
    //means if a 0 or 1 is entered it can be followed by any number [01]\d or is a 2 is entered then can only be followed by a 0,1,2,3
    //: means colon has to be input followed by any number from 0-5 then followed by any digit
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .max(5)
      .min(5)
      .required()
      .messages({'string.base': `Start time was not input in the correct format. E.g. 13:25`,
                 'string.pattern.base': `Start time was not input in the correct format. E.g. 14:25`,
                 'string.min': `Start time was not input in the correct length. E.g. 15:25`,
                 'string.max': `Start time was not input in the correct format. E.g. 16:25`,
                 'string.empty' : `Start time is a required field`,
                 'any.required': `Start time is a required field`}), 
    public: Joi.string()
    //means only 0 or 1 can be entered
      .regex(/[0|1]$/)
      .max(1)
      .required()
      .messages({'string.base': `Public is required`,
                 'string.max': `Public has to have an input`,
                 'string.pattern.base': `Public can only be a 0 or 1`,
                 'string.empty': `Public is required`,
                 'any.required': `Public is a required field`}),
    game_type: Joi.string()
      .regex(/[a-zA-Z0-9]/)
      .max(30)
      .min(5)
      .required()
      .messages({'string.base': `Game type is required`,
                 'string.empty': `Game type is required`,
                 'string.max':`Game type can only be 30 characters long`,
                 'string.min':`Game type has to be at least 5 characters long`,
                 'any.required': `Game type is a required field`}),
    date: Joi.string()
      .required()
      .messages({'string.base': `Date is required`,
                 'string.empty': `Date is required`,
                 'any.required': `Date is a required field`}),
    location: Joi.string()
      .required()
      .messages({'string.base': `location is required`,
                 'string.empty': `location is required`,
                 'any.required': `location is a required field`}),         
    team_colour: Joi.string()
      .required()
      .messages({'string.base': `Team color is required`,
                 'string.empty': `Team color is required`,
                 'any.required': `Team color is a required field`}),
    team_name: Joi.string()
      .required()
      .messages({'string.base': `Team name is required`,
                 'string.empty': `Team name is required`,
                 'any.required': `Team name is a required field`}),
    opp_team_colour: Joi.string()
      .required()
      .messages({'string.base': `Opposition team color is required`,
                 'string.empty': `Opposition team color is required`,
                 'any.required': `Opposition team color is a required field`}),
    opp_team_name: Joi.string()
      .required()
      .messages({'string.base': `Opposition team name is required`,
                 'string.empty': `Opposition team name is required`,
                 'any.required': `Opposition team name is a required field`}),
    team_id: Joi.string()
      .required()
      .messages({'string.base': `team_id is required`,
                 'string.empty': `team_id is required`,
                 'any.required': `team_id is a required field`}),
    user_id: Joi.string()
      .required()
      .messages({'string.base': `user_id is required`,
                 'string.empty': `user_id is required`,
                 'any.required': `user_id is a required field`}),
//    possessions: Joi.string()             
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

app.post('/user/games/create', validate(createMatchValidation, {}, {} ), async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
//    console.log("run");
    try
    {
        var newGameObject = 
                {
                    game_name:req.body.game_name,
                    user_id:new MongoDB.ObjectID(req.body.user_id),
                    team_id:new MongoDB.ObjectID(req.body.team_id),
                    start_time:req.body.start_time,
                    public:req.body.public,
                    game_type : req.body.game_type,
                    date:req.body.date,
                    location:req.body.location,
                    team_colour:req.body.team_colour,
                    team_name:req.body.team_name,
                    opp_team_colour:req.body.opp_team_colour,
                    opp_team_name:req.body.opp_team_name,
                    possessions:[]
                };
        
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
                        team_colour: req.body.team_colour,
                        opp_team_colour: req.body.opp_team_colour
                        
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
//validate(loginValidation, {}, {} ),
app.post('/user/login',  async (req, res) => 
{
    
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {

        var searchQuery = {
                            email: req.body.email                           
                          }
           

        var result = await dbo.collection("users").findOne(searchQuery);

        if (result && passwordHash.verify(req.body.password, result.password))
        {
            
                res.end(JSON.stringify({code:200, user_id: result._id}));
                db.close();
            
        
        }
        else
        {
            res.end(JSON.stringify({code:400, message : "Invalid email or password"}));
            db.close();
        }
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:400, message : "Invalid email or password" }));
        db.close();
    }
    
})
//keyByField: true
app.post('/user/register', validate(registerValidation, {}, {} ), async (req, res) =>
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

