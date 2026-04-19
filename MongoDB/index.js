import 'dotenv/config';
import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import express from 'express';
import { connectMongoDB } from './connection.js';

const app = express();
const PORT = process.env.PORT ?? 8000;

connectMongoDB(process.env.MONGODB_URL)
    .then(() => {
        console.log(`MongoDB Connected`);
        app.listen(PORT, () => {
            console.log(`Server is up and running on port ${PORT}`);
        });
    })
    .catch((error) => console.error('Error connecting to MongoDB: ', error));