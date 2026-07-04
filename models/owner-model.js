const mongoose=require('mongoose');

const ownerSchema=mongoose.Schema(
    {
        Name:String,
        email:String,
        password:String,
        isAdmin:Boolean,
        products:[],
        contact:Number,
        picture:String,
        gstin:String
    } 
)

module.exports=mongoose.model('owener',ownerSchema); 