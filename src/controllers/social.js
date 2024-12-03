import {
    insert,
    findAll,
    modify,
    destroy,
    findById,
    findLargestSortId,
    updateSortOrder
} from '../models/social.js';

const listAll = async (req, res) => {
    try {
        const items = await findAll();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const social = await findById(id);
        
        if (!social) {
            return res.status(404).json({
                error: 'Social media link not found'
            });
        }
        
        res.json(social);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { url } = req.body;
        const imageFile = req.files?.image?.[0];

        if (!url) {
            return res.status(400).json({
                error: 'URL is required'
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

        const result = await insert(imageFile, url, nextSortId);

        res.status(201).json({
            message: 'Social media link created successfully',
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
        const { url } = req.body;
        const imageFile = req.files?.image?.[0];
  
        if (!url) {
            return res.status(400).json({
                error: 'URL is required'
            });
        }

        const social = await findById(id);
        if (!social) {
            return res.status(404).json({
                error: 'Social media link not found'
            });
        }

        await modify(
            social.id,
            imageFile,
            url,
            social.sort_id
        );

        res.json({
            message: 'Social media link updated successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const social = await findById(id);
        if (!social) {
            return res.status(404).json({
                error: 'Social media link not found'
            });
        }

        await destroy(id);
        res.json({
            message: 'Social media link deleted successfully'
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
