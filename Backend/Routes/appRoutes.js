const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, appController.createApp);
router.get('/workspace/:workspaceId', authMiddleware, appController.getAppsByWorkspace);
router.get('/:appId/fields', authMiddleware, appController.getAppFields);
router.put('/:appId/fields', authMiddleware, appController.updateAppFields);
router.get('/:appId', authMiddleware, appController.getAppDetails);

// New routes for app items
router.get('/:appId/items', authMiddleware, appController.getAppItems);
router.post('/:appId/items', authMiddleware, appController.createAppItem);
router.put('/:appId/items/:itemId', authMiddleware, appController.updateAppItem);
router.delete('/:appId/items/:itemId', authMiddleware, appController.deleteAppItem);

module.exports = router;
