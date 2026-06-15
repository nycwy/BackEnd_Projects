require('dotenv').config();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Please login first!");
        }
        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedObj;

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send("User not found!");
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
};

module.exports = { userAuth };