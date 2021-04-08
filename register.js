const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require("mongodb");
var passwordHash = require("password-hash");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {registerValidation} = require('./validation');

dotenv.config();

module.exports = {
  registerUser: async function (req, res) {
    const db = await MongoClient.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    try
    {
                //getting validation and displaying the error message if details are entered incorrectly
        const {error} = registerValidation(req.body);
        if(error) return res.status(400).send(error.details[0]);
        
        //checking for duplicate users
        const emailExist = await dbo.collection("users").findOne({email:req.body.email});
        if(emailExist) return res.end(JSON.stringify({code:400, message: "Email already exists"}));
      
        var hashedPassword = passwordHash.generate(req.body.password)
        var newUserObject =
        {
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email
        };
        
        await dbo.collection("users").insertOne(newUserObject, function(err){

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