const db = require('../config/db');

class ContentModel {
    static async create(title, body, adminId) {
        const result = await db.runAsync(
            'INSERT INTO contents (title, body, created_by) VALUES (?, ?, ?)',
            [title, body, adminId]
        );
        return result;
    }

    static async getAll() {
        return await db.allAsync(
            'SELECT contents.*, admins.username as author FROM contents LEFT JOIN admins ON contents.created_by = admins.id ORDER BY created_at DESC'
        );
    }

    static async getById(id) {
        const content = await db.allAsync(
            'SELECT contents.*, admins.username as author FROM contents LEFT JOIN admins ON contents.created_by = admins.id WHERE contents.id = ?',
            [id]
        );
        return content[0];
    }

    static async update(id, title, body) {
        return await db.runAsync(
            'UPDATE contents SET title = ?, body = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [title, body, id]
        );
    }

    static async delete(id) {
        return await db.runAsync('DELETE FROM contents WHERE id = ?', [id]);
    }
}

module.exports = ContentModel; 