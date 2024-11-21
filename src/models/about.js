import db from '../config/db.js';

export const createAbout = async (label, description) => {
    return await db.runAsync(
        'INSERT INTO about_us (label, description) VALUES (?, ?)',
        [label, description]
    );
};

export const getAll = async () => {
    return await db.allAsync('SELECT * FROM about_us');
};

export const getByLabel = async (label) => {
    const result = await db.allAsync(
        'SELECT * FROM about_us WHERE label = ?',
        [label]
    );
    return result[0];
};

export const updateAbout = async (label, description) => {
    return await db.runAsync(
        'UPDATE about_us SET description = ? WHERE label = ?',
        [description, label]
    );
};

export const deleteAbout = async (label) => {
    return await db.runAsync('DELETE FROM about_us WHERE label = ?', [label]);
}; 