let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}
const http = require('http');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;
const MongoDB = require('mongodb');
const cp = require('./commandParser');
const express = require('express');
const app = express();



var dbo;
const uri = "mongodb+srv://RojakAdmin:RojakIsASalad@rojakcluster.ho1ff.mongodb.net/sample_analytics?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/user/games/delete', async (req, res) => 
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.object_id) };
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
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.object_id), "possessions.possessionID": req.query.pid };
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
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.object_id), "possessions.possessionID": req.query.pid, "possessions.events.eventID0": req.query.eid };
        dbo.collection("games").deleteOne(searchQuery);
        res.end(JSON.stringify({code:200}));
    }catch(ex)
    {
        res.end(JSON.stringify({code:500}));
    }
})

app.get('/user/games/get', async (req, res) => 
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
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.object_id)};
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
        var newGameObject = {gameName:req.gameName,startTime:0,possessions:[]};
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
//            {
//                eventID:req.query.eventID,
//                time:req.query.timeInSecond,
//                eventTypeID:req.query.eventType,
//                eventPositionID:req.query.position,
//                playerID:req.query.playerID,
//                teamID:req.query.teamID,
//                outcomeID:req.query.outcomeID,
//                outcomeTeamID:req.query.outcomeTeamID,
//                outcomePlayerID:req.query.outcomePlayerID
//            }
        const searchQuery = { _id: new MongoDB.ObjectID(req.query.object_id),"possessions.possessionID":req.query.pid };
        
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
    res.sendFile("index.html");
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


//http.createServer(function (request, response) 
//{
//    var q = url.parse(request.url, true).query;
//    processQuery(q, response);
//    response.end();
//}).listen(port);


async function parseAndSubmitEvent(query, response)
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    var newPossessionEvent = cp.parseCommand(query.input,query.time);
    const searchQuery = { possessionID: query.possessionID.toString() };
    const updateDocument = {
      $push: { events: newPossessionEvent }
    };
    
    dbo.collection("game_events").updateOne(searchQuery, updateDocument);
}

async function startGame(query)
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    var newGameObject = {gameID:0,startTime:0};

}

async function createGame(query, response)
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    var newGameObject = {gameID:query.gameID,startTime:query.startTime,possessions:[]};
    await dbo.collection("games").insertOne(newGameObject);
}

async function createpossession(query, response)
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    var newpossessionObject = 
            {
                possessionID:query.possessionID,
                startTime:query.startTime,
                teamInPossession:query.possessionTeam,
                events: []
            };
    await dbo.collection("game_events").insertOne(newpossessionObject);
    
}

async function updatePossession(query, response)
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    var newPossessionEventObject =
            {
                eventID:query.eventID,
                time:query.timeInSecond,
                eventTypeID:query.eventType,
                eventPositionID:query.position,
                playerID:query.playerID,
                teamID:query.teamID,
                outcomeID:query.outcomeID,
                outcomeTeamID:query.outcomeTeamID,
                outcomePlayerID:query.outcomePlayerID
            }
    const searchQuery = { possessionID: query.possessionID.toString() };
    const updateDocument = {
      $push: { events: newPossessionEventObject }
    };
    dbo.collection("game_events").updateOne(searchQuery, updateDocument);
}