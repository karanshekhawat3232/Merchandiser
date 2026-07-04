const express=require('express');
const router=express.Router();
const owenerModel=require("../models/owner-model");
const ownerModel = require('../models/owner-model');


if(process.env.NODE_ENV==="development"){

    router.post('/create',async(req,res)=>{

  let owners= await ownerModel.find();

  if(owners.length)return res
  .send(503)
  .send("Cant create New Owner");
  
  let {Name,email,password}=req.body;

 let createdOwener= await owenerModel.create({

        Name,
        email,
        password
        


  }); 
  
  res.status(201).send("can create owener");

})

}


router.get('/',(req,res)=>{
res.send("Working");
})






module.exports=router;          