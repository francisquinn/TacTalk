const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require("mongodb");
var passwordHash = require("password-hash");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

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
        email: req.body.email
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

        // Add token in header
        res.setHeader("Authentication", token);

        res.end(token);
        db.close();
      } else {
        console.log("in else");
        res.end(
          JSON.stringify({ code: 400, message: "Invalid email or password" })
        );
        db.close();
      }
    } catch (ex) {
      res.end(
        JSON.stringify({ code: 400, message: "Invalid email or password" })
      );
      db.close();
    }
  },
};
