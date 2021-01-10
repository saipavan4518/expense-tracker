const mysql = require('mysql');
const fs = require('fs');
var pool;

function createPool(){
    if(!pool){
        try{
            pool = mysql.createPool({
                connectionLimit:10,
                host: process.env.MYSQL_URI,
                user: process.env.db_uname,
                password: process.env.db_pass,
                database: 'expense'
            });
        }catch(error){
            console.log('(-) Error in connecting to the database')
            fs.appendFile('./log/error.log',error,(error)=>{
                if(error) throw error;
            });
        }
    }

    return pool;
}

module.exports = createPool();