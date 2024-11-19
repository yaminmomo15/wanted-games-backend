import db from '../config/db.js';
import bcrypt from 'bcryptjs';

/**
 * Finds an admin by their username
 * 
 * @param {string} username - The username to search for
 * @returns {Promise<Object|undefined>} Admin object if found, undefined otherwise
 */
const findByUsernameAdminModel = async (username) => {
    const admin = await db.allAsync(
        'SELECT * FROM admins WHERE username = ?',
        [username]
    );
    return admin[0];
};

/**
 * Validates a password against its hashed version
 * 
 * @param {string} plainPassword - The password to validate
 * @param {string} hashedPassword - The stored hashed password
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
const validatePasswordAdminModel = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

export { findByUsernameAdminModel, validatePasswordAdminModel }; 