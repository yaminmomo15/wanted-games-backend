import {
    createAbout,
    getAll,
    getByLabel,
    updateAbout,
    deleteAbout
} from '../models/about.js';

export const getAllAbout = async (req, res) => {
    try {
        const items = await getAll();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAboutByLabel = async (req, res) => {
    try {
        const { label } = req.params;
        const item = await getByLabel(label);
        
        if (!item) {
            return res.status(404).json({ error: 'About item not found' });
        }
        
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const { label, description } = req.body;
        
        if (!label || !description) {
            return res.status(400).json({ 
                error: 'Label and description are required' 
            });
        }

        await createAbout(label, description);
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

export const update = async (req, res) => {
    try {
        const { label } = req.params;
        const { description } = req.body;
        
        if (!description) {
            return res.status(400).json({ 
                error: 'Description is required' 
            });
        }

        const item = await getByLabel(label);
        if (!item) {
            return res.status(404).json({ 
                error: 'About item not found' 
            });
        }

        await updateAbout(label, description);
        res.json({ 
            message: 'About item updated successfully' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const { label } = req.params;
        
        const item = await getByLabel(label);
        if (!item) {
            return res.status(404).json({ 
                error: 'About item not found' 
            });
        }

        await deleteAbout(label);
        res.json({ 
            message: 'About item deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
