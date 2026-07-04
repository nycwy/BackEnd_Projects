const express = require('express');
const authRouter = express.Router();

const User = require('../models/user.model');
const { validateSignUpData } = require('../utils/signupValidation');
const bcrypt = require('bcrypt');

// Signup
authRouter.post('/signup', async (req, res) => {
    try {
        // Signup validation
        validateSignUpData(req);
        const { firstName, lastName, emailId, password, age, skills, gender } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName, emailId,
            password: hashedPassword,
            age,
            skills,
            gender,
            photoURL
        });
        await user.save();
        res.send("User created successfully");
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

// Login
authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error('Invalid Credentials');
        }
        const validPassword = await user.validatePassword(password);

        if (validPassword) {
            const token = user.getJWT();

            res.cookie("token", token);
            res.send(user);
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

// Logout
authRouter.post('/logout', async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successful!!");
});

module.exports = authRouter;