const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth');

// Get Profile
profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const fullName = `${user.firstName} ${user.lastName}`;

        res.send("Welcome Mr. " + fullName);
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

module.exports = profileRouter;