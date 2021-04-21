const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require("mongodb");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { createPlayerValidation } = require("./validation");
const jwt = require("jsonwebtoken");
dotenv.config();

module.exports = {
  getUserDetails: async function (req, res) {
    const db = await MongoClient.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const dbo = db.db("TacTalk");
    res.setHeader("Content-Type", "application/json");
    try {
      const token = req.header("Authentication");
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      var userId = decoded.user_id;
      console.log(userId);
      const searchQuery = { _id: new MongoDB.ObjectID(userId) };

      var result = await dbo.collection("users").findOne(searchQuery);
      res
        .status(200)
        .send({
          message: "User Found",
          user_id: result._id,
          first_name: result.first_name,
          last_name: result.last_name,
          email: result.email,
        });
      db.close();
    } catch (ex) {
      res.status(500).send({ message: "Unable To Retrive User Details" });
      db.close();
    }
  },
  //--------------------------------------------------------------------------------------------------------------------------------------------------------

  deleteUser: async function (req, res) {
    const db = await MongoClient.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const dbo = db.db("TacTalk");
    res.setHeader("Content-Type", "application/json");
    try {
      const token = req.header("Authentication");
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      var userId = decoded.user_id;
      console.log(userId);

      const searchQuery = { _id: new MongoDB.ObjectID(userId) };
      await dbo.collection("users").deleteOne(searchQuery);
      res.status(200).send({ message: "User Deleted" });
      db.close();
    } catch (ex) {
      res.status(500).send({ message: "Unable To Delete User" });
      db.close();
    }
  },
};
//------------------------------------------------------------------------------------------------------------------------------------------
