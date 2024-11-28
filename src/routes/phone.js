import express from 'express';
import { 
    listAll,
    create,
    update,
    remove,
    getById,
    updateSort
} from '../controllers/phone.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Configure multer for icon upload
const phoneUpload = upload.fields([
    { name: 'image', maxCount: 1 }
]);

// Public routes - anyone can view phone numbers
router.get('/', listAll);
router.get('/:id', getById);

// Protected routes - only authenticated admins can modify
router.post('/',
    authenticateToken,
    phoneUpload,
    create
);

router.put('/:id',
    authenticateToken,
    phoneUpload,
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
