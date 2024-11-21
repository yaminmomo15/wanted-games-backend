import express from 'express';
import { 
    listAll, 
    getByLabel, 
    create, 
    update, 
    remove 
} from '../controllers/contact.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', listAll);
router.get('/:label', getByLabel);

// Protected routes
router.post('/', authenticateToken, create);
router.put('/:label', authenticateToken, update);
router.delete('/:label', authenticateToken, remove);

export default router; 