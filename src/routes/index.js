import express from 'express';
import aboutRoutes from './about.js';
import adminRoutes from './admin.js';
import galleryRoutes from './gallery.js';
import gameRoutes from './game.js';
import contactRoutes from './contact.js';
import contactImageRoutes from './contact-image.js';
import socialRoutes from './social.js';
import phoneRoutes from './phone.js';

const router = express.Router();

// API Routes
router.use('/about', aboutRoutes);
router.use('/admin', adminRoutes);
router.use('/gallery', galleryRoutes);
router.use('/games', gameRoutes);
router.use('/contact', contactRoutes);
router.use('/contact-image', contactImageRoutes);
router.use('/social', socialRoutes);
router.use('/phone', phoneRoutes);

export default router; 