import express from 'express';
import { 
    create, 
    getByUsername 
} from '../controllers/admin.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', create);  // create session/token

// Protected routes
router.get('/', authenticateToken, getByUsername); // get admin profile

export default router; 