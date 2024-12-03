import db from '../config/db.js';
import { uploadToS3, deleteFromS3 } from '../utils/s3.js';

const insert = async (title, description_1, description_2, imageMainFile, image1File, image2File, image3File, sort_id, background_color, text_color, url = null) => {
    const imageMainUrl = await uploadToS3(imageMainFile, 'games/main');
    const image1Url = image1File ? await uploadToS3(image1File, 'games/1') : null;
    const image2Url = image2File ? await uploadToS3(image2File, 'games/2') : null;
    const image3Url = image3File ? await uploadToS3(image3File, 'games/3') : null;

    await db.runAsync(
        `INSERT INTO games (title, description_1, description_2, image_main_url, image_1_url, image_2_url, image_3_url, sort_id, background_color, text_color, url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description_1, description_2, imageMainUrl, image1Url, image2Url, image3Url, sort_id, background_color, text_color, url]
    );
    const result = await db.allAsync('SELECT id, sort_id FROM games WHERE id = (SELECT MAX(id) FROM games)');
    return result[0];
};

const findAll = async () => {
    return await db.allAsync('SELECT * FROM games ORDER BY sort_id ASC');
};

const modify = async (id, title, description_1, description_2, imageMainFile = null, image1File = null, image2File = null, image3File = null, background_color, text_color, url = null) => {
    let sql = 'UPDATE games SET title = ?, description_1 = ?, description_2 = ?, background_color = ?, text_color = ?, url = ?';
    const params = [title, description_1, description_2, background_color, text_color, url];

    const existing = await findById(id);
    if (existing) {
        if (imageMainFile) {
            await deleteFromS3(existing.image_main_url);
            const imageMainUrl = await uploadToS3(imageMainFile, 'games/main');
            sql += ', image_main_url = ?';
            params.push(imageMainUrl);
        }
        if (image1File) {
            if (existing.image_1_url) await deleteFromS3(existing.image_1_url);
            const image1Url = await uploadToS3(image1File, 'games/1');
            sql += ', image_1_url = ?';
            params.push(image1Url);
        }
        if (image2File) {
            if (existing.image_2_url) await deleteFromS3(existing.image_2_url);
            const image2Url = await uploadToS3(image2File, 'games/2');
            sql += ', image_2_url = ?';
            params.push(image2Url);
        }
        if (image3File) {
            if (existing.image_3_url) await deleteFromS3(existing.image_3_url);
            const image3Url = await uploadToS3(image3File, 'games/3');
            sql += ', image_3_url = ?';
            params.push(image3Url);
        }
    }

    sql += ' WHERE id = ?';
    params.push(id);

    return await db.runAsync(sql, params);
};

const destroy = async (id) => {
    const existing = await findById(id);
    if (existing) {
        if (existing.image_main_url) await deleteFromS3(existing.image_main_url);
        if (existing.image_1_url) await deleteFromS3(existing.image_1_url);
        if (existing.image_2_url) await deleteFromS3(existing.image_2_url);
        if (existing.image_3_url) await deleteFromS3(existing.image_3_url);
    }
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