const jwt = require('jsonwebtoken');
const { readJSON } = require('../config/db');

// Protect routes
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const users = readJSON('users.json');
            const user = users.find(u => u.id === decoded.id);

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = { ...user, _id: user.id };
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

module.exports = { protect, admin };
