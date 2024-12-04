import jwt from 'jsonwebtoken';
import { findByUsername, validate } from '../models/admin.js';

const create = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // check if username is a valid string, number, dash, or underscore using regex
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return res.status(400).json({ 
                error: 'Invalid username' 
            });
        }

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
        const validPassword = await validate(password, admin.password);
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

const getByUsername = async (req, res) => {
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

export { create, getByUsername };