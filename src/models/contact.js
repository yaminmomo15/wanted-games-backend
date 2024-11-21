import db from '../config/db.js';

const insert = async (label, description) => {
    return await db.runAsync(
        'INSERT INTO contact (label, description) VALUES (?, ?)',
        [label, description]
    );
};

const findAll = async () => {
    return await db.allAsync('SELECT * FROM contact');
};

const findByLabel = async (label) => {
    const result = await db.allAsync(
        'SELECT * FROM contact WHERE label = ?',
        [label]
    );
    return result[0];
};

const modify = async (label, description) => {
    return await db.runAsync(
        'UPDATE contact SET description = ? WHERE label = ?',
        [description, label]
    );
};

const destroy = async (label) => {
    return await db.runAsync('DELETE FROM contact WHERE label = ?', [label]);
};

export { insert, findAll, findByLabel, modify, destroy }; 