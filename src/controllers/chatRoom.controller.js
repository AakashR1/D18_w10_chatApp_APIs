const makeValidation = require("@withvoid/make-validation");
const {CHAT_ROOM_TYPES}= require('../models/chatRoom');
const {ChatRoom} = require('../models/chatRoom');
const {User} = require('../models/user.model');
const {ChatMessageModel} = require('../models/chatMessage.model')
const initiate =async (req,res)=>{
    try {
        const validation = makeValidation(types=> ({
            payload:req.body,
            checks:{
                userIds:{
                    type:types.array,
                    optoins:{unique:true,empty:false,stringOnly:true}
                },
                type:{type:types.enum, options:{enum:CHAT_ROOM_TYPES}}
            }
        }));
        if(!validation.success){
            return res.status(400).json({...validation});
        }
        const {userIds, type} = req.body;
        const {userId:chatInitator} = req;
        const allUserIds = [...userIds,chatInitator];
        const chatRoom = await ChatRoom.initiateChat(allUserIds, type,chatInitator);
        return res.status(200).json({succss:true, chatRoom});
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const postMessage =async (req,res)=>{
    try {
        const {roomId} = req.params;
        const validation = makeValidation(types=>({
            payload:req.body,
            checks:{
                messageText:{type:types.string},
            }
        }));
        if(!validation.success) return res.status(400).json({...validation});

        const messagePayload = {
            messageText:req.body.messageText
        };

        const currentLoggedUser =req.userId;
        const post = await ChatMessageModel.createPostInChatRoom(roomId,messagePayload,currentLoggedUser);
        console.log(post);
        global.io.sockets.in(roomId).emit('new message',{message:post});
        return res.status(200).json({success:true,post:post});
    } catch (error) {
        console.log(error);
        res.send(error)
    }    
}

const getConversationbyRoomId =async (req,res)=>{
    try {
        const{ roomId } = req.params;
        const room = await ChatRoom.getChatRoomByRoomId(roomId);
        if(!room){
            return res.status(400).json({
                success:false,
                message:'No room exists for this id'
            })
        }
        const users = await User.getUserByIds(room.userIds);

        const options = {
            page:parseInt(req.query.page) || 0,
            limit:parseInt(req.query.limit) || 10,
        };
        const conversation = await ChatMessageModel.getConversationbyRoomId(roomId,options);
        return res.status(200).json({
            success:true,
            conversation,
            users
        });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

const getRecentConversation= async(req,res)=>{
    try {
        const currentLoggedUser = req.userId;
        const options = {
          page: parseInt(req.query.page) || 0,
          limit: parseInt(req.query.limit) || 10,
        };
        const rooms = await ChatRoom.getChatRoomsByUserId(currentLoggedUser);
        const roomIds = rooms.map(room => room._id);
        const recentConversation = await ChatMessageModel.getRecentConversation(
          roomIds, options, currentLoggedUser
        );
        return res.status(200).json({ success: true, conversation: recentConversation });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
      }
}

const markConversationReadByRoomId=async (req,res)=>{
    try {
        const {roomId} = req.params;
        const room = await ChatRoom.getChatRoomByRoomId(roomId);
        if(!room){
            return res.status(400).json({
                success:false,
                message:'No room exists for this id',
            })
        }
        const currentLoggedUser = req.userId;
        const result = await ChatMessageModel.markMessageRead(roomId,currentLoggedUser);
        return res.status(200).json({success:true,data:result});
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

module.exports ={
    initiate,
    postMessage,
    getRecentConversation,
    getConversationbyRoomId,
    markConversationReadByRoomId
}