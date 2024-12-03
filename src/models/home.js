import db from '../config/db.js';
import { uploadToS3, deleteFromS3 } from '../utils/s3.js';

const insert = async (header, paragraph_1, paragraph_2, action, imageFile, sort_id) => {
    const imageUrl = await uploadToS3(imageFile, 'home');
    await db.runAsync(
        `INSERT INTO home (header, paragraph_1, paragraph_2, action, image_url, sort_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [header, paragraph_1, paragraph_2, action, imageUrl, sort_id]
    );
    const result = await db.allAsync('SELECT id, sort_id FROM home WHERE id = (SELECT MAX(id) FROM home)');
    return result[0];
};

const findAll = async () => {
    return await db.allAsync('SELECT * FROM home ORDER BY sort_id ASC');
};

const modify = async (id, header, paragraph_1, paragraph_2, action, imageFile = null) => {
    let sql = 'UPDATE home SET header = ?, paragraph_1 = ?, paragraph_2 = ?, action = ?';
    const params = [header, paragraph_1, paragraph_2, action];

    if (imageFile) {
        // Get existing record to delete old image
        const existing = await findById(id);
        if (existing) {
            await deleteFromS3(existing.image_url);
        }
        const imageUrl = await uploadToS3(imageFile, 'home');
        sql += ', image_url = ?';
        params.push(imageUrl);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    return await db.runAsync(sql, params);
};

const destroy = async (id) => {
    const existing = await findById(id);
    if (existing) {
        await deleteFromS3(existing.image_url);
    }
    return await db.runAsync('DELETE FROM home WHERE id = ?', [id]);
};

const findById = async (id) => {
    try {
        const section = await db.allAsync(
            `SELECT * FROM home WHERE id = ?`,
            [id]
        );
        return section[0];
    } catch (error) {
        throw new Error(`Error finding home section by ID: ${error.message}`);
    }
};

const findLargestSortId = async () => {
    const result = await db.allAsync('SELECT MAX(sort_id) as maxSortId FROM home');
    return result[0].maxSortId;
};

const updateSortOrder = async (updates) => {
    const sql = 'UPDATE home SET sort_id = ? WHERE id = ?';
    
    // Use a transaction to ensure all updates succeed or none do
    await db.runAsync('BEGIN TRANSACTION');
    try {
        for (const update of updates) {
            await db.runAsync(sql, [update.sort_id, update.id]);
        }
        await db.runAsync('COMMIT');
    } catch (error) {
        await db.runAsync('ROLLBACK');
        throw error;
    }
};

export { insert, findAll, modify, destroy, findById, findLargestSortId, updateSortOrder };
