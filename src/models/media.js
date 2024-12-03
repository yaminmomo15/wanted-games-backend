import db from '../config/db.js';
import { uploadToS3, deleteFromS3 } from '../utils/s3.js';

const insert = async (label, imageFile) => {
    const imageUrl = await uploadToS3(imageFile, 'media');
    return await db.runAsync(
        'INSERT INTO media (label, image_url) VALUES (?, ?)',
        [label, imageUrl]
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

const modify = async (id, label, imageFile) => {
    // Get existing record to delete old image
    const existing = await findById(id);
    if (existing) {
        await deleteFromS3(existing.image_url);
    }

    const imageUrl = await uploadToS3(imageFile, 'media');
    return await db.runAsync(
        'UPDATE media SET label = ?, image_url = ? WHERE id = ?',
        [label, imageUrl, id]
    );
};

const destroy = async (label) => {
    const existing = await findByLabel(label);
    if (existing) {
        await deleteFromS3(existing.image_url);
    }
    return await db.runAsync('DELETE FROM media WHERE label = ?', [label]);
};

export { insert, findAll, findByLabel, findById, modify, destroy }; 