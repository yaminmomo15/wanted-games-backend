import {
    insert,
    findAll,
    modify,
    destroy,
    findById,
    findLargestSortId,
    updateSortOrder
} from '../models/phone.js';

const listAll = async (req, res) => {
    try {
        const phoneNumbers = await findAll();
        const processedNumbers = phoneNumbers.map(phone => ({
            ...phone,
            image: phone.image.toString('base64')
        }));
        res.json(processedNumbers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { number } = req.body;
        const files = req.files;

        // Validation
        if (!number) {
            return res.status(400).json({
                error: 'Phone number is required'
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
            files.image[0].buffer,
            number,
            nextSortId
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
        const { number } = req.body;
        const files = req.files;
  
        // Validation
        if (!number) {
            return res.status(400).json({
                error: 'Phone number is required'
            });
        }

        const phone = await findById(id);
        if (!phone) {
            return res.status(404).json({
                error: 'Phone number not found'
            });
        }

        await modify(
            phone.id,
            files?.image?.[0]?.buffer,
            number,
            phone.sort_id
        );

        res.json({
            message: 'Phone number updated successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const phone = await findById(id);
        if (!phone) {
            return res.status(404).json({
                error: 'Phone number not found'
            });
        }

        await destroy(id);
        res.json({
            message: 'Phone number deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const phone = await findById(id);

        if (!phone) {
            return res.status(404).json({
                error: 'Phone number not found'
            });
        }

        res.json({
            ...phone,
            image: phone.image.toString('base64')
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
