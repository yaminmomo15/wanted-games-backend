import db from '../config/db.js';

const createContactImg = async (label, image) => {
    return await db.runAsync(
        'INSERT INTO contact_img (label, image) VALUES (?, ?)',
        [label, image]
    );
};

const getAllContactImg = async () => {
    return await db.allAsync('SELECT * FROM contact_img');
};

const getByLabelContactImg = async (label) => {
    const result = await db.allAsync(
        'SELECT * FROM contact_img WHERE label = ?',
        [label]
    );
    return result[0];
};

const updateContactImg = async (label, image) => {
    return await db.runAsync(
        'UPDATE contact_img SET image = ? WHERE label = ?',
        [image, label]
    );
};

const deleteContactImg = async (label) => {
    return await db.runAsync('DELETE FROM contact_img WHERE label = ?', [label]);
};

export {
    createContactImg,
    getAllContactImg,
    getByLabelContactImg,
    updateContactImg,
    deleteContactImg
}; 