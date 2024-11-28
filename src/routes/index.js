import express from 'express';
import aboutRoutes from './about.js';
import adminRoutes from './admin.js';
import galleryRoutes from './gallery.js';
import gameRoutes from './game.js';
import emailRoutes from './email.js';
import mediaRoutes from './media.js';
import socialRoutes from './social.js';
import phoneRoutes from './phone.js';
import homeRoutes from './home.js';
const router = express.Router();

// API Routes
router.use('/about', aboutRoutes);
router.use('/admin', adminRoutes);
router.use('/gallery', galleryRoutes);
router.use('/games', gameRoutes);
router.use('/email', emailRoutes);
router.use('/media', mediaRoutes);
router.use('/social', socialRoutes);
router.use('/phone', phoneRoutes);
router.use('/home', homeRoutes);
export default router; 