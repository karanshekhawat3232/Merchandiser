const express = require('express');
const mongoose = require('mongoose');
const isLoggedin = require('../middelwares/isLoggedin');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
const router = express.Router();

router.get("/", (req, res) => {
    res.render('index', { loggedin: false });
});

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

router.get("/addtocart/:productid", isLoggedin, async function (req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.productid)) {
            req.flash("error", "Invalid product.");
            return res.redirect("/shop");
        }

        let product = await productModel.findById(req.params.productid);
        if (!product) {
            req.flash("error", "Product not found.");
            return res.redirect("/shop");
        }

        let user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/shop");
        }

        user.cart.push(req.params.productid);
        await user.save();

        req.flash("success", "Item added to cart!");
        res.redirect("/shop");
    } catch (err) {
        console.error("Add to Cart Error:", err.message);
        req.flash("error", "Could not add item to cart.");
        res.redirect("/shop");
    }
});

router.get("/cart", isLoggedin, async function (req, res) {
    try {
        let user = await userModel
            .findOne({ email: req.user.email })
            .populate("cart");

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/");
        }

        const platformFee = 20;

        if (!user.cart || user.cart.length === 0) {
            return res.render("cart", {
                user,
                groupedCart: [],
                bill: { totalMRP: 0, totalDiscount: 0, platformFee, totalAmount: platformFee }
            });
        }

        const groupedMap = {};
        user.cart.forEach(item => {
            if (!item) return;
            const id = item._id.toString();
            if (groupedMap[id]) {
                groupedMap[id].quantity += 1;
            } else {
                groupedMap[id] = { item, quantity: 1 };
            }
        });

        const groupedCart = Object.values(groupedMap);

        let totalMRP = 0;
        let totalDiscount = 0;

        groupedCart.forEach(({ item, quantity }) => {
            totalMRP += Number(item.price || 0) * quantity;
            totalDiscount += Number(item.discount || 0) * quantity;
        });

        const totalAmount = totalMRP - totalDiscount + platformFee;
        const bill = { totalMRP, totalDiscount, platformFee, totalAmount };

        res.render("cart", { user, groupedCart, bill });
    } catch (err) {
        console.error("Cart Route Error:", err.message);
        req.flash("error", "Could not load cart.");
        res.redirect("/shop");
    }
});

router.post("/checkout", isLoggedin, async function (req, res) {
    try {
        let user = await userModel
            .findOne({ email: req.user.email })
            .populate("cart");

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/");
        }

        if (!user.cart || user.cart.length === 0) {
            req.flash("error", "Your cart is empty.");
            return res.redirect("/cart");
        }

        const platformFee = 20;
        const groupedMap = {};
        user.cart.forEach(item => {
            if (!item) return;
            const id = item._id.toString();
            if (groupedMap[id]) {
                groupedMap[id].quantity += 1;
            } else {
                groupedMap[id] = { item, quantity: 1 };
            }
        });

        const groupedCart = Object.values(groupedMap);
        let totalMRP = 0;
        let totalDiscount = 0;

        groupedCart.forEach(({ item, quantity }) => {
            totalMRP += Number(item.price || 0) * quantity;
            totalDiscount += Number(item.discount || 0) * quantity;
        });

        const totalAmount = totalMRP - totalDiscount + platformFee;

        const orderItems = groupedCart.map(({ item, quantity }) => ({
            name: item.name,
            price: Number(item.price || 0) - Number(item.discount || 0),
            image: item.image ? "data:image/jpeg;base64," + item.image.toString("base64") : ""
        }));

        user.purchaseHistory.push({
            items: orderItems,
            totalAmount: totalAmount
        });
        user.cart = [];
        await user.save();

        req.flash("success", "Order placed successfully! Thank you for shopping.");
        res.redirect("/account");
    } catch (err) {
        console.error("Checkout Error:", err.message);
        req.flash("error", "Checkout failed. Please try again.");
        res.redirect("/cart");
    }
});

router.get("/account", isLoggedin, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/");
        }

        const sortedHistory = (user.purchaseHistory || [])
            .slice()
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        res.render("account", { user, purchaseHistory: sortedHistory });
    } catch (err) {
        console.error("Account Route Error:", err.message);
        req.flash("error", "Could not load account.");
        res.redirect("/shop");
    }
});

module.exports = router;