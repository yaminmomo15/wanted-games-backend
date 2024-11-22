import db from '../config/db.js';

const insert = async (label, name, description_1, description_2, image_main, image_1 = null, image_2 = null, image_3 = null) => {
    return await db.runAsync(
        'INSERT INTO games (label, name, description_1, description_2, image_main, image_1, image_2, image_3) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [label, name, description_1, description_2, image_main, image_1, image_2, image_3]
    );
};

const findAll = async () => {
    return await db.allAsync('SELECT * FROM games');
};

const findByLabel = async (label) => {
    const result = await db.allAsync(
        'SELECT * FROM games WHERE label = ?',
        [label]
    );
    return result[0];
};

const  modify = async (id, label, name, description_1, description_2, image_main = null, image_1 = null, image_2 = null, image_3 = null) => {
    let sql = 'UPDATE games SET label = ?, name = ?, description_1 = ?, description_2 = ?';
    const params = [label, name, description_1, description_2];

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

const destroy = async (label) => {
    return await db.runAsync('DELETE FROM games WHERE label = ?', [label]);
};

export { insert, findAll, findByLabel, modify, destroy }; 