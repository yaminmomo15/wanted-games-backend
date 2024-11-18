const express = require('express');
const ContentController = require('../controllers/contentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.get('/', ContentController.getAll);
router.get('/:id', ContentController.getOne);

// Protected routes (require authentication)
router.post('/', authenticateToken, ContentController.create);
router.put('/:id', authenticateToken, ContentController.update);
router.delete('/:id', authenticateToken, ContentController.delete);

module.exports = router; 