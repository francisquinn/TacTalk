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
const express = require('express');
const app = express();
const uri = "mongodb+srv://RojakAdmin:RojakIsASalad@rojakcluster.ho1ff.mongodb.net/sample_analytics?retryWrites=true&w=majority";
const Games = require("./Games");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var FormData = require('form-data');





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
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId), "possessions.possessionID": req.query.pid };
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
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId), "possessions.possessionID": req.query.pid, "possessions.events.eventID0": req.query.eid };
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

app.get('/user/games/get/stats', async (req, res) => 
{
    //3-20
    //first is goal second is points
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

app.get('/cloud/game_events/create', async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        var jsonObj = JSON.parse(req.query.package);
        
        var fullText = "";
        
        for (var i = 0;i < jsonObj.length; i++)
        {
            fullText = fullText + " " + jsonObj[i].text;
        }
        
        var currentTime = new Date();
        var newLogObject = 
                {
                    submitTime:currentTime,
                    text:fullText,
                    gameID:req.query.object_id
                    
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
        const searchQuery = { gameName: "/.*" + req.query.gameName + ".*/"};
        
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
                    gameName:req.query.gameName,
                    user_id:req.query.userId,
                    teamId:req.query.teamId,
                    startTime:0,
                    public:req.query.public,
                    date:req.query.matchDate.toString(),
                    possessions:[]
                };
        await dbo.collection("games").insertOne(newGameObject, function(err){
            if (err) return;
            // Object inserted successfully.
           
            
            
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
                    possessionID: new ObjectID(),
                    startTime: req.query.startTime,
                    teamInPossession: req.query.possessionTeam,
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
            
            res.end(JSON.stringify({code:200, possessionId:newPossessionEventObject.possessionID}));
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
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.object_id),"possessions.possessionID":new MongoDB.ObjectID(req.query.pid) };
        
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
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId),"possessions.possessionID":req.query.pid,"possessions.events.eventID": req.query.eid };
        
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
