const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const { validateEditProfile } = require('../utils/signupValidation');
const bcrypt = require('bcrypt');
const validator = require('validator');


// Get Profile
profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const fullName = `${user.firstName} ${user.lastName}`;

        res.json(user);
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

// Edit Profile
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateEditProfile(req)) {
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser = req.user;
        // Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        loggedInUser.set(req.body);
        await loggedInUser.save();
        res.json(loggedInUser);
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

// Change Password
profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).send("Both old and new passwords are required");
        }
        const strongPassword = validator.isStrongPassword(newPassword);
        if (!strongPassword) {
            throw new Error("Please enter a strong Password!");
        }
        if (oldPassword === newPassword) {
            return res.status(400).send("New password must be different from the old password");
        }
        const userPassword = loggedInUser.password;
        const isValidPassword = await bcrypt.compare(oldPassword, userPassword);

        if (!isValidPassword) {
            return res.status(401).send("Incorrect Password");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        loggedInUser.set({ password: hashedPassword });

        await loggedInUser.save();

        res.status(200).send("Password Changed successfully!");
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

module.exports = profileRouter;