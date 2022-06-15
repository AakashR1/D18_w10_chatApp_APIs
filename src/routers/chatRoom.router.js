const express = require('express');
const router = express.Router();
const chatRoomController = require('../controllers/chatRoom.controller.js')

router.get('/',chatRoomController.getRecentConversation)
.get('/:roomId',chatRoomController.getConversationbyRoomId)
.post('/initiate',chatRoomController.initiate)
.post('/:roomId/message',chatRoomController.postMessage)
.put('/:roomId/mark-read',chatRoomController.markConversationReadByRoomId);

module.exports = router;