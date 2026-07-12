require('dotenv').config();
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password: " + value);
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'others'],
        message: `{VALUE} is not a gender type`,
    },
    photoURL: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpfBT6bKwsFHr3INpJ7d7yesRZvZ_BKL2UxIJG-a0pTA&s=10",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Photo URL: " + value);
            }
        }
    },
    about: {
        type: String,
        default: "This is default about",
    },
    skills: {
        type: [String],
    }
}, { timestamps: true });

userSchema.methods.getJWT = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
};

userSchema.methods.validatePassword = async function (password) {
    const user = this;
    const hashedPassword = user.password;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
}

const User = mongoose.model('User', userSchema);
module.exports = User;