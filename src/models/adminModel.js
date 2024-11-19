import db from '../config/db.js';
import bcrypt from 'bcryptjs';

const findByUsernameAdminModel = async (username) => {
    const admin = await db.allAsync(
        'SELECT * FROM admins WHERE username = ?',
        [username]
    );
    return admin[0];
};

const validatePasswordAdminModel = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

export { findByUsernameAdminModel, validatePasswordAdminModel }; 