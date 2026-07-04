const express=require('express');
const userModel = require('../models/user-model');
const router=express.Router();


const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const path=require('path');

const {registerUser,loginUser}=require('../controllers/authController')


router.get('/',(req,res)=>{
res.send("HIIII");
})



//register
router.post('/register',registerUser);    
//register

//login
router.post('/login',loginUser);   
//login







module.exports=router;