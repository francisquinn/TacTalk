



let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

console.log("start");
var clientResult;
var http = require('http');
var url = require('url');

var dbo;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://RojakAdmin:RojakIsASalad@rojakcluster.ho1ff.mongodb.net/sample_analytics?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object

  dbo = client.db("sample_analytics");
  dbo.collection("customers").findOne({}, function(err,result)
  {
    console.log(result);
    clientResult = result;
    client.close();
  });
});

if (dbo !== null)
{
    console.log("Not null");
}
else
{
    console.log("Null");
}

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<p>This is a Team Rojak Node server</p>');
  res.write('<p>Searching Mongo Atlas database for Elizabeth, result:</p>');
  res.write(JSON.stringify(clientResult));
  res.end();
}).listen(port);