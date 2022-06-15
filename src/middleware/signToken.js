require('dotenv').config();
const jwt = require('jsonwebtoken');
const {User} = require('../models/user.model');

const SECRET_KEY = process.env.SECRET_KEY

const signToken =async (req,res,next)=>{
    try {
        console.log('here');
        const{userId }=  req.params;
        const user = await User.findById(userId);
        if(!user) {
           return res.status(400).json({success:false,message:"No such a user with is id"})
        }
        const payload = {
            userId:user._id,
            userType : user.type
        };
        const authToken = jwt.sign(payload,SECRET_KEY);
        console.log("Auth",authToken);
        req.authToken = authToken;
        next()
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const verifyToken =async (req,res,next)=>{
    // return next();
    if(!req.headers['authorization']){
        return res.status(400).json({success:false, message:'No access token is provided'});
    }
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(accessToken,SECRET_KEY);
        req.userId = decoded.userId;
        req.userType = decoded.type
        return next();
    } catch (error) {
    }
    return res.status(401).json({success:false, message:error.message})
}
module.exports = {
    signToken,
    verifyToken
}


