const express = require('express');
const router = express.Router();
const { dbRun, dbAll } = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
    try {
        res.status(201).json({ message: 'Order created locally' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', protect, async (req, res) => {
    try {
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
