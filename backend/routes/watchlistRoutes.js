const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Get user's watchlist
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.watchlist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add coin to watchlist
router.post('/add', protect, async (req, res) => {
    try {
        const { coinId } = req.body;
        const user = await User.findById(req.user.id);

        if (user.watchlist.includes(coinId)) {
            return res.status(400).json({ message: 'Coin already in watchlist' });
        }

        user.watchlist.push(coinId);
        await user.save();

        res.json(user.watchlist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Remove coin from watchlist
router.delete('/remove/:coinId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.watchlist = user.watchlist.filter(id => id !== req.params.coinId);
        await user.save();

        res.json(user.watchlist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
