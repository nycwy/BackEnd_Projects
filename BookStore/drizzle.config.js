require('dotenv/config');
const { defineConfig } = require('drizzle-kit');

const config = defineConfig({
    dialect: "postgresql",  //database used
    out: "./drizzle",  //schema kept
    schema: './models/index.js', //schema file
    dbCredentials: {
        url: process.env.DATABASE_URL,
    }
});

module.exports = config;