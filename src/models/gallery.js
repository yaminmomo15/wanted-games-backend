import db from '../config/db.js';

const createGallery = async (label, image) => {
    return await db.runAsync(
        'INSERT INTO gallery (label, image) VALUES (?, ?)',
        [label, image]
    );
};

const getAllGallery = async () => {
    return await db.allAsync('SELECT * FROM gallery');
};

const getByLabelGallery = async (label) => {
    const result = await db.allAsync(
        'SELECT * FROM gallery WHERE label = ?',
        [label]
    );
    return result[0];
};

const updateGallery = async (label, image) => {
    return await db.runAsync(
        'UPDATE gallery SET image = ? WHERE label = ?',
        [image, label]
    );
};

const deleteGallery = async (label) => {
    return await db.runAsync('DELETE FROM gallery WHERE label = ?', [label]);
};

export {
    createGallery,
    getAllGallery,
    getByLabelGallery,
    updateGallery,
    deleteGallery
}; 