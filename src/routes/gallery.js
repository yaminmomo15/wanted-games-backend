import express from 'express';
import { 
    listAll, 
    getById, 
    create, 
    update, 
    remove,
    updateSort
} from '../controllers/gallery.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

const galleryUpload = upload.single('image');
// Public routes - anyone can view gallery images
router.get('/', listAll);
router.get('/:id', getById);

// Protected routes - only authenticated admins can modify
// Use upload.single() middleware for image handling
router.post('/', 
    authenticateToken, 
    galleryUpload, 
    create
);

router.put('/:id', 
    authenticateToken, 
    galleryUpload, 
    update
);

router.delete('/:id', 
    authenticateToken, 
    remove
);

router.patch('/reorder', 
    authenticateToken,
    updateSort
);

export default router; 