const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authMiddleware = require('../middleware/auth');

router.get('/workspaces/:workspaceId/posts', authMiddleware, activityController.getActivityPosts);
router.post('/workspaces/:workspaceId/posts', authMiddleware, activityController.createActivityPost);
router.get('/workspaces/:workspaceId/tasks', authMiddleware, activityController.getWorkspaceTasks);
router.post('/workspaces/:workspaceId/tasks', authMiddleware, activityController.createTask);

module.exports = router;
