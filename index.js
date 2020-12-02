let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}
const http = require('http');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;
const MongoDB = require('mongodb');
const cp = require('./commandParser');


var dbo;
const uri = "mongodb+srv://RojakAdmin:RojakIsASalad@rojakcluster.ho1ff.mongodb.net/sample_analytics?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

http.createServer(function (request, response) 
{
    var q = url.parse(request.url, true).query;
    processQuery(q, response);
    response.end();
}).listen(port);

async function lookForUser(name)
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("sample_analytics");
    const user = await dbo.collection("customers").findOne({name:name});
    console.log(user);
    return user;
}

function processQuery(query, response)
{
    switch (query.command)
    {
        case "create_game":
            createGame(query, response);
            break;
        case "game_start":
            
            break;
        case "create_possession":
            createpossession(query, response);
            break;
        case "update_possession_event":
            updatePossession(query, response);
            break;
        case "parse":
            parseAndSubmitEvent(query, response);
            break;
        case "delete":
            deleteRecord(query, response);
            break;
        
    }
}

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
    var newGameObject = {gameID:query.gameID,startTime:query.startTime};
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

async function deleteRecord(query, response)
{
    const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
    const dbo = db.db("TacTalk");
    
    const searchQuery = { _id: new MongoDB.ObjectID(query.object_id) };
    dbo.collection("game_events").deleteOne(searchQuery);
}
    