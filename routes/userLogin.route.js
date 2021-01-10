const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db_pool = require("../config/db-config");
const jwt = require('jsonwebtoken');

router.route("/").post(async (req,res)=>{
    //email is username
    const username = req.body.username;
    const password = req.body.password;

    const query = `select passwords, priv from users where username = '${username}'`;

    db_pool.getConnection(function(error, connection){
        if(error){
            return res.status(200).send({eid:2,details:"Database servers are down",error:error});
        }

        connection.query(query,async function(error, results, fields){
            if(error){
                return res.status(200).send({eid:3,details:"Invalid Query",error:error});
            }
            const isV = await bcrypt.compare(password, results[0].passwords);
            if(isV){
                //is the user, so login
                const token = jwt.sign({
                    userID:username,
                    priv:results[0].priv
                },process.env.TOKEN_PASSWORD,{expiresIn: 86400});
                return res.header('x-access-token',token).send({eid:0,priv:results[0].priv,details:"Succesfully Logged In"});
            }else{
                return res.send({eid:10,"isUser":true,"isCC":false});
            }
        });

        connection.release();
    });

})


module.exports = router;