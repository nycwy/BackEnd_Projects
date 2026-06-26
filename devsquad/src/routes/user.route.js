const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest.model');
const userRouter = express.Router();

// Get all the pending connection request for the logged in user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"]);

        res.json({ message: "Data fetched Successfully", data: connectionRequest });
    } catch (error) {
        return res.status(400).send("ERROR: " + error.message);
    }
})

module.exports = userRouter;