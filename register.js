const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require("mongodb");
var passwordHash = require("password-hash");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { registerValidation } = require("./validation");

dotenv.config();

module.exports = {
  registerUser: async function (req, res) {
    const db = await MongoClient.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const dbo = db.db("TacTalk");
    res.setHeader("Content-Type", "application/json");
    try {
      //getting validation and displaying the error message if details are entered incorrectly
      const { error } = registerValidation(req.body);
      if (error) return res.status(400).send(error.details[0]);

      //checking for duplicate users
      const emailExist = await dbo
        .collection("users")
        .findOne({ email: req.body.email });

      // Send back 400 status code with error message
      if (emailExist)
        return res.status(400).send({ message: "Email Already Exists" });

      var hashedPassword = passwordHash.generate(req.body.password);
      var newUserObject = {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        password: hashedPassword,
        email: req.body.email,
      };

      // add the new user and send back 200
      await dbo.collection("users").insertOne(newUserObject, function (err) {
        res.status(200).send({ message: "Registration Successful" });
        db.close();
      });
    } catch (ex) {
      res.status(500).send({ message: ex.toString() });
      db.close();
    }
  },
};
