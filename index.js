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

app.use(bodyParser.json());
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
        }catch(ex)
        {
            res.end(JSON.stringify({code:500}));
        }
        db.close();
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
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
    db.close();
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
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
    db.close();
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
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
    db.close();
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
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
    db.close();
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
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
    db.close();
})

app.get('/user/games/updateGame', async (req, res) => 
{
    //3-20
    //first is goal second is points
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    
    try
    {
        if (req.query.hasOwnProperty("dummyData"))
        {
            var statsObj = 
            {
                teamGoal : 1,
                teamPoints : 2,
                teamShots : 3,
                teamKickouts : 4,
                teamTurnover : 5,
                teamWides : 6,
                oppTeamGoal : 7,
                oppTeamPoints : 8,
                oppTeamShots : 9,
                oppTeamTurnover : 10
            }
            
            res.end(JSON.stringify({
            result: statsObj,
            code: 200
            }));
            return;
        }
        const searchQuery = { game_id: new MongoDB.ObjectID(req.query.game_id)};
        
        var activeGame = await dbo.collection("active_games").findOne(searchQuery);
        
        
        
        if (!activeGame)
        {
            res.end(JSON.stringify({code:200, gameStatus:"NO_ACTIVE_GAME"}));
        }
        else if(!activeGame.user_id.equals (new MongoDB.ObjectID(req.query.user_id)))
        {
            res.end(JSON.stringify({code:200, gameStatus:"NOT_AUTHORIZED"}));
        }
        else if (activeGame.input_list.length > 0)
        {
            //if there is item in input list
            console.log("input list is not empty")
            
            //sort the input list
            activeGame.input_list.sort(inputListCompare);
            
            for (var i = 0; i < activeGame.input_list.length;i++)
            {
                if (activeGame.current_order + 1 === activeGame.input_list[i].audio_order)
                {
                    activeGame.current_order += 1;
                    for (var j = 0;j < activeGame.input_list[i].text.length; j++)
                    {
                        activeGame.last_string.push(activeGame.input_list[i].text[j]);
                    }
                    
                    
                }
            }
            
            
            var segmentString = "";
            var removeIndex = -1;
            var newPossession = false;
            for(var i = 0;i < activeGame.last_string.length;i++)
            {
                segmentString += " "+activeGame.last_string[i];
                console.log("current state: "+segmentString);
                var parseResult = cp.parseCommand(segmentString,activeGame);
                
                //if the parse result extracted a value
                if (parseResult !== null)
                {
                    
                    //if the current team possession has been changed, change it in active game too
                    if (parseResult.hasOwnProperty("team_id"))
                    {
                        if (activeGame.current_possession_team !== parseResult.team_id)
                        {
                            console.log("different team detected");
                            activeGame.current_possession_team = parseResult.team_id;
                            newPossession = true;
                            
                        }
                    }
                    
                    
                    //cycle through the list of properties
                    for (var j = 0; j < eventPropertyList.length; j++)
                    {
                        if (parseResult.hasOwnProperty(eventPropertyList[j]))
                        {
                            if (!activeGame.current_event.hasOwnProperty(eventPropertyList[j]))
                            {
                                activeGame.current_event = Object.assign({},defaultEvent);
                            }
                            
                            // if the current event already has this property, upload this event, and replace it with a new one
                            if (activeGame.current_event[eventPropertyList[j]] !== -1)
                            {
                                await createGameEvent(activeGame.game_id,activeGame.current_event,activeGame.current_possession_team,newPossession);
                                activeGame.current_event = Object.assign({},defaultEvent);
                                activeGame.current_event[eventPropertyList[j]] = parseResult[eventPropertyList[j]];
                                newPossession = false;
                            }
                            else // or else, add this new property to the exisiting event
                            {
                                activeGame.current_event[eventPropertyList[j]] = parseResult[eventPropertyList[j]];
                            }
                            
                            
                            //reset segment string because the information is extracted
                            segmentString = "";
                            
                            //remembers the index which has already been parsed
                            removeIndex = i;
                            
                            
                        }
                    }
                    
                    
                    
                    
                    
                }
                
            }
            
            //remove the used strings that has already been parsed
            if (removeIndex !== -1)
            {
                activeGame.last_string = activeGame.last_string.slice(removeIndex);
            }
            
            
            
            //update the active_game document in the database to match with the current one
            
            var newActiveGameValues = 
                    {
                        $set:
                        activeGame
                    }
            
            await dbo.collection("active_games").updateOne(searchQuery,newActiveGameValues);
            
            console.log(req.query.game_id +"me");
            var gameSearchQuery = {_id:new MongoDB.ObjectID(req.query.game_id)};
            
            //compile stats and send the response back to user
            var gameObject = await dbo.collection("games").findOne(gameSearchQuery);
            if (gameObject)
            {
                
                
                console.log(gameObject);
                var statResult = stats.getCurrentStats(gameObject);
                res.end(JSON.stringify({code:200, gameStatus: "UPDATING",result: statResult}));
                db.close(); 
            }
            
            
        }
        
        
        
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500, error:ex.toString()}));
    }
    db.close();
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
        });
    }catch(ex)
    {
        console.log(ex)
    }
    db.close();
}

app.post('/cloud/game_events/create', async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    
    try
    {
        var jsonObj = JSON.parse(req.query.package);
        
        var fullText = [];
        
        for (var i = 0;i < jsonObj.length; i++)
        {
            fullText.push(jsonObj[i].text);
        }
        
        var currentTime = new Date();
        var newLogObject = 
                {
                    submit_time:currentTime,
                    text:fullText,
                    game_id:req.query.object_id
                    
                };
        await dbo.collection("log").insertOne(newLogObject, function(err){
            if (err) return;
            // Object inserted successfully.
           
            
            
            res.end(JSON.stringify({code:200,_id:newLogObject._id}));
        });
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500,error:ex}));
    }
    db.close();
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
        
    }catch(ex)
    {
        
        res.end(JSON.stringify({code:500 , error:ex.toString()}));
    }
    db.close();
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
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500, error:ex.toString()}));
    }
    db.close();
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
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
    db.close();
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
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
    db.close();
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
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500, error:ex.toString()}));
    }
    db.close();
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
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
    db.close();
})

app.post('/user/games/create', async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    
    try
    {
        console.log(req.userquery);
        var newGameObject = 
                {
                    game_name:req.query.gameName,
                    user_id:req.query.userId,
                    team_id:req.query.teamId,
                    start_time:req.query.matchTime,
                    public:req.query.public,
                    date:req.query.matchDate.toString(),
                    location:req.query.location,
                    team_color:req.query.teamColor,
                    opp_team_color:req.query.oppTeamColor,
                    possessions:[]
                };
        
        await dbo.collection("games").insertOne(newGameObject, function(err){
            if (err) return;
            // Object inserted successfully.
           
            var newActiveGameObject =
                    {
                        game_id: newGameObject._id,
                        last_string:[],
                        input_list:[],
                        current_order:0
                    }
            dbo.collection("active_games").insertOne(newActiveGameObject)
            
            res.end(JSON.stringify({code:200,_id:newGameObject._id}));
        });
        
    }catch(ex)
    { 
        res.end(JSON.stringify({code:500,error:ex}));
    }
    db.close();
})

//---------------------------------------------------------------------------------------------------------------------------------------------------
//create players - WORKS
app.post('/user/players/create_player', validate(createPlayerValidation, {}, {} ), async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    
    try
    {
        console.log(req.userquery);
        var newPlayerObject = 
                {
                    player_name:req.query.player_name,
                    player_age:req.query.player_age,
                    player_number:req.query.player_number,
                };
        
        await dbo.collection("players").insertOne(newPlayerObject, function(err){
            //if (err) return;
            // Object inserted successfully.

            
            res.end(JSON.stringify({code:200,_id:newPlayerObject._id}));
        });
        
    }catch(ex)
    { 
        res.end(JSON.stringify({code:500,error:ex}));

    }
    db.close();
    


})



//---------------------------------------------------------------------------------------------------------------------------------------------------

app.post('/user/possessions/create', async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        
        var newPossessionEventObject = 
                {
                    possession_id: new ObjectID(),
                    start_time: req.query.startTime,
                    team_in_possession: req.query.possessionTeam,
                    events: []
                };
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.object_id) };
        const updateDocument = 
        {
          $push: { possessions: newPossessionEventObject }
        };
        await dbo.collection("games").updateOne(searchQuery, updateDocument, function(err)
        {
            if (err) return;
            
            res.end(JSON.stringify({code:200, possession_id:newPossessionEventObject.possessionID}));
        });
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
    db.close();
})




app.post('/user/game_events/create', async (req, res) => 
{
    
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        
        var newGameEventObject = cp.parseCommand(req.query.textInput,req.query.time,null);
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.object_id),"possessions.possession_id":new MongoDB.ObjectID(req.query.pid) };
        
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
        });
    }catch(ex)
    {
        res.end(JSON.stringify({code:500,error:ex.toString()}));
    }
    db.close();
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
        });
    }catch(ex)
    {
        res.end(JSON.stringify({code:500,error:ex.toString()}));
    }
    db.close();
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
        });
    }catch(ex)
    {
        res.end(JSON.stringify({code:500,error:ex.toString()}));
    }
    db.close();
})

//------------------------------------------------------------------------------------------------------------------------------------------------

app.get('/user/login', validate(loginValidation, {}, {} ), async (req, res) => 
{
    
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        
        var result = await dbo.collection("users").findOne(
                {
                    email: req.query.email,
                    password: req.query.password
                });
        
        
        
        if (result)
        {
            res.end(JSON.stringify({code:200, userID: result._id}));
        }
        else
        {
            res.end(JSON.stringify({code:200, userID: 0}));
        }
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
    db.close();
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
            username: req.query.username,
            password: req.query.password,
            email: req.query.email
        }
        
        await dbo.collection("users").insertOne(newUserObject, function(err){
            if (err) return;
            // Object inserted successfully.
           
        
            res.end(JSON.stringify({code:200,_id:newUserObject._id}));
        });
        
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500,error:ex.toString()}));
    }
    db.close();
})

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
        }
        else
        {
            res.end(JSON.stringify({code:200, result: 0}));
        }
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
    db.close();
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
        }
        else
        {
            res.end(JSON.stringify({code:200, result: 0}));
        }
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
    db.close();
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
        }
        else
        {
            res.end(JSON.stringify({code:200, result: 0}));
        }
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
    db.close();
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
        }
        else
        {
            res.end(JSON.stringify({code:200, result: 0}));
        }
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
    db.close();
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
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
    db.close();
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


function inputListCompare(inputA,inputB)
{
    if (inputA.order < inputB.order)
    {
        return -1;
    }
    else if(inputA.order > inputB.order)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

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

app.get('/dictionary', async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
                var keywords = [];
                var keywords = keywords.concat(enums.event);
                var keywords = keywords.concat(enums.outcome);
                var keywords = keywords.concat(enums.position);
                
                var cursor = dbo.collection('dictionary').find();

                for (var i = 0;i < keywords.length;i++)
                {
                    keywords[i].dictionary = [];
                }

                
                await cursor.each(function(err, item) {
                    
                    if(item == null) {
                        db.close(); 
                        res.end(JSON.stringify({code:200, object: keywords}));
                        return;
                    }
                    
                    for (var i = 0;i<keywords.length;i++)
                    {
                        console.log(item);
                        console.log(keywords[i]);
                        if (keywords[i].keywords[0] === item.keyword)
                        {
                            keywords[i].dictionary.push(item);
                        }
                    }
                    
                    
                    
                });
                
                
                
    }catch(ex)
    {
        res.end(JSON.stringify({code:500, error: ex.toString()}));
    }   
                
    db.close();
})