const mongoose=reuire('mongoose');

const productSchema=mongoose.Schema({
image:String,
name:String,
price:Number,
discount:{
    type:Number,
    default:0
},
bgColor:String,
panelColor:String
})

module.exports=mongoose.model('product',productSchema);