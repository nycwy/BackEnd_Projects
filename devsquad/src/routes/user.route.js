const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest.model');
const User = require('../models/user.model');
const userRouter = express.Router();

// Safe to be exposed in the connection section
const USER_SAFE_DATA = "firstName lastName age gender skills photoURL about";

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

// Feed data
userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 10 ? 10 : limit;

        const skip = (page - 1) * limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ],
        })
            .select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        })
            .select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit)

        res.json(users);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

module.exports = userRouter;