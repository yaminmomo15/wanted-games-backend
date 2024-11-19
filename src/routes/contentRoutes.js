import express from 'express';
import { createContentController, getAllContentController, getOneContentController, updateContentController, deleteContentController } from '../controllers/contentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/', getAllContentController);      // Get all content
router.get('/:id', getOneContentController);   // Get single content by ID

// Protected routes - require valid JWT token
router.post('/', authenticateToken, createContentController);     // Create new content
router.put('/:id', authenticateToken, updateContentController);   // Update existing content
router.delete('/:id', authenticateToken, deleteContentController); // Delete content

export default router; 