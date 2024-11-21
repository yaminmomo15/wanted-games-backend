import db from '../config/db.js';

const insert = async (label, description) => {
    return await db.runAsync(
        'INSERT INTO about_us (label, description) VALUES (?, ?)',
        [label, description]
    );
};

const findAll = async () => {
    return await db.allAsync('SELECT * FROM about_us');
};

const findByLabel = async (label) => {
    const result = await db.allAsync(
        'SELECT * FROM about_us WHERE label = ?',
        [label]
    );
    return result[0];
};

const modify = async (label, description) => {
    return await db.runAsync(
        'UPDATE about_us SET description = ? WHERE label = ?',
        [description, label]
    );
};

const destroy = async (label) => {
    return await db.runAsync('DELETE FROM about_us WHERE label = ?', [label]);
}; 

export { insert, findAll, findByLabel, modify, destroy };