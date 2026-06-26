const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest.model');
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender skills";

// Get all the pending connection request for the logged in user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({ message: "Data fetched Successfully", data: connectionRequest });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
});

// Get accepted connection
userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ],
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);
        
        const validConnection = connectionRequest.filter((req) => req.fromUserId && req.toUserId);

        const data = validConnection.map((obj) => {
            if (obj.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return obj.toUserId;
            }
            return obj.fromUserId;
        });
        
        res.json({ data });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
});

module.exports = userRouter;