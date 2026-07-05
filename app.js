require('dotenv').config();
const express=require("express");
const cookieParser=require('cookie-parser');
const expressSession = require("express-session");
const flash = require("connect-flash");
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const path=require('path');

const app=express();



app.set('view engine', 'ejs');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET 
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});






const indexRouter = require('./routes/index');
const ownerRouter=require('./routes/ownerRouter');
const userRouter=require('./routes/userRouter');
const productRouter=require('./routes/productRouter');

const db=require('./config/mongoose-connection');




//Router    
app.use('/', indexRouter);
app.use('/owner',ownerRouter);
app.use('/product',productRouter);
app.use('/user',userRouter);

//Router

//HOME







//HOME






console.log(process.env.NODE_ENV);





app.listen(3000);