import { findByUsernameAdminModel, validatePasswordAdminModel } from '../models/adminModel.js';
import jwt from 'jsonwebtoken';

const loginAdminController = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const admin = await findByUsernameAdminModel(username);
        if (!admin) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const validPassword = await validatePasswordAdminModel(password, admin.password);
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
};

export default loginAdminController; 