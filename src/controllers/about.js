import {
    insert,
    findAll,
    modify,
    destroy,
    findById,
    findLargestSortId,
    updateSortOrder
} from '../models/about.js';

const listAll = async (req, res) => {
    try {
        const aboutSections = await findAll();
        const processedSections = aboutSections.map(section => ({
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
        const { title, paragraph_1, paragraph_2, paragraph_3 } = req.body;
        const files = req.files;

        // Validation
        if (!title || !paragraph_1 || !paragraph_2 || !paragraph_3) {
            return res.status(400).json({
                error: 'Title and all text fields are required'
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
            nextSortId,
            title,
            files.image[0].buffer,
            paragraph_1,
            paragraph_2,
            paragraph_3
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
        const { title, paragraph_1, paragraph_2, paragraph_3 } = req.body;
        const files = req.files;
  
        // Validation
        if (!title || !paragraph_1 || !paragraph_2 || !paragraph_3) {
            return res.status(400).json({
                error: 'Title and all text fields are required'
            });
        }

        const about = await findById(id);
        if (!about) {
            return res.status(404).json({
                error: 'About section not found'
            });
        }

        await modify(
            about.id,
            about.sort_id,
            title,
            files?.image?.[0]?.buffer,
            paragraph_1,
            paragraph_2,
            paragraph_3
        );

        res.json({
            message: 'About section updated successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const about = await findById(id);
        if (!about) {
            return res.status(404).json({
                error: 'About section not found'
            });
        }

        await destroy(id);
        res.json({
            message: 'About section deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const about = await findById(id);

        if (!about) {
            return res.status(404).json({
                error: 'About section not found'
            });
        }

        res.json({
            ...about,
            image: about.image.toString('base64')
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
