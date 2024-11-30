import db from '../config/db.js';

const insert = async (title, description_1, description_2, image_main, image_1, image_2, image_3, sort_id, background_color, text_color, url = null) => {
    await db.runAsync(
        `INSERT INTO games (title, description_1, description_2, image_main, image_1, image_2, image_3, sort_id, background_color, text_color, url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description_1, description_2, image_main, image_1, image_2, image_3, sort_id, background_color, text_color, url]
    );
    const result = await db.allAsync('SELECT id, sort_id FROM games WHERE id = (SELECT MAX(id) FROM games)');
    return result[0];
};

const findAll = async () => {
    return await db.allAsync('SELECT * FROM games ORDER BY sort_id ASC');
};

const  modify = async (id, title, description_1, description_2, image_main = null, image_1 = null, image_2 = null, image_3 = null, background_color, text_color, url = null) => {
    let sql = 'UPDATE games SET title = ?, description_1 = ?, description_2 = ?, background_color = ?, text_color = ?, url = ?';
    const params = [title, description_1, description_2, background_color, text_color, url];

    if (image_main) {
        sql += ', image_main = ?';
        params.push(image_main);
    }
    if (image_1) {
        sql += ', image_1 = ?';
        params.push(image_1);
    }
    if (image_2) {
        sql += ', image_2 = ?';
        params.push(image_2);
    }
    if (image_3) {
        sql += ', image_3 = ?';
        params.push(image_3);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    return await db.runAsync(sql, params);
};

const destroy = async (id) => {
    return await db.runAsync('DELETE FROM games WHERE id = ?', [id]);
};

const findById = async (id) => {
    try {
        const game = await db.allAsync(
            `SELECT * FROM games WHERE id = ?`,
            [id]
        );
        return game[0];
    } catch (error) {
        throw new Error(`Error finding game by ID: ${error.message}`);
    }
};

const findLargestSortId = async () => {
    const result = await db.allAsync('SELECT MAX(sort_id) as maxSortId FROM games');
    return result[0].maxSortId;
};

const updateSortOrder = async (updates) => {
    const sql = 'UPDATE games SET sort_id = ? WHERE id = ?';
    
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