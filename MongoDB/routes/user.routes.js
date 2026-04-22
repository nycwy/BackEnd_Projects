import express from 'express';
import { randomBytes, createHmac } from 'node:crypto';
import User from '../models/user.model.js';


const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({
        email,
    });
    if (existingUser) {
        return res
            .status(400)
            .json({ error: `User with email ${email} already exists` });
    }
    const salt = randomBytes(256).toString('hex');
    const hashedPassword = createHmac('sha256', salt)
        .update(password)
        .digest('hex');
    
    const user = await User.insertOne({
        name,
        email,
        password: hashedPassword,
        salt
    });

    return res.status(201).json({
        status: 'success',
        data: { id: user._id }
    });
});

export default router;