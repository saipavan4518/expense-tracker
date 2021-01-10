const router = require('express').Router();
const db_pool = require("../config/db-config");

const checkAuth = require("./checkAuth.route");
const checkAdmin = require("./checkAdmin.route");


//create events
router.route('/createEvent').post(checkAuth, checkAdmin, (req,res)=>{
    const NameoftheClient = req.body.NameoftheClient;
    const phoneno = req.body.phoneno;
    const address = req.body.address;
    const dates = req.body.dates;
    const allocatedBudget = req.body.allocatedBudget;
    const status = req.body.status;
    const query = `insert into marriage(NameoftheClient, phoneno, address, dates, allocatedBudget,status) values('${NameoftheClient}', '${phoneno}','${address}', '${dates}', ${allocatedBudget},${status})`;
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


router.route('/getusers').get(checkAuth,checkAdmin, (req,res)=>{
    const query = `select nameOfuser, username, contactno, priv from users`;
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

router.route("/getevents/:status").get(checkAuth, checkAdmin,(req,res)=>{
    const status = req.params.status;
    const query = `select * from marriage where status = ${status}`;
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

router.route('/deleteuser/:username').delete(checkAuth, checkAdmin, (req,res)=>{
    const username = req.params.username
    const query = `delete from users where username = '${username}'`;
    db_pool.getConnection(function(error, connection){
        if(error){
            return res.status(200).send({eid:2,details:"Database servers are down",error:error});
        }

        connection.query(query,async function(error, results, fields){
            if(error){
                return res.status(200).send({eid:3,details:"Invalid Query",error:error});
            }
            res.send({eid:0,error:"none"});
        });

        connection.release();
    });

})

router.route('/deleteevent/:id').delete(checkAuth, checkAdmin, (req,res)=>{
    const id = req.params.id
    const query = `delete from marriage where id = '${id}'`;
    db_pool.getConnection(function(error, connection){
        if(error){
            return res.status(200).send({eid:2,details:"Database servers are down",error:error});
        }

        connection.query(query,async function(error, results, fields){
            if(error){
                return res.status(200).send({eid:3,details:"Invalid Query",error:error});
            }
            res.send({eid:0,error:"none"});
        });

        connection.release();
    });

})
router.route('/completeEvent').post(checkAuth, checkAdmin, (req,res)=>{
    const id = req.body.id
    //this is for marking the event as completed.
    const query = `update marriage set status = 1 where id = ${id}`;
    db_pool.getConnection(function(error, connection){
        if(error){
            return res.status(200).send({eid:2,details:"Database servers are down",error:error});
        }
        connection.query(query,async function(error, results, fields){
            if(error){
                return res.status(200).send({eid:3,details:"Invalid Query",error:error});
            }
            res.send({eid:0,error:"none"});
        });

        connection.release();
    });

})

module.exports = router;