
const bcrypt = require('bcrypt');
const userModel = require('../models/user-model');
const { genrateToken } = require('../utilites/genrateToken');

module.exports.registerUser = async (req, res) => {
    try {
        const { Name, email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (user) return res.status(401).send("Duplicate Registration");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userCreated = await userModel.create({
            Name,
            email,
            password: hashedPassword
        });

        let token = genrateToken(userCreated);
        res.cookie("token", token);
        return res.send("user created successfully");

    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (!user) return res.send("Wrong email or password");

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send("Server Error");
            }
            if (!result) return res.send("Wrong email or password");

            let token = genrateToken(user);
            res.cookie("token", token);
            return res.send("HIHIIHI");
        });

    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
};