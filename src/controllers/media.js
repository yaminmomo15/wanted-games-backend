import {
    insert,
    findAll,
    findByLabel,
    findById,
    modify,
    destroy
} from '../models/media.js';

const listAll = async (req, res) => {
    try {
        const items = await findAll();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByLabel = async (req, res) => {
    try {
        const { q: label } = req.query;
        const item = await findByLabel(label);
        
        if (!item) {
            return res.status(404).json({ error: 'Contact image not found' });
        }
        
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await findById(id);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { label } = req.body;
        const imageFile = req.file;
        
        if (!imageFile) {
            return res.status(400).json({ error: 'Image is required' });
        }

        if (!label) {
            return res.status(400).json({ error: 'Label is required' });
        }

        const result = await insert(label, imageFile);
        res.status(201).json({ 
            message: 'Contact image created successfully',
            id: result.lastID
        });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Label must be unique' });
        }
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { q: label } = req.query;
        const { label: newLabel } = req.body;
        const imageFile = req.file;
        
        if (!imageFile) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const item = await findByLabel(label);
        if (!item) {
            return res.status(404).json({ error: 'Contact image not found' });
        }

        await modify(item.id, newLabel || label, imageFile);
        res.json({ message: 'Contact image updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { q: label } = req.query;
        
        const item = await findByLabel(label);
        if (!item) {
            return res.status(404).json({ 
                error: 'Contact image not found' 
            });
        }

        await destroy(label);
        res.json({ 
            message: 'Contact image deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { 
    listAll,
    getByLabel,
    getById,
    create,
    update,
    remove 
};