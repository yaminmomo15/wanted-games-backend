import db from '../config/db.js';

const insert = async (address) => {
    await db.runAsync(
        `INSERT INTO email (address)
         VALUES (?)`,
        [address]
    );
    const result = await db.allAsync('SELECT id FROM email WHERE id = (SELECT MAX(id) FROM email)');
    return result[0];
};

const findAll = async () => {
    return await db.allAsync('SELECT * FROM email');
};

const modify = async (id, address) => {
    return await db.runAsync(
        'UPDATE email SET address = ? WHERE id = ?',
        [address, id]
    );
};

const destroy = async (id) => {
    return await db.runAsync('DELETE FROM email WHERE id = ?', [id]);
};

const findById = async (id) => {
    try {
        const email = await db.allAsync(
            `SELECT * FROM email WHERE id = ?`,
            [id]
        );
        return email[0];
    } catch (error) {
        throw new Error(`Error finding email by ID: ${error.message}`);
    }
};

export { 
    insert, 
    findAll, 
    modify, 
    destroy, 
    findById
};
