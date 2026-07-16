const express = require('express');
const router = express.Router();
const ownerModel = require("../models/owner-model");
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");

if (process.env.NODE_ENV === "development") {
    router.post('/create', async (req, res) => {
        let owners = await ownerModel.find();
        if (owners.length) return res.status(503).send("Cant create New Owner");

        let { Name, email, password } = req.body;
        await ownerModel.create({ Name, email, password });
        res.status(201).send("Owner created");
    });
}

router.get('/admin', (req, res) => {
    res.render("createproducts");
});

router.post("/product/create", upload.single("image"), async function (req, res) {
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        if (!req.file) {
            req.flash("error", "Product image is required.");
            return res.redirect("/owner/admin");
        }
        if (!name || !price) {
            req.flash("error", "Product name and price are required.");
            return res.redirect("/owner/admin");
        }

        await productModel.create({
            image: req.file.buffer,
            name,
            price: Number(price),
            discount: Number(discount) || 0,
            bgcolor,
            panelcolor,
            textcolor
        });

        req.flash("success", "Product created successfully.");
        res.redirect("/owner/admin");
    } catch (err) {
        console.error("Product Create Error:", err.message);
        req.flash("error", "Failed to create product. Please try again.");
        res.redirect("/owner/admin");
    }
});

module.exports = router;