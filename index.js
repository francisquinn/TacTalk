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


createGameEvent("60084b37e8c56c0978f5b004",{event:"yep"});


app.get('/user/games/delete', async (req, res) => 
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
})

app.get('/user/games/get/id', async (req, res) => 
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
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId)};
        
        var activeGame = await dbo.collection("active_games").findOne(searchQuery);
        
        if (!activeGame)
        {
            res.end(JSON.stringify({code:200, gameStatus:"NO_ACTIVE_GAME"}));
        }
        else if (activeGame.input_list.length > 0)
        {
            //if there is item in input list
            
            //sort the input list
            activeGame.input_list.sort(inputListCompare);
            
            for (var i = 0; i < activeGame.input_list.length;i++)
            {
                if (activeGame.current_order + 1 === activeGame.input_list[i].order)
                {
                    activeGame.current_order += 1;
                    activeGame.last_string.push(activeGame.input_list[i].text);
                }
                else
                {
                    break;
                }
            }
            
            var i = 0;
            var segmentString = "";
            while(i < activeGame.input_list.length)
            {
                segmentString += activeGame.input_list[i];
                
                var parseResult = cp.parseCommandSegmented(segmentString);
                
                if (parseResult.result === 1)
                {
                    if (parseResult.hasOwnProperty("event_id"))
                    {
                        if (activeGame.current_event.event_id !== -1)
                        {
                            
                        }
                        else
                        {
                            activeGame.current_event.event_id = parseResult.event_id;
                        }
                    }
                    
                }
                
                
                
                i++;
            }
            
            
            
            
            var gameObject = await dbo.collection("games").findOne(searchQuery);
            var statsResult = stats.getCurrentStats(gameObject.possessions);
            res.end(JSON.stringify({code:200, gameStatus: "UPDATING",result: statsResult}));
            
        }
        
        
        
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
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
        });
    }catch(ex)
    {
        console.log(ex)
    }
}

app.get('/cloud/game_events/create', async (req, res) => 
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
})

app.get('/user/games/get/gameName', async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        const searchQuery = { game_name: "/.*" + req.query.gameName + ".*/"};
        
        var result = await dbo.collection("games").find(searchQuery);
        res.end(JSON.stringify({code:200, result: result}));
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
})

app.get('/user/users/get_secure', async (req, res) => 
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
})

app.get('/user/games/create', async (req, res) => 
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
})

app.get('/user/possessions/create', async (req, res) => 
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
})




app.get('/user/game_events/create', async (req, res) => 
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
})

app.get('/user/login', async (req, res) => 
{
    
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        
        var result = await dbo.collection("users").findOne(
                {
                    username: req.query.username,
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
})

app.get('/user/register', async (req, res) => 
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
})

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
})



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