import db from '../config/db.js';

const insert = async (label, image) => {
    return await db.runAsync(
        'INSERT INTO media (label, image) VALUES (?, ?)',
        [label, image]
    );
};

const findAll = async () => {
    return await db.allAsync('SELECT * FROM media');
};

const findByLabel = async (label) => {
    const result = await db.allAsync(
        'SELECT * FROM media WHERE label = ?',
        [label]
    );
    return result[0];
};

const findById = async (id) => {
    const result = await db.allAsync(
        'SELECT * FROM media WHERE id = ?',
        [id]
    );
    return result[0];
};

const modify = async (id, label, image) => {
    return await db.runAsync(
        'UPDATE media SET label = ?, image = ? WHERE id = ?',
        [label, image, id]
    );
};

const destroy = async (label) => {
    return await db.runAsync('DELETE FROM media WHERE label = ?', [label]);
};

export { insert, findAll, findByLabel, findById, modify, destroy }; 