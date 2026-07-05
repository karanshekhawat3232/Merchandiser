const express =require('express');
const isLoggedin = require('../middelwares/isLoggedin');
const productModel = require('../models/product-model');
const router=express.Router();




router.get("/",(req,res)=>{
 
let error=req.flash('error');    

res.render('index',{error});
})

router.get("/shop", isLoggedin, async (req, res) => {
    try {
        
        let products = await productModel.find();

        
        res.render('shop', { 
            user: req.user, 
            products: products 
        });
    } catch (err) {
        console.error("Shop Route Error:", err.message);
        req.flash("error", "Something went wrong loading products.");
        res.redirect("/");
    }
});











module.exports=router;