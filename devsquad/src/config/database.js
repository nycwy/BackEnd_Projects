require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers([
    '8.8.8.8',
    '8.8.4.4'
]);

const connectDB = async () => {
    await mongoose.connect(process.env.DB_URI);
};

module.exports = connectDB;