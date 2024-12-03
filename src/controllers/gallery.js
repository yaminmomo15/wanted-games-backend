import {
    insert,
    findAll,
    findById,
    modify,
    destroy,
    findLargestSortId,
    updateSortOrder,
} from '../models/gallery.js';

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
        const item = await findById(id);
        
        if (!item) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }
        
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const imageFile = req.file;
        
        if (!imageFile) {
            return res.status(400).json({ error: 'Image is required' });
        }

        // Get the next sort_id
        const largestSortId = await findLargestSortId() || 0;
        const nextSortId = largestSortId + 1;

        const result = await insert(nextSortId, imageFile);
        res.status(201).json({ 
            message: 'Gallery item created successfully',
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
        const imageFile = req.file;
        
        if (!imageFile) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const item = await findById(id);
        if (!item) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }

        await modify(id, imageFile);
        res.json({ message: 'Gallery item updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await findById(id);
        
        if (!item) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }

        await destroy(id);
        res.json({ message: 'Gallery item deleted successfully' });
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
    getById,
    create,
    update,
    remove,
    updateSort
};