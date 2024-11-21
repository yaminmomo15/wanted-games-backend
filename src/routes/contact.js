import express from 'express';
import { getAll, getByLabel, create, update, remove } from '../controllers/contact.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:label', getByLabel);
router.post('/', authenticateToken, create);
router.put('/:label', authenticateToken, update);
router.delete('/:label', authenticateToken, remove);

export default router; 