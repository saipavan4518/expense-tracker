const router = require('express').Router();
const db_pool = require("../config/db-config");

const checkAuth = require("./checkAuth.route");
const checkAdmin = require("./checkAdmin.route");

router.route('/getmarriages/ongoing').get(checkAuth, (req,res)=>{
    const query = `select * from marriage where status = 0`;
    db_pool.getConnection(function(error, connection){
        if(error){
            return res.status(200).send({eid:2,details:"Database servers are down",error:error});
        }

        connection.query(query,async function(error, results, fields){
            if(error){
                return res.status(200).send({eid:3,details:"Invalid Query",error:error});
            }
            res.send({eid:0,result:results});
        });

        connection.release();
    });
})

router.route('/getmarriages/gettransaction/:id').get(checkAuth,(req,res)=>{
    const id = req.params.id;
    const query = `select * from exp where marriage_id = ${id}`;
    db_pool.getConnection(function(error, connection){
        if(error){
            return res.status(200).send({eid:2,details:"Database servers are down",error:error});
        }

        connection.query(query,async function(error, results, fields){
            if(error){
                return res.status(200).send({eid:3,details:"Invalid Query",error:error});
            }
            res.send({eid:0,result:results});
        });

        connection.release();
    });
})

router.route('/getmarriages/completed').get(checkAuth,(req,res)=>{
    const query = `select * from marriage where status = 1`;
    db_pool.getConnection(function(error, connection){
        if(error){
            return res.status(200).send({eid:2,details:"Database servers are down",error:error});
        }

        connection.query(query,async function(error, results, fields){
            if(error){
                return res.status(200).send({eid:3,details:"Invalid Query",error:error});
            }
            res.send({eid:0,result:results});
        });

        connection.release();
    });
})

//now the route for submiting the exp values
router.route('/insertexp').post(checkAuth, (req,res)=>{
    const marriage_id = req.body.marriage_id;
    const username = req.body.username;
    const reason = req.body.reason;
    const amount  = req.body.amount;

    const query = `insert into exp (marriage_id, username, reason, amount) values (${marriage_id},'${username}','${reason}', ${amount});`
    db_pool.getConnection(function(error, connection){
        if(error){
            return res.status(200).send({eid:2,details:"Database servers are down",error:error});
        }

        connection.query(query,async function(error, results, fields){
            if(error){
                return res.status(200).send({eid:3,details:"Invalid Query",error:error});
            }
            res.send({eid:0,error:"null"});
        });

        connection.release();
    });


})


module.exports = router;