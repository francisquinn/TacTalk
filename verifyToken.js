const jwt = require('jsonwebtoken');

module.exports = {
    LoginVerify : function (req, res, next){
        const token = req.header('Authentication');

        if(!token) return res.status(401).send({message : "Access Denied"});

        try{
           const verified = jwt.verify(token, process.env.TOKEN_SECRET);
           req.user = verified;
           next();

        }catch(err){
            res.status(400).send({message: "Invalid Token"});
        }
    
    }

};
