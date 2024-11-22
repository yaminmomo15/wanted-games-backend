import db from '../config/db.js';

const insert = async (label, image) => {
    return await db.runAsync(
        'INSERT INTO contact_image (label, image) VALUES (?, ?)',
        [label, image]
    );
};

const findAll = async () => {
    return await db.allAsync('SELECT * FROM contact_image');
};

const findByLabel = async (label) => {
    const result = await db.allAsync(
        'SELECT * FROM contact_image WHERE label = ?',
        [label]
    );
    return result[0];
};

const modify = async (id, label, image) => {
    return await db.runAsync(
        'UPDATE contact_image SET label = ?, image = ? WHERE id = ?',
        [label, image, id]
    );
};

const destroy = async (label) => {
    return await db.runAsync('DELETE FROM contact_image WHERE label = ?', [label]);
};

export { insert, findAll, findByLabel, modify, destroy }; 