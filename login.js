const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require("mongodb");
var passwordHash = require("password-hash");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
//const { loginValidation } = require("./validation");

dotenv.config();

module.exports = {
  loginUser: async function (req, res) {
    const db = await MongoClient.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const dbo = db.db("TacTalk");
    res.setHeader("Content-Type", "application/json");

    try {
      var searchQuery = {
        email: req.body.email,
      };

      var result = await dbo.collection("users").findOne(searchQuery);

      if (
        result &&
        passwordHash.verify(req.body.password, result.password.toString())
      ) {
        // Create and assign token
        const token = jwt.sign(
          { user_id: result._id },
          process.env.TOKEN_SECRET
        );
        
        res.status(200).send({ message: "Login Successful", token: token });        
        db.close();
      } else {
        res.status(400).send({ message: "Invalid Email Or Password" });
        db.close();
      }
    } catch (ex) {
      res.status(500).send({ message: ex.toString() });
      db.close();
    }
  },
};
