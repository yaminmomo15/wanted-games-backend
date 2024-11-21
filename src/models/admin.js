import db from '../config/db.js';
import bcrypt from 'bcryptjs';

/**
 * Finds an admin by their username
 */
const findByUsername = async (username) => {
    const admin = await db.allAsync(
        'SELECT * FROM admins WHERE username = ?',
        [username]
    );
    return admin[0];
};

/**
 * Validates a password against its hashed version
 */
const validate = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Creates a new admin
 */
const insert = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await db.runAsync(
        'INSERT INTO admins (username, password) VALUES (?, ?)',
        [username, hashedPassword]
    );
};

/**
 * Updates the password of an admin
 */
const modify = async (username, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await db.runAsync(
        'UPDATE admins SET password = ? WHERE username = ?',
        [hashedPassword, username]
    );
}; 

export { findByUsername, validate, insert, modify };