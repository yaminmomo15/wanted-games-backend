import db from '../config/db.js';

const createContact = async (label, description) => {
    return await db.runAsync(
        'INSERT INTO contact (label, description) VALUES (?, ?)',
        [label, description]
    );
};

const getAllContact = async () => {
    return await db.allAsync('SELECT * FROM contact');
};

const getByLabelContact = async (label) => {
    const result = await db.allAsync(
        'SELECT * FROM contact WHERE label = ?',
        [label]
    );
    return result[0];
};

const updateContact = async (label, description) => {
    return await db.runAsync(
        'UPDATE contact SET description = ? WHERE label = ?',
        [description, label]
    );
};

const deleteContact = async (label) => {
    return await db.runAsync('DELETE FROM contact WHERE label = ?', [label]);
};

export {
    createContact,
    getAllContact,
    getByLabelContact,
    updateContact,
    deleteContact,
}; 