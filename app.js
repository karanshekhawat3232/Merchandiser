const express=require("express");
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const path=require('path');





const ownerRouter=require('./routes/ownerRouter');
const userRouter=require('./routes/userRouter');
const productRouter=require('./routes/productRouter');
const db=require('./config/mongoose-connection');


const app=express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Router    

app.use('/owner',ownerRouter);
app.use('/product',productRouter);
app.use('/user',userRouter);

//Router

//HOME




app.get('/',(req,res)=>{
res.render("index");
})


//HOME












app.listen(3000);