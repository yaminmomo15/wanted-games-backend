import {
    createGallery,
    getAllGallery,
    getByLabelGallery,
    updateGallery,
    deleteGallery
} from '../models/gallery.js';

export const getAll = async (req, res) => {
    try {
        const items = await getAllGallery();
        const processedItems = items.map(item => ({
            ...item,
            image: item.image.toString('base64')
        }));
        res.json(processedItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getByLabel = async (req, res) => {
    try {
        const { label } = req.params;
        const item = await getByLabelGallery(label);
        
        if (!item) {
            return res.status(404).json({ error: 'Gallery item not found' });
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
            return res.status(400).json({ error: 'Label and image are required' });
        }

        await createGallery(label, image);
        res.status(201).json({ message: 'Gallery item created successfully' });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Label must be unique' });
        }
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const { label } = req.params;
        const image = req.file?.buffer;
        
        if (!image) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const item = await getByLabelGallery(label);
        if (!item) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }

        await updateGallery(label, image);
        res.json({ message: 'Gallery item updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const { label } = req.params;
        const item = await getByLabelGallery(label);
        
        if (!item) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }

        await deleteGallery(label);
        res.json({ message: 'Gallery item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
