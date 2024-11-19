import express from 'express';
import { createContentController, getAllContentController, getOneContentController, updateContentController, deleteContentController } from '../controllers/contentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllContentController);
router.get('/:id', getOneContentController);

// Protected routes (require authentication)
router.post('/', authenticateToken, createContentController);
router.put('/:id', authenticateToken, updateContentController);
router.delete('/:id', authenticateToken, deleteContentController);

export default router; 