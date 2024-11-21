import express from 'express';
import { 
    create, 
    getByUsername 
} from '../controllers/admin.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', create);  // create session/token

// Protected routes
router.get('/profile', authenticateToken, getByUsername);

export default router; 