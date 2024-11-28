import express from 'express';
import { 
    listAll, 
    create, 
    update, 
    remove,
    getById
} from '../controllers/email.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes - anyone can view emails
router.get('/', listAll);
router.get('/:id', getById);

// Protected routes - only authenticated admins can modify
router.post('/',
    authenticateToken,
    create
);

router.put('/:id',
    authenticateToken,
    update
);

router.delete('/:id',
    authenticateToken,
    remove
);

export default router;
