function checkAdmin(req,res,next){
    const User = req.user;
    console.log("just checking");
    console.log(User);
    if(User.priv === "admin"){
        next();
    }else{
        return res.status(401).send({eid:100,details:"unauthorized"});
    }
}

module.exports = checkAdmin