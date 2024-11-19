import express from 'express';
import loginAdminController from '../controllers/adminController.js';

const router = express.Router();

/**
 * POST /api/admin/login
 * Handles admin authentication
 * Expects username and password in request body
 * Returns JWT token on successful authentication
 */
router.post('/login', loginAdminController);

export default router; 