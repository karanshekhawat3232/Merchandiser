const mongoose=require('mongoose');

const dbgr=require('debug')("development:mongoose");


// console.log("Mongoose Debug Mode:", process.env.DEBUG);
// console.log("Mongoose Debug Mode:", process.env.NODE_ENV);

mongoose
.connect(process.env.MONGODB_URL)
.then(()=>{
    dbgr("connected");
    console.log("hi"); 
})
.catch((err)=>{
console.log(err);
});
module.exports=mongoose.connection;