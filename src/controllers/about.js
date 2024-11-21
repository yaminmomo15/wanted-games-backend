import {
    insert,
    findAll,
    findByLabel,
    modify,
    destroy
} from '../models/about.js';

const listAll = async (req, res) => {
    try {
        const items = await findAll();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByLabel     = async (req, res) => {
    try {
        const { label } = req.params;
        const item = await findByLabel(label);
        
        if (!item) {
            return res.status(404).json({ error: 'About item not found' });
        }
        
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { label, description } = req.body;
        
        if (!label || !description) {
            return res.status(400).json({ 
                error: 'Label and description are required' 
            });
        }

        await insert(label, description);
        res.status(201).json({ 
            message: 'About item created successfully' 
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
        const { label } = req.params;
        const { description } = req.body;
        
        if (!description) {
            return res.status(400).json({ 
                error: 'Description is required' 
            });
        }

        const item = await findByLabel(label);
        if (!item) {
            return res.status(404).json({ 
                error: 'About item not found' 
            });
        }

        await modify(label, description);
        res.json({ 
            message: 'About item updated successfully' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { label } = req.params;
        
        const item = await findByLabel(label);
        if (!item) {
            return res.status(404).json({ 
                error: 'About item not found' 
            });
        }

        await destroy(label);
        res.json({ 
            message: 'About item deleted successfully' 
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