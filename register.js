const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require("mongodb");
var passwordHash = require("password-hash");
const uri = process.env.DB_CONNECT;

module.exports = {
registerUser: async function (req, res) 
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
},
}