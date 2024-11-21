import jwt from 'jsonwebtoken';
import { findByUsername, validatePassword } from '../models/admin.js';

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate request body
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Username and password are required' 
            });
        }

        // Find admin by username
        const admin = await findByUsername(username);
        if (!admin) {
            return res.status(401).json({ 
                error: 'Invalid username or password' 
            });
        }

        // Validate password
        const validPassword = await validatePassword(password, admin.password);
        if (!validPassword) {
            return res.status(401).json({ 
                error: 'Invalid username or password' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: admin.id, 
                username: admin.username 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin.id,
                username: admin.username
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'An error occurred during login' 
        });
    }
};

export const profile = async (req, res) => {
    try {
        // req.admin is set by the authenticateToken middleware
        const admin = await findByUsername(req.admin.username);
        
        if (!admin) {
            return res.status(404).json({ 
                error: 'Admin not found' 
            });
        }

        res.json({
            id: admin.id,
            username: admin.username,
            created_at: admin.created_at
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Error fetching admin profile' 
        });
    }
}; 