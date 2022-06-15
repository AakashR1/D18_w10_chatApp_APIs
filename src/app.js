require('dotenv').config();
const express = require("express");
const http = require('http')
const app = express();
const connectDB = require('./DB/DB_connection');
const logger = require('morgan')
const cors = require('cors');
const indexRouter = require('./routers/index.router');
const userRouter = require('./routers/user.router');
const chatRoomRouter = require('./routers/chatRoom.router');
const deleteRouter = require('./routers/delete.router')
const {verifyToken} = require('./middleware/signToken.js');
const socketio = require('socket.io');
const websockets = require('./utils/wenSockets');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(logger("dev"));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/room", verifyToken, chatRoomRouter);
app.use("/delete", deleteRouter);


app.use('*',(req,res)=>{
    return res.status(404).json({success: false,
        message: 'Oppss you are looking at something which is not exist'
    });
})

const server = http.createServer(app);

global.io = socketio(server)
global.io.on('connection',websockets.connection)

const PORT = process.env.PORT;

app.listen(PORT, async ()=>{
    try {
        await connectDB(process.env.URL);
        console.log(`server is running on port ${PORT} \nhttp://localhost:3000`);
    } catch (error) {
        console.log(error);
    }
})

