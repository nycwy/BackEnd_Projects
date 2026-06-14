const mongoose = require('mongoose');
const validator = require('validator');

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
        required: true,
        min: 18,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'others'],
    },
    skills: {
        type: [String],
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;