import db from '../config/db.js';

const createContentModel = async (title, body, adminId) => {
    const result = await db.runAsync(
        'INSERT INTO contents (title, body, created_by) VALUES (?, ?, ?)',
        [title, body, adminId]
    );
    return result;
}

const getAllContentModel = async () => {
    return await db.allAsync(
        'SELECT contents.*, admins.username as author FROM contents LEFT JOIN admins ON contents.created_by = admins.id ORDER BY created_at DESC'
    );
}

const getByIdContentModel = async (id) => {
    const content = await db.allAsync(
        'SELECT contents.*, admins.username as author FROM contents LEFT JOIN admins ON contents.created_by = admins.id WHERE contents.id = ?',
        [id]
    );
    return content[0];
}

const updateContentModel = async (id, title, body) => {
    return await db.runAsync(
        'UPDATE contents SET title = ?, body = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, body, id]
    );
}

const deleteContentModel = async (id) => {
    return await db.runAsync('DELETE FROM contents WHERE id = ?', [id]);
} 

export { createContentModel, getAllContentModel, getByIdContentModel, updateContentModel, deleteContentModel };