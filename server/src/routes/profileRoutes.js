const express = require('express');
const { getProfile, saveProfile} = require('../controllers/profileController');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();

router
    .route('/')
    .get(protect, getProfile)
    .post(protect, saveProfile);



module.exports = router;
