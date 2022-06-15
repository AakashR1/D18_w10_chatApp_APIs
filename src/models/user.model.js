const { default: mongoose } = require('mongoose');
const { v4 } = require('uuid');
uuidv4 = v4;
USER_TYPES = {
    CONSUMER: "consumer",
    SUPPORT:"support"
};

const userSchema = new mongoose.Schema({
    _id:{
        type:String,
        default:()=>uuidv4().replace(/\-/g, ""),
    },
    firstName:String,
    lastName:String,
    type:String
},
{
    timestamps:true,
    collection:"users"
});



userSchema.statics.getUserById = async function (id) {
    try {
        const user = await this.findOne({ _id: id });
        if (!user) throw ({ error: 'No user with this id found' });
        return user;
    } catch (error) {
        throw error;
    }
}

userSchema.statics.getUserByIds = async function(ids){
    try {
    
        const users = await this.find({_id:{$in:ids}});
        return users;
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const User = mongoose.model('User',userSchema);
module.exports =  {
    User,
    USER_TYPES
};
