const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require("mongodb");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const {createPlayerValidation} = require('./validation');
const jwt = require('jsonwebtoken');
dotenv.config();

module.exports = {  
    getUserDetails: async function(req, res) 
    {
        const db = await MongoClient.connect(process.env.DB_CONNECT, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');
        try
        {            
                const token = req.header('Authentication');
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET);  
                var userId = decoded.user_id;  
                console.log(userId);
            const searchQuery = { _id: new MongoDB.ObjectID(userId)};

            var result = await dbo.collection("users").findOne(searchQuery);
            res.status(200).send({message: "User Found", user_id: result._id, username: result.username, email: result.email});
            db.close();

        }catch(ex)
        {
            res.status(500).send({message: "Unable to retrive user details"});
            db.close();
        }

    },
//--------------------------------------------------------------------------------------------------------------------------------------------------------



    deleteUser: async function(req, res) 
    {
        const db = await MongoClient.connect(process.env.DB_CONNECT, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        const dbo = db.db("TacTalk");
        res.setHeader('Content-Type', 'application/json');
        try
        {
                const token = req.header('Authentication');
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET);  
                var userId = decoded.user_id;  
                console.log(userId);
                
            const searchQuery = { _id: new MongoDB.ObjectID(userId)};
           await dbo.collection("users").deleteOne(searchQuery);
            res.status(200).send({message: "User deleted"});
            db.close();
        }catch(ex)
        {
            res.status(500).send({message:"Unable to delete user"});
            db.close();
        }

    }
}
//------------------------------------------------------------------------------------------------------------------------------------------