const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');

router.get('/', userController.onGetAllUsers)
router.post('/', userController.onCreateUser)
router.get('/:id', userController.onGetUserById)
router.delete('/:id', userController.onDeleteUserById)

module.exports = router