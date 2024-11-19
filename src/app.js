import express from 'express';
import adminRoutes from './routes/adminRoutes.js';
import contentRoutes from './routes/contentRoutes.js';

const app = express();

// Configure middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register route handlers
// Admin routes handle authentication and admin-related operations
app.use('/api/admin', adminRoutes);
// Content routes handle CRUD operations for content management
app.use('/api/content', contentRoutes);

/**
 * Global error handling middleware
 * Catches all unhandled errors and returns a 500 response
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

export default app; 