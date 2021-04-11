const jwt = require('jsonwebtoken');

module.exports = {
    LoginVerify : function (req, res, next){
        const token = req.header('Authentication');

        if(!token) return res.status(401).send('Access Denied');

        try{
           const verified = jwt.verify(token, process.env.TOKEN_SECRET);
           req.user = verified;
           next();

        }catch(err){
            res.status(400).send('Invalid Token');
        }
    
    }

//        
//    TeamVerify : function (req, res, next){
//        const teamToken = req.header('TeamAuth');
//        const loginToken = req.header('LoginAuth');
//
//        if(!teamToken && !loginToken) return res.status(401).send('Access Denied');
//
//        try{
//        const verified = jwt.verify(teamToken, process.env.TOKEN_SECRET);
//        const verified2 = jwt.verify(loginToken, process.env.TOKEN_SECRET);
//        req.user = verified;
//        req.user = verified2;
//        next();
//
//        }catch(err){
//        res.status(400).send('Invalid Token');
//        }
//
//    },
//
//    GameVerify : function (req, res, next){
//        const teamToken = req.header('TeamAuth');
//        const loginToken = req.header('LoginAuth');
//        const gameToken = req.header('GameAuth');
//
//        if(!teamToken && !loginToken && !gameToken) return res.status(401).send('Access Denied');
//
//        try{
//        const verified = jwt.verify(teamToken, process.env.TOKEN_SECRET);
//        const verified2 = jwt.verify(loginToken, process.env.TOKEN_SECRET);
//        const verified3 = jwt.verify(gameToken, process.env.TOKEN_SECRET);
//        req.user = verified;
//        req.user = verified2;
//        req.user = verified3;
//        next();
//
//        }catch(err){
//        res.status(400).send('Invalid Token');
//        }
//
//    }
};
