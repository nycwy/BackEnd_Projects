const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const { validateEditProfile } = require('../utils/signupValidation');

// Get Profile
profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const fullName = `${user.firstName} ${user.lastName}`;

        res.send("Welcome Mr. " + fullName);
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
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        res.send(`${loggedInUser.firstName}, your profile updated successfully`);
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

module.exports = profileRouter;