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
        if(error) return res.status(400).send(error.details[0].message);  
    
    try
    {
        var newGameObject = 
                {

                    startTime:req.body.startTime,
                    gameType : req.body.gameType,
                    startDate:req.body.startDate,
                    location:req.body.location,
                    teamColor:req.body.teamColor,
                    teamName:req.body.teamName,
                    oppColor:req.body.oppColor,
                    opposition:req.body.opposition,
                    possessions:[]
                };
                
        const gameToken = jwt.sign(
          { game_id: new MongoDB.ObjectID(req.body._id) },
          process.env.TOKEN_SECRET
        );

        res.header("GameAuth", gameToken);
        
        console.log(gameToken)
        var decoded = jwt.decode(gameToken);
        console.log(decoded);
        
        await dbo.collection("games").insertOne(newGameObject, function(err){
            
        });
        var newActiveGameObject =
                    {
                        game_id: newGameObject._id,
                        user_id: new MongoDB.ObjectID(req.body.user_id),
                        last_string:[],
                        input_list:[],
                        current_order:0,
                        current_event:{},
                        active: 1,
                        current_possession: -1,
                        teamColor: req.body.teamColor,
                        oppColor: req.body.oppColor
                        
                    }
            await dbo.collection("active_games").insertOne(newActiveGameObject, function(err){
            console.log("done");
            res.end(JSON.stringify({code:200,_id:newGameObject._id}));

            
            db.close();                
            });
    }catch(ex)
    { 
        res.end(JSON.stringify({code:500,error:ex}));
        db.close();
    }
}
};
