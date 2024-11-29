import db from '../config/db.js';

const insert = async (sortId, image) => {
    return await db.runAsync(
        'INSERT INTO gallery (sort_id, image) VALUES (?, ?)',
        [sortId, image]
    );
};

const findAll = async () => {
    return await db.allAsync('SELECT * FROM gallery ORDER BY sort_id ASC');
};

const findById = async (id) => {
    const result = await db.allAsync(
        'SELECT * FROM gallery WHERE id = ?',
        [id]
    );
    return result[0];
};

const modify = async (id, image) => {
    let sql = 'UPDATE gallery SET image = ? WHERE id = ?';
    const params = [image, id];
    return await db.runAsync(sql, params);
};

const findLargestSortId = async () => {
    const result = await db.allAsync('SELECT MAX(sort_id) as maxSortId FROM gallery');
    return result[0].maxSortId;
};

const updateSortOrder = async (updates) => {
    const sql = 'UPDATE gallery SET sort_id = ? WHERE id = ?';
    
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

const destroy = async (id) => {
    return await db.runAsync('DELETE FROM gallery WHERE id = ?', [id]);
};

export { insert, findAll, findById, modify, destroy, findLargestSortId, updateSortOrder }; 