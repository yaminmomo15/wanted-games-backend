import jwt from 'jsonwebtoken';
import { findByUsernameAdminModel, validatePasswordAdminModel } from '../models/adminModel.js';

/**
 * Admin login controller
 * Authenticates admin credentials and generates JWT token
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.username - Admin username
 * @param {string} req.body.password - Admin password
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with token or error message
 */
const loginAdminController = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate request body
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Username and password are required' 
            });
        }

        // Find admin by username
        const admin = await findByUsernameAdminModel(username);
        if (!admin) {
            return res.status(401).json({ 
                error: 'Invalid username or password' 
            });
        }

        // Validate password
        const validPassword = await validatePasswordAdminModel(
            password, 
            admin.password
        );
        if (!validPassword) {
            return res.status(401).json({ 
                error: 'Invalid username or password' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Token expires in 24 hours
        );

        // Return success response with token
        res.json({
            message: 'Login successful',
            token: token,
            admin: {
                id: admin.id,
                username: admin.username
            }
        });
    } catch (error) {
        // Handle unexpected errors
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'An error occurred during login' 
        });
    }
};

export default loginAdminController; 