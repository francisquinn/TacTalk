function lookForUser(name)
{
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
      dbo.collection("customers").findOne({name: name}, function(err,result)
      {
        console.log(result);
        clientResult = result;
        client.close();
      });
    });
    
    return clientResult;

}