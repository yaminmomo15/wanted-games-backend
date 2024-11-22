import {
    insert,
    findAll,
    findByLabel,
    modify,
    destroy
} from '../models/contact-image.js';

const listAll = async (req, res) => {
    try {
        const items = await findAll();
        const processedItems = items.map(item => ({
            ...item,
            image: item.image.toString('base64')
        }));
        res.json(processedItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByLabel = async (req, res) => {
    try {
        const { q: label } = req.query;
        const item = await findByLabel(label);
        
        if (!item) {
            return res.status(404).json({ 
                error: 'Contact image not found' 
            });
        }
        
        res.json({
            ...item,
            image: item.image.toString('base64')
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { label } = req.body;
        const image = req.file?.buffer;
        
        if (!label || !image) {
            return res.status(400).json({ 
                error: 'Label and image are required' 
            });
        }

        await insert(label, image);
        res.status(201).json({ 
            message: 'Contact image created successfully' 
        });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ 
                error: 'Label must be unique' 
            });
        }
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { q: label } = req.query;
        const { label:newLabel } = req.body;
        const image = req.file?.buffer;
        
        if (!image) {
            return res.status(400).json({ 
                error: 'Image is required' 
            });
        }

        const item = await findByLabel(label);
        if (!item) {
            return res.status(404).json({ 
                error: 'Contact image not found' 
            });
        }

        await modify(item.id, newLabel, image);
        res.json({ 
            message: 'Contact image updated successfully' 
        });
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
    create,
    update,
    remove 
};