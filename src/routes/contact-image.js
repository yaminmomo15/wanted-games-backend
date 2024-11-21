import express from 'express';
import { 
    getAllImages, 
    getImageByLabel, 
    create, 
    update, 
    remove 
} from '../controllers/contact-image.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes - anyone can view contact images
router.get('/', getAllImages);
router.get('/:label', getImageByLabel);

// Protected routes - only authenticated admins can modify
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