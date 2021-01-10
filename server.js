const express = require('express');
const cors = require('cors');
const http = require('http');
const morgan = require('morgan');

const app = express();
require('dotenv').config();

const userLogin = require('./routes/userLogin.route');
const userRegister = require('./routes/userRegister.route');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

//middleware
app.use(cors({
    exposedHeaders: 'x-access-token'
}));

app.use(express.json());

//import paths
app.use('/api/user/login',userLogin);
app.use('/api/admin/register',userRegister);
app.use('/api/user/main',userRoutes);
app.use('/api/admin/main',adminRoutes);

app.use((req, res, next) => {
    //this is the error handler.
    return res.status(404).send({ message: "Wrong URL" });
});

//create http server for socketio
var server = http.createServer(app);
const io = require('socket.io')(server,{
    cors: {
        origin: '*',
    }
});

io.on('connection', client =>{
    client.on('render_mevent',()=>{
        io.emit("render_mevent_client")
    })

    client.on('render_admin_table',()=>{
        io.emit('render_admin_table_client');
    })

    client.on('render_admin_eventTable',()=>{
        io.emit('render_admin_eventTable_client');
    })

    client.on('disconnect',()=>{
        console.log('client disconnected');
    })
});

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static(path.join(__dirname, 'frontedn/build')));

    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    });
};

server.listen(8010, ()=>{
    console.log('(+)Server is up and running with Socket-io')
})