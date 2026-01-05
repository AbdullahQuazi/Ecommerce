const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { readJSON, writeJSON, generateId } = require('../config/db');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/google
// @desc    Authenticate with Google
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Check if user exists
        const users = readJSON('users.json');
        let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            // Create new user
            user = {
                id: generateId(),
                googleId,
                name,
                email,
                picture,
                role: 'user',
                createdAt: new Date().toISOString(),
            };
            users.push(user);
            writeJSON('users.json', users);
        } else {
            // Update existing user with Google info
            user.googleId = googleId;
            user.picture = picture;
            if (!user.name) user.name = name;
            writeJSON('users.json', users);
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            role: user.role,
            token: generateToken(user.id),
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(401).json({ message: 'Google authentication failed' });
    }
});

// @route   GET /api/auth/me
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const users = readJSON('users.json');
        const user = users.find(u => u.id === decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            role: user.role,
        });
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    }
});

module.exports = router;
