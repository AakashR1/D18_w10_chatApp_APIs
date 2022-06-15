const mongoose = require("mongoose");

const ConnectDB =async (url)=>{
    await mongoose.connect(url)
}

mongoose.connection.on('connected',()=>{
    console.log('mongo has connected...');
})
mongoose.connection.on('reconnected',()=>{
    console.log('mongo has reconnected...');
})
mongoose.connection.on('error',(error)=>{
    console.log('mongo connection has an error...',error);
    mongoose.disconnect()
})
mongoose.connection.on('disconnected',()=>{
    console.log('mongo has disconnected...');
})


module.exports  = ConnectDB;

