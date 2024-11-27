import express from 'express';
import { 
    listAll,  
    create, 
    update, 
    remove, 
    getById,
    updateSort 
} from '../controllers/game.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Configure multer for multiple image uploads
const gameUpload = upload.fields([
    { name: 'image_main', maxCount: 1 },
    { name: 'image_1', maxCount: 1 },
    { name: 'image_2', maxCount: 1 },
    { name: 'image_3', maxCount: 1 }
]);

// Public routes - anyone can view games
router.get('/', listAll);
router.get('/:id', getById);

// Protected routes - only authenticated admins can modify
router.post('/', 
    authenticateToken,
    gameUpload,
    create
);

router.put('/:id', 
    authenticateToken,
    gameUpload,
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