import express from 'express';
import { 
    getAll, 
    getByLabel, 
    create, 
    update, 
    remove 
} from '../controllers/gallery.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes - anyone can view gallery images
router.get('/', getAll);
router.get('/:label', getByLabel);

// Protected routes - only authenticated admins can modify
// Use upload.single() middleware for image handling
router.post('/', 
    authenticateToken, 
    upload.single('image'), 
    create
);

router.put('/:label', 
    authenticateToken, 
    upload.single('image'), 
    update
);

router.delete('/:label', 
    authenticateToken, 
    remove
);

export default router; 