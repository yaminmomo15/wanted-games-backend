import {
    insert,
    findAll,
    modify,
    destroy,
    findById,
    findLargestSortId,
    updateSortOrder
} from '../models/home.js';

const listAll = async (req, res) => {
    try {
        const sections = await findAll();
        res.json(sections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const section = await findById(id);
        
        if (!section) {
            return res.status(404).json({
                error: 'Home section not found'
            });
        }
        
        res.json(section);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { header, paragraph_1, paragraph_2, action } = req.body;
        const imageFile = req.files?.image?.[0];

        if (!header) {
            return res.status(400).json({
                error: 'Header is required'
            });
        }

        if (!imageFile) {
            return res.status(400).json({
                error: 'Image is required'
            });
        }

        // Get the next sort_id
        const largestSortId = await findLargestSortId() || 0;
        const nextSortId = largestSortId + 1;

        const result = await insert(
            header,
            paragraph_1,
            paragraph_2,
            action,
            imageFile,
            nextSortId
        );

        res.status(201).json({
            message: 'Home section created successfully',
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
        const { header, paragraph_1, paragraph_2, action } = req.body;
        const imageFile = req.files?.image?.[0];

        if (!header) {
            return res.status(400).json({
                error: 'Header is required'
            });
        }

        const section = await findById(id);
        if (!section) {
            return res.status(404).json({
                error: 'Home section not found'
            });
        }

        await modify(
            section.id,
            header,
            paragraph_1,
            paragraph_2,
            action,
            imageFile
        );

        res.json({
            message: 'Home section updated successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const section = await findById(id);
        if (!section) {
            return res.status(404).json({
                error: 'Section not found'
            });
        }

        await destroy(id);
        res.json({
            message: 'Section deleted successfully'
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
