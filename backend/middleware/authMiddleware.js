const jwt = require('jsonwebtoken');
const { dbGet } = require('../config/db');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await dbGet('SELECT id, name, email, isAdmin, isBlocked FROM users WHERE id = ?', [decoded.id]);
            if (!req.user) throw new Error('User not found');
            if (req.user.isBlocked === 1) throw new Error('User is blocked');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin === 1) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
