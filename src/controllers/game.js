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
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { 
            title, 
            description_1, 
            description_2, 
            background_color, 
            text_color,
            url 
        } = req.body;
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
            files.image_main[0],
            files?.image_1?.[0],
            files?.image_2?.[0],
            files?.image_3?.[0],
            nextSortId,
            background_color,
            text_color,
            url
        );

        res.status(201).json({
            message: 'Game created successfully',
            id: result.id,
            sort_id: result.sort_id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            title, 
            description_1, 
            description_2, 
            background_color, 
            text_color,
            url 
        } = req.body;
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
            id,
            title,
            description_1,
            description_2,
            files?.image_main?.[0],
            files?.image_1?.[0],
            files?.image_2?.[0],
            files?.image_3?.[0],
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

        res.json(game);
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