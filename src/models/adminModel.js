const db = require('../config/db');
const bcrypt = require('bcryptjs');

class AdminModel {
    static async create(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.runAsync(
            'INSERT INTO admins (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        return result;
    }

    static async findByUsername(username) {
        const admin = await db.allAsync(
            'SELECT * FROM admins WHERE username = ?',
            [username]
        );
        return admin[0];
    }

    static async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = AdminModel; 