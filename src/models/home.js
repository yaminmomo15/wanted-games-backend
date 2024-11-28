import db from '../config/db.js';

const insert = async (header, paragraph_1, paragraph_2, action, image, sort_id) => {
    await db.runAsync(
        `INSERT INTO home (header, paragraph_1, paragraph_2, action, image, sort_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [header, paragraph_1, paragraph_2, action, image, sort_id]
    );
    const result = await db.allAsync('SELECT id, sort_id FROM home WHERE id = (SELECT MAX(id) FROM home)');
    return result[0];
};

const findAll = async () => {
    return await db.allAsync('SELECT * FROM home ORDER BY sort_id ASC');
};

const modify = async (id, header, paragraph_1, paragraph_2, action, image = null) => {
    let sql = 'UPDATE home SET header = ?, paragraph_1 = ?, paragraph_2 = ?, action = ?';
    const params = [header, paragraph_1, paragraph_2, action];

    if (image) {
        sql += ', image = ?';
        params.push(image);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    return await db.runAsync(sql, params);
};

const destroy = async (id) => {
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
