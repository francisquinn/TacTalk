const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require("mongodb");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {createMatchValidation} = require('./validation');

dotenv.config();


module.exports = {
  createGame: async function (req, res) {
    const db = await MongoClient.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const dbo = db.db("TacTalk");
    res.setHeader('Content-Type', 'application/json');
    
        //getting validation and displaying the error message if details are entered incorrectly
        const {error} = createMatchValidation(req.body);
        if(error) return res.status(400).send(error.details[0]);  
    
    try
    {
        var newGameObject = 
                {
                    user_id:req.body.userId,
                    startTime:req.body.startTime,
                    gameType : req.body.gameType,
                    startDate:req.body.startDate,
                    location:req.body.location,
                    teamColor:req.body.teamColor,
                    teamName:req.body.teamName,
                    oppColor:req.body.oppColor,
                    opposition:req.body.opposition,
                    possessions:[],
                    last_string:[],
                    input_list:[],
                    current_order:0,
                    current_event:{},
                    active: 1,
                    current_possession: -1,
                };
                
//        const gameToken = jwt.sign(
//          { game_id: new MongoDB.ObjectID(req.body._id) },
//          process.env.TOKEN_SECRET
//        );
//
//        res.header("GameAuth", gameToken);
//        
//        console.log(gameToken)
//        var decoded = jwt.decode(gameToken);
//        console.log(decoded);
//        
        await dbo.collection("games").insertOne(newGameObject, function(err){
            db.close();
            res.status(200).send({message: "Game successfully created",  game_id:newGameObject._id, teamName: req.body.teamName, opposition:req.body.opposition });
        });
    }catch(ex)
    { 
        res.status(400).send({message: ex});
        db.close();
    }
}
};
