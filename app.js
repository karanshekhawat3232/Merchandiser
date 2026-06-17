const express=require("express");
const cookie_parser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const bcrypt=require(bcrypt);
const path=require('path');
const app=express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


//HOME

app.get('/',(req,res)=>{
res.render("index");
})


//HOME












app.listen(3000);