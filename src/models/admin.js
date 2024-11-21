import db from '../config/db.js';
import bcrypt from 'bcryptjs';

/**
 * Finds an admin by their username
 * 
 * @param {string} username - The username to search for
 * @returns {Promise<Object|undefined>} Admin object if found, undefined otherwise
 */
export const findByUsername = async (username) => {
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
export const validatePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Creates a new admin
 * 
 * @param {string} username - The username of the new admin
 * @param {string} password - The password of the new admin
 * @returns {Promise<void>}
 */
export const createAdmin = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await db.runAsync(
        'INSERT INTO admins (username, password) VALUES (?, ?)',
        [username, hashedPassword]
    );
};

/**
 * Updates the password of an admin
 * 
 * @param {string} username - The username of the admin to update
 * @param {string} newPassword - The new password for the admin
 * @returns {Promise<void>}
 */
export const updatePassword = async (username, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await db.runAsync(
        'UPDATE admins SET password = ? WHERE username = ?',
        [hashedPassword, username]
    );
}; 