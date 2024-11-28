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
        const processedSections = sections.map(section => ({
            ...section,
            image: section.image.toString('base64')
        }));
        res.json(processedSections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { header, paragraph_1, paragraph_2, action } = req.body;
        const files = req.files;

        // Validation
        if (!header) {
            return res.status(400).json({
                error: 'Header is required'
            });
        }

        if (!files?.image) {
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
            files.image[0].buffer,
            nextSortId
        );
        
        res.status(201).json({
            sort_id: result.sort_id,
            id: result.id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { header, paragraph_1, paragraph_2, action } = req.body;
        const files = req.files;

        // Validation
        if (!header) {
            return res.status(400).json({
                error: 'Header is required'
            });
        }

        const section = await findById(id);
        if (!section) {
            return res.status(404).json({
                error: 'Section not found'
            });
        }

        await modify(
            section.id,
            header,
            paragraph_1,
            paragraph_2,
            action,
            files?.image?.[0]?.buffer
        );

        res.json({
            message: 'Section updated successfully'
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

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const section = await findById(id);

        if (!section) {
            return res.status(404).json({
                error: 'Section not found'
            });
        }

        res.json({
            ...section,
            image: section.image.toString('base64')
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
