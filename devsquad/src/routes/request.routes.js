const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest.model');
const User = require('../models/user.model');

// Connection request send
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const toUserId = req.params.toUserId;
        const fromUserId = req.user._id;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ]
        });

        if (existingConnectionRequest) {
            return res.status(400).send({ message: "Connection Request Already Exist" });
        }

        const isValidUser = await User.exists({ _id: toUserId });
        if (!isValidUser) {
            return res.status(400).send("User not exist");
        }

        const connectionRequest = new ConnectionRequest({
            toUserId,
            fromUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({
            message: "Connection Request Sent Successfully!",
            data,
        });

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Status not allowed" });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });

        if (!connectionRequest) {
            return res.status(400).json({ message: "Connection request not found" });
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();
        res.json({ message: "Connection request " + status, data });
    } catch (error) {
        return res.status(400).send("ERROR: " + error.message);
    }
})

module.exports = requestRouter;