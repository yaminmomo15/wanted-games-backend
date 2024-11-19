import db from '../config/db.js';

/**
 * Creates a new content entry in the database
 * @param {string} title - The content title
 * @param {string} body - The content body
 * @param {number} adminId - The ID of the admin creating the content
 * @returns {Promise} Database operation result
 */
const createContentModel = async (title, body, adminId) => {
    const result = await db.runAsync(
        'INSERT INTO contents (title, body, created_by) VALUES (?, ?, ?)',
        [title, body, adminId]
    );
    return result;
}

/**
 * Retrieves all content entries with author information
 * @returns {Promise<Array>} Array of content objects with author details
 */
const getAllContentModel = async () => {
    return await db.allAsync(
        'SELECT contents.*, admins.username as author FROM contents LEFT JOIN admins ON contents.created_by = admins.id ORDER BY created_at DESC'
    );
}

/**
 * Retrieves a single content entry by ID
 * @param {number} id - Content ID
 * @returns {Promise<Object>} Content object with author details
 */
const getByIdContentModel = async (id) => {
    const content = await db.allAsync(
        'SELECT contents.*, admins.username as author FROM contents LEFT JOIN admins ON contents.created_by = admins.id WHERE contents.id = ?',
        [id]
    );
    return content[0];
}

/**
 * Updates an existing content entry
 * @param {number} id - Content ID
 * @param {string} title - Updated title
 * @param {string} body - Updated body
 * @returns {Promise} Database operation result
 */
const updateContentModel = async (id, title, body) => {
    return await db.runAsync(
        'UPDATE contents SET title = ?, body = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, body, id]
    );
}

/**
 * Deletes a content entry
 * @param {number} id - Content ID to delete
 * @returns {Promise} Database operation result
 */
const deleteContentModel = async (id) => {
    return await db.runAsync('DELETE FROM contents WHERE id = ?', [id]);
}

export { createContentModel, getAllContentModel, getByIdContentModel, updateContentModel, deleteContentModel };