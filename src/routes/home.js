import express from 'express';
import { 
    listAll,
    create,
    update,
    remove,
    getById,
    updateSort
} from '../controllers/home.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Configure multer for single image upload
const homeUpload = upload.fields([
    { name: 'image', maxCount: 1 }
]);

// Public routes - anyone can view home sections
router.get('/', listAll);
router.get('/:id', getById);

// Protected routes - only authenticated admins can modify
router.post('/',
    authenticateToken,
    homeUpload,
    create
);

router.put('/:id',
    authenticateToken,
    homeUpload,
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
