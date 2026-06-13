const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user.model');

app.use(express.json());

const connection = async () => {
    try {
        await connectDB();
        console.log("Database is connected");
        app.listen(3000, () => {
            console.log("Server is up and running!");
        });
    } catch (error) {
        console.log("Cannot connect to the database", error.message);
    }
}

app.post('/signup', async(req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User created successfully");
    } catch (error) {
        res.status(400).send("Error saving the user: ", error.message);
    }
});

app.get('/user', async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const users = await User.find({ emailId: userEmail });
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (error) {
        res.status(400).send("Something went wrong!");
    }
})

connection();
