const jwt = require('jsonwebtoken');

function checkAuth(req,res,next){
    const token = req.header('x-access-token');
    if(!token){
        return res.status(401).send("Access Denied");
    }

    try{
        const userD = jwt.verify(token, process.env.TOKEN_PASSWORD);
        req.user = userD,
        next();
    }catch(error){
        return res.status(500).send({eid:100,details:"Error in Token Parsing Refersh"})
    }
}

module.exports = checkAuth