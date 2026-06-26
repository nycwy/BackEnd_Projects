require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user.model');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth.routes');
const profileRouter = require('./routes/profile.routes');
const connectionRequest = require('./routes/request.routes');
const userRouter = require('./routes/user.route');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', connectionRequest);
app.use('/', userRouter);


const connection = async () => {
    try {
        await connectDB();
        console.log("Database is connected");
        app.listen(3000, () => {
            console.log("Server is up and running!");
        });
    } catch (error) {
        console.log("Cannot connect to the database" + error.message);
    }
}

// Get User by Email
app.get('/user/email/:emailId', async (req, res) => {
    const userEmail = req.params.emailId;
    try {
        const users = await User.findOne({ emailId: userEmail });
        if (!users) {
            return res.status(404).send("User not found");
        }
        res.send(users);
    } catch (error) {
        res.status(400).send("Something went wrong!");
    }
});

// Get all the Users
app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(400).send("Something went wrong!");
    }
});

// Get user by ID
app.get('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        res.status(400).send('Something went wrong');
    }
});

// Delete user by ID
app.delete('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        res.send('User deleted successfully');
    } catch (error) {
        res.status(400).send('Something went wrong');
    }
});

//Update data of a User
app.patch('/user/:id', async (req, res) => {
    const userId = req.params.id;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = [
            "firstName",
            "lastName",
            "age",
            "gender",
            "skills"
        ];

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }

        if (data.skills?.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }

        const updatedField = req.body;
        const user = await User.findByIdAndUpdate(userId, updatedField, { runValidators: true });
        res.send('User updated successfully');
    } catch (error) {
        res.status(400).send('ERROR: ' + error.message);
    }
});

connection();
