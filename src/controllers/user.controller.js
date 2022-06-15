const  makeValidation = require('@withvoid/make-validation');
const { USER_TYPES} = require('../models/user.model');
const {User} = require('../models/user.model');

const onGetAllUsers =async (req,res)=>{
    try {
        const users  =  await User.find();
        if(!users) throw({error:"No user is found"})
        res.status(200).json({success:true,users})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,error:error});
    }
}

const onGetUserById =async (req,res)=>{
    try {
        // const user  =  await User.findById(req.params.id);
        const user  =  await User.getUserById(req.params.id);
        if(!user) throw({error:"No user with this id is found"});
        res.status(200).json({success:true,user})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,error:error});
    }
}

const onCreateUser =async (req,res)=>{
    try {
        const validation = makeValidation(types=>({
            payload:req.body,
            checks:{
                firstName:{type:types.string},
                lastName:{type:types.string},
                type:{type:types.enum, options:{enum:USER_TYPES}},

            }
        }));
        if(!validation.success) return res.status(400).json(validation);
        const user = await User.create(req.body);
        res.status(200).json({success:true,user});

    } catch (error) {
        console.log(error);
        res.status(500).json({"error":error})
    }
};

const onDeleteUserById = async(req,res)=>{
    try {
        const user  =  await User.deleteOne({ _id:req.params.id});
        if(user.deletedCount === 0) res.status(200).json({success:true,message:`No such a user to count`})
        res.status(200).json({success:true,message:`Deleted a count of ${user.deletedCount} user`})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,error:error});
    }
}



module.exports = {
    onGetAllUsers,
    onGetUserById,
    onCreateUser,
    onDeleteUserById
}