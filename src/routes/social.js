import express from 'express';
import { 
    listAll,
    create,
    update,
    remove,
    getById,
    updateSort
} from '../controllers/social.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Configure multer for icon upload
const socialUpload = upload.fields([
    { name: 'image', maxCount: 1 }
]);

// Public routes - anyone can view social links
router.get('/', listAll);
router.get('/:id', getById);

// Protected routes - only authenticated admins can modify
router.post('/',
    authenticateToken,
    socialUpload,
    create
);

router.put('/:id',
    authenticateToken,
    socialUpload,
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
