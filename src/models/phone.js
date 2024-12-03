import db from '../config/db.js';
import { uploadToS3, deleteFromS3 } from '../utils/s3.js';

const insert = async (imageFile, number, sort_id) => {
    const imageUrl = await uploadToS3(imageFile, 'phone');
    await db.runAsync(
        `INSERT INTO phone (image_url, number, sort_id)
         VALUES (?, ?, ?)`,
        [imageUrl, number, sort_id]
    );
    const result = await db.allAsync('SELECT id, sort_id FROM phone WHERE id = (SELECT MAX(id) FROM phone)');
    return result[0];
};

const findAll = async () => {
    return await db.allAsync('SELECT * FROM phone ORDER BY sort_id ASC');
};

const modify = async (id, imageFile = null, number, sort_id) => {
    let sql = 'UPDATE phone SET number = ?, sort_id = ?';
    const params = [number, sort_id];

    if (imageFile) {
        // Get existing record to delete old image
        const existing = await findById(id);
        if (existing) {
            await deleteFromS3(existing.image_url);
        }
        const imageUrl = await uploadToS3(imageFile, 'phone');
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
    return await db.runAsync('DELETE FROM phone WHERE id = ?', [id]);
};

const findById = async (id) => {
    try {
        const phone = await db.allAsync(
            `SELECT * FROM phone WHERE id = ?`,
            [id]
        );
        return phone[0];
    } catch (error) {
        throw new Error(`Error finding phone number by ID: ${error.message}`);
    }
};

const findLargestSortId = async () => {
    const result = await db.allAsync('SELECT MAX(sort_id) as maxSortId FROM phone');
    return result[0].maxSortId;
};

const updateSortOrder = async (updates) => {
    const sql = 'UPDATE phone SET sort_id = ? WHERE id = ?';
    
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

export { 
    insert, 
    findAll, 
    modify, 
    destroy, 
    findById, 
    findLargestSortId, 
    updateSortOrder 
};
