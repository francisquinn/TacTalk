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
                const token = req.header('Authentication');
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET);  
                var userId = decoded.user_id;  
                console.log(userId);
        
        
        var newGameObject = 
                {
                    user_id: new MongoDB.ObjectID(userId),
                    start_time:req.body.startTime,
                    game_type : req.body.gameType,
                    start_date:req.body.startDate,
                    location:req.body.location,
                    team_color:req.body.teamColor,
                    team_name:req.body.teamName,
                    opp_color:req.body.oppColor,
                    opposition:req.body.opposition,
                    possessions:[],
                    last_string:[],
                    input_list:[],
                    current_order:0,
                    current_event:{},
                    active: 1,
                    current_possession: -1,
                };
                       
        await dbo.collection("games").insertOne(newGameObject, function(err){
            db.close();
            res.status(200).send({message: "Game Successfully Created",  game_id:newGameObject._id, 
                team_name: req.body.teamName, opposition:req.body.opposition });
        });
    }catch(ex)
    { 
        res.status(400).send({message: ex});
        db.close();
    }
}
};
