import {
    insert,
    findAll,
    modify,
    destroy,
    findById,
    findLargestSortId,
    updateSortOrder
} from '../models/game.js';

const listAll = async (req, res) => {
    try {
        const games = await findAll();
        const processedGames = games.map(game => ({
            ...game,
            image_main: game.image_main.toString('base64'),
            image_1: game.image_1?.toString('base64'),
            image_2: game.image_2?.toString('base64'),
            image_3: game.image_3?.toString('base64')
        }));
        res.json(processedGames);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const create = async (req, res) => {
    try {
        const { title, description_1, description_2, background_color, text_color, url } = req.body;
        const files = req.files;

        // Validation
        if (!title || !description_1 || !description_2 || !background_color || !text_color) {
            return res.status(400).json({
                error: 'Title, description_1, description_2, background_color, and text_color are required'
            });
        }

        if (!files?.image_main) {
            return res.status(400).json({
                error: 'Main image is required'
            });
        }

        // Get the next sort_id
        const largestSortId = await findLargestSortId() || 0;
        const nextSortId = largestSortId + 1;

        const result = await insert(
            title,
            description_1,
            description_2,
            files.image_main[0].buffer,
            files.image_1?.[0]?.buffer,
            files.image_2?.[0]?.buffer,
            files.image_3?.[0]?.buffer,
            nextSortId,
            background_color,
            text_color,
            url
        );
        
        res.status(201).json({
            sort_id: result.sort_id,
            id: result.id
        });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({
                error: error.message
            });
        }
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description_1, description_2, background_color, text_color, url } = req.body;
        const files = req.files;
  
        // Validation
        if (!title || !description_1 || !description_2 || !background_color || !text_color) {
            return res.status(400).json({
                error: 'Title, description_1, description_2, background_color, and text_color are required'
            });
        }

        const game = await findById(id);
        if (!game) {
            return res.status(404).json({
                error: 'Game not found'
            });
        }

        await modify(
            game.id,
            title,
            description_1,
            description_2,
            files?.image_main?.[0]?.buffer,
            files?.image_1?.[0]?.buffer,
            files?.image_2?.[0]?.buffer,
            files?.image_3?.[0]?.buffer,
            background_color,
            text_color,
            url
        );

        res.json({
            message: 'Game updated successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const game = await findById(id);
        if (!game) {
            return res.status(404).json({
                error: 'Game not found'
            });
        }

        await destroy(id);
        res.json({
            message: 'Game deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const game = await findById(id);

        if (!game) {
            return res.status(404).json({
                error: 'Game not found'
            });
        }

        res.json({
            ...game,
            image_main: game.image_main.toString('base64'),
            image_1: game.image_1?.toString('base64'),
            image_2: game.image_2?.toString('base64'),
            image_3: game.image_3?.toString('base64')
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSort = async (req, res) => {
    try {
        const updates = req.body;
        
        
        // Validate the input
        if (!Array.isArray(updates)) {
            return res.status(400).json({
                error: 'Request body must be an array'
            });
        }

        if (!updates.every(item => item.id && typeof item.sort_id === 'number')) {
            return res.status(400).json({
                error: 'Each item must have id and sort_id properties'
            });
        }

        await updateSortOrder(updates);
        res.json({ message: 'Sort order updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    listAll,
    create,
    update,
    remove,
    getById,
    updateSort
};