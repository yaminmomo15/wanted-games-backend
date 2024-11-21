import {
    createContactImage,
    getAll,
    getByLabel,
    updateContactImage,
    deleteContactImage
} from '../models/contact-image.js';

export const getAllImages = async (req, res) => {
    try {
        const items = await getAll();
        const processedItems = items.map(item => ({
            ...item,
            image: item.image.toString('base64')
        }));
        res.json(processedItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getImageByLabel = async (req, res) => {
    try {
        const { label } = req.params;
        const item = await getByLabel(label);
        
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

export const create = async (req, res) => {
    try {
        const { label } = req.body;
        const image = req.file?.buffer;
        
        if (!label || !image) {
            return res.status(400).json({ 
                error: 'Label and image are required' 
            });
        }

        await createContactImage(label, image);
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

export const update = async (req, res) => {
    try {
        const { label } = req.params;
        const image = req.file?.buffer;
        
        if (!image) {
            return res.status(400).json({ 
                error: 'Image is required' 
            });
        }

        const item = await getByLabel(label);
        if (!item) {
            return res.status(404).json({ 
                error: 'Contact image not found' 
            });
        }

        await updateContactImage(label, image);
        res.json({ 
            message: 'Contact image updated successfully' 
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
                error: 'Contact image not found' 
            });
        }

        await deleteContactImage(label);
        res.json({ 
            message: 'Contact image deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
