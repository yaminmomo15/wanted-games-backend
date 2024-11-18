const AdminModel = require('../models/adminModel');
const jwt = require('jsonwebtoken');

class AdminController {
    static async register(req, res) {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }

            const existingAdmin = await AdminModel.findByUsername(username);
            if (existingAdmin) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            await AdminModel.create(username, password);
            res.status(201).json({ message: 'Admin created successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;
            
            const admin = await AdminModel.findByUsername(username);
            if (!admin) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const validPassword = await AdminModel.validatePassword(password, admin.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const token = jwt.sign(
                { id: admin.id, username: admin.username },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = AdminController; 