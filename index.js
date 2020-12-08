let port = process.env.PORT;
if (port == null || port == "") 
{
    //default port number if none is assigned
    port = 8080;
}
const http = require('http');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;
const MongoDB = require('mongodb');
const cp = require('./commandParser');
const express = require('express');
const app = express();

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
        var newGameObject = 
                {
                    gameName:req.gameName,
                    user_id:req.query.userId,
                    teamId:req.query.teamId,
                    startTime:0,
                    public:req.query.public,
                    possessions:[]
                };
        await dbo.collection("games").insertOne(newGameObject, function(err){
            if (err) return;
            // Object inserted successfully.
           
            
            
            res.end(JSON.stringify({code:200,_id:newGameObject._id}));
        });
        
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
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
                    possessionID: req.query.possessionID,
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
            
            res.end(JSON.stringify({code:200}));
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
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.objectId),"possessions.possessionID":req.query.pid };
        
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
            
            res.write(JSON.stringify(newGameEventObject));
            res.end(JSON.stringify({code:200}));
        });
    }catch(ex)
    {
        res.end(JSON.stringify({code:500,error:ex.toString()}));
    }
})


app.get('/', async (req, res) => 
{
    var fs = require("fs");
    fs.readFile(__dirname+'/index.html', 'utf8', (err, text) => {
        res.send(text);
    });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})