require("dotenv").config();
const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
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

connection();
