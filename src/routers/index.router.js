const express = require('express');
const router = express.Router();
const users = require('../controllers/user.controller.js');
const {signToken} = require('../middleware/signToken.js');


router.post('/login/:userId',signToken,(req,res,next)=>{
    return res.status(200).json({success:true,authorization:req.authToken});
})
module.exports = router