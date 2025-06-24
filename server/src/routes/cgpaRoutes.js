const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
    getCGPAData,
    saveCGPAData,
    calculateCGPA
} = require('../controllers/cgpaController');


router.get('/', auth, getCGPAData);
router.post('/save', auth, saveCGPAData);
router.get('/calculate', auth, calculateCGPA);

module.exports = router;
