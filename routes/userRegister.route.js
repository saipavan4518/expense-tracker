const router = require('express').Router();
const db_pool = require("../config/db-config");
const bcrypt = require('bcryptjs');

const checkAuth = require("./checkAuth.route");
const checkAdmin = require("./checkAdmin.route");

router.route("/").post(checkAuth,checkAdmin, async (req,res)=>{
    if(req.body){
        const pass = req.body.password;
        const salt = bcrypt.genSaltSync(10);
        const username = req.body.username;

        if(!pass || !username){
            return res.status(400).send({error:"Error in the parameters"});
        }

        const nameOfuser = req.body.nameOfuser;
        const phoneno = req.body.phoneno;
        const priv = req.body.priv;
        const password = bcrypt.hashSync(pass, salt);

        const query = `insert into users values("${nameOfuser}","${username}","${password}","${phoneno}","${priv}")`;

        db_pool.getConnection(function(error, connection){
            if(error){
                return res.status(200).send({eid:2,details:"Database servers are down",error:error});
            }

            connection.query(query,function(error, results, fields){
                if(error){
                    return res.status(200).send({eid:3,details:"Invalid Query",error:error});
                }
                return res.send({
                    eid:0,
                    details:"Registration Successful"
                });
            });

            connection.release();
        });
        //end of if req.body
    }else{
        return res.send({
            eid:25,
            details:"Error in Posting the query, retry"
        });
    }
})


module.exports = router;