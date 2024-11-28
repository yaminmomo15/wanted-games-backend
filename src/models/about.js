import db from '../config/db.js';

const insert = async (sort_id, title, image, paragraph_1, paragraph_2, paragraph_3) => {
    await db.runAsync(
        `INSERT INTO about (title, image, paragraph_1, paragraph_2, paragraph_3, sort_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, image, paragraph_1, paragraph_2, paragraph_3, sort_id]
    );
    const result = await db.allAsync('SELECT id, sort_id FROM about WHERE id = (SELECT MAX(id) FROM about)');
    return result[0];
};

const findAll = async () => {
    return await db.allAsync('SELECT * FROM about ORDER BY sort_id ASC');
};

const modify = async (id, sort_id, title, image = null, paragraph_1, paragraph_2, paragraph_3) => {
    let sql = 'UPDATE about SET title = ?, paragraph_1 = ?, paragraph_2 = ?, paragraph_3 = ?, sort_id = ?';
    const params = [title, paragraph_1, paragraph_2, paragraph_3, sort_id];

    if (image) {
        sql += ', image = ?';
        params.push(image);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    return await db.runAsync(sql, params);
};

const destroy = async (id) => {
    return await db.runAsync('DELETE FROM about WHERE id = ?', [id]);
};

const findById = async (id) => {
    try {
        const about = await db.allAsync(
            `SELECT * FROM about WHERE id = ?`,
            [id]
        );
        return about[0];
    } catch (error) {
        throw new Error(`Error finding about section by ID: ${error.message}`);
    }
};

const findLargestSortId = async () => {
    const result = await db.allAsync('SELECT MAX(sort_id) as maxSortId FROM about');
    return result[0].maxSortId;
};

const updateSortOrder = async (updates) => {
    const sql = 'UPDATE about SET sort_id = ? WHERE id = ?';
    
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
