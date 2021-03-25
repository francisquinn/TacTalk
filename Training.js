const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require("mongodb");
var passwordHash = require("password-hash");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
var grid = require("gridfs-stream");
var fs = require("fs");



dotenv.config();

module.exports = 
{
    createTrainingMaterial: async function (req, res) 
    {
        const db = await MongoClient.connect(process.env.DB_CONNECT, 
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        const dbo = db.db("TacTalk");
        res.setHeader("Content-Type", "application/json");
    
  }
}
