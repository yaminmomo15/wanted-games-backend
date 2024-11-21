import express from 'express';
import aboutRoutes from './about.js';
import adminRoutes from './admin.js';
import galleryRoutes from './gallery.js';
import gameRoutes from './game.js';
import contactRoutes from './contact.js';
import contactImageRoutes from './contact-image.js';
const router = express.Router();

router.use('/about', aboutRoutes);
router.use('/admin', adminRoutes);
router.use('/gallery', galleryRoutes);
router.use('/games', gameRoutes);
router.use('/contact', contactRoutes);
router.use('/contact-image', contactImageRoutes);


export default router; 