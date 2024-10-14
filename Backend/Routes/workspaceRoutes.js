// backend/routes/workspaceRoutes.js

const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const authMiddleware = require('../middleware/auth');

router.post('/create', authMiddleware, workspaceController.createWorkspace);

module.exports = router;
