const mongoose=require('mongoose');

const userSchema=mongoose.Schema(
    {
        Name:String,
        email:String,
        password:String,
        cart:[],
        isAdmin:Boolean,
        orders:[],
        contact:Number,
        picture:String
    }
)

module.exports=mongoose.model('user',userSchema); 