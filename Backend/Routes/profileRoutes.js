// backend/routes/profileRoutes.js

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');

router.post('/complete-profile', authMiddleware, profileController.completeProfile);

// Add this route
router.get('/me', authMiddleware, profileController.getCurrentUser);

module.exports = router;
