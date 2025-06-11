const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');

router.get('/testing-only-profile', protect, (req, res) => {
    res.json({ message: 'Profile Access Granted', user: req.user });
});

module.exports = router;
