import express from 'express';
import { 
    listAll, 
    getByLabel, 
    create, 
    update, 
    remove 
} from '../controllers/about.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes - anyone can view about content
router.get('/', listAll);
router.get('/:label', getByLabel);

// Protected routes - only authenticated admins can modify
router.post('/', authenticateToken, create);
router.put('/:label', authenticateToken, update);
router.delete('/:label', authenticateToken, remove);

export default router; 