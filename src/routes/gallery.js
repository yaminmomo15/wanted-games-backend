import express from 'express';
import { 
    listAll, 
    getByLabel, 
    create, 
    update, 
    remove 
} from '../controllers/gallery.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes - anyone can view gallery images
router.get('/', listAll);
router.get('/search', getByLabel);

// Protected routes - only authenticated admins can modify
// Use upload.single() middleware for image handling
router.post('/', 
    authenticateToken, 
    upload.single('image'), 
    create
);

router.put('/', 
    authenticateToken, 
    upload.single('image'), 
    update
);

router.delete('/', 
    authenticateToken, 
    remove
);

export default router; 