const bcrypt = require('bcrypt');
const userModel = require('../models/user-model');
const { genrateToken } = require('../utilites/genrateToken');

module.exports.registerUser = async (req, res) => {
    try {
        const { Name, email, password } = req.body;

        if (!Name || !email || !password) {
            req.flash("error", "All fields are required.");
            return res.redirect("/");
        }

        let user = await userModel.findOne({ email });
        if (user) {
            req.flash("error", "An account with this email already exists.");
            return res.redirect("/");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userCreated = await userModel.create({
            Name,
            email,
            password: hashedPassword
        });

        let token = genrateToken(userCreated);
        res.cookie("token", token);
        req.flash("success", "Account created! Welcome to Merchandiser.");
        return res.redirect("/shop");

    } catch (err) {
        console.error("Register Error:", err.message);
        req.flash("error", "Something went wrong. Please try again.");
        return res.redirect("/");
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            req.flash("error", "Email and password are required.");
            return res.redirect("/");
        }

        let user = await userModel.findOne({ email });
        if (!user) {
            req.flash("error", "Wrong email or password.");
            return res.redirect("/");
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error("Bcrypt Error:", err.message);
                req.flash("error", "Something went wrong. Please try again.");
                return res.redirect("/");
            }
            if (!result) {
                req.flash("error", "Wrong email or password.");
                return res.redirect("/");
            }

            let token = genrateToken(user);
            res.cookie("token", token);
            return res.redirect('/shop');
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        req.flash("error", "Something went wrong. Please try again.");
        return res.redirect("/");
    }
};

module.exports.logOutUser = async (req, res) => {
    res.cookie("token", "");
    req.flash("success", "You have been logged out.");
    res.redirect('/');
};