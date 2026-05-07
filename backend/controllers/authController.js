const { dbGet, dbRun } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
        if (userExists) return res.status(400).json({ message: 'User already exists' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const result = await dbRun('INSERT INTO users (name, email, password) VALUES (?,?,?)', [name, email, hashedPassword]);
        res.status(201).json({
            _id: result.lastID, name, email, isAdmin: false,
            token: generateToken(result.lastID)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
        if (user && (await bcrypt.compare(password, user.password))) {
            if (user.isBlocked) return res.status(403).json({ message: 'User is blocked' });
            res.json({
                _id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin === 1,
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };
