const express = require('express');
const router = express.Router();

const deletecontroller = require('../controllers/delete.controller.js')

router.delete('/room/:roomid',deletecontroller.deleteRoomById);
router.delete('/message/:messageId',deletecontroller.deleteMessageById)

module.exports = router