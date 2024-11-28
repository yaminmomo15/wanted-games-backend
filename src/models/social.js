import db from '../config/db.js';

const insert = async (image, url, sort_id) => {
    await db.runAsync(
        `INSERT INTO social (image, url, sort_id)
         VALUES (?, ?, ?)`,
        [image, url, sort_id]
    );
    const result = await db.allAsync('SELECT id, sort_id FROM social WHERE id = (SELECT MAX(id) FROM social)');
    return result[0];
};

const findAll = async () => {
    return await db.allAsync('SELECT * FROM social ORDER BY sort_id ASC');
};

const modify = async (id, image = null, url, sort_id) => {
    let sql = 'UPDATE social SET url = ?, sort_id = ?';
    const params = [url, sort_id];

    if (image) {
        sql += ', image = ?';
        params.push(image);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    return await db.runAsync(sql, params);
};

const destroy = async (id) => {
    return await db.runAsync('DELETE FROM social WHERE id = ?', [id]);
};

const findById = async (id) => {
    try {
        const social = await db.allAsync(
            `SELECT * FROM social WHERE id = ?`,
            [id]
        );
        return social[0];
    } catch (error) {
        throw new Error(`Error finding social link by ID: ${error.message}`);
    }
};

const findLargestSortId = async () => {
    const result = await db.allAsync('SELECT MAX(sort_id) as maxSortId FROM social');
    return result[0].maxSortId;
};

const updateSortOrder = async (updates) => {
    const sql = 'UPDATE social SET sort_id = ? WHERE id = ?';
    
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
