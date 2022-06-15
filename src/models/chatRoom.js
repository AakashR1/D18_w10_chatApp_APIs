const mongoose = require('mongoose');
const {v4} = require('uuid');
const uuidv4 = v4;

const CHAT_ROOM_TYPES = {
    CONSUMER_TO_CONSUMER:"consumer-to-consumer",
    CONSUMER_TO_SUPPORT:"consumer-to-support",
};

const chatRoomSchema = new mongoose.Schema({
    _id:{
        type:String,
        default:()=> uuidv4().replace(/\-/g, "")
    },
    userIds : Array,
    type:String,
    chatInitiator:String
    },
    {
        timestamps:true,
        collection:"chatrooms"
});

    chatRoomSchema.statics.initiateChat = async function(userIds,type,chatInitiator){
        try {
            console.log(userIds,type,chatInitiator);
            const availableRoom = await this.findOne({
                userIds:{
                    $size:userIds.length,
                    $all:[...userIds],
                },
                type,
            });
            if(availableRoom){
                return {
                    isNew:false,
                    message:'retrieving an old chat room',
                    chatRoomId:availableRoom._doc._id,
                    type:availableRoom._doc.type,
                };
            }

            const newRoom = await this.create({userIds,type,chatInitiator});
            return {
                isNew:true,
                message:'creating a new chatroom',
                chatRoomId:newRoom._doc._id,
                type:newRoom._doc._id,
            };
        } catch (error) {
            console.log(error);
            throw error
        }
    }


    chatRoomSchema.statics.getChatRoomByRoomId = async function(roomId){
    try {
        const room = await this.findOne({_id:roomId});
        return room;
    } catch (error) {
        console.log(error);
        res.send(error);
}
}

chatRoomSchema.statics.getChatRoomsByUserId = async function(userIds){
    try {
        const rooms =await this.find({userIds:{$all:[userIds]}});
        console.log(rooms);
        return rooms
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

const ChatRoom = mongoose.model('ChatRoom',chatRoomSchema);
module.exports= {
    ChatRoom,
    CHAT_ROOM_TYPES
};