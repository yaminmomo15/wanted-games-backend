import express from 'express';
import { login, profile } from '../controllers/admin.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, profile);

export default router; 