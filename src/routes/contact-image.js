import express from 'express';
import { 
    listAll, 
    getByLabel, 
    create, 
    update, 
    remove 
} from '../controllers/contact-image.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes - anyone can view contact images
router.get('/', listAll);
router.get('/search', getByLabel);

// Protected routes - only authenticated admins can modify
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