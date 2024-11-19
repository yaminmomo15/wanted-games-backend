import { createContentModel, getAllContentModel, getByIdContentModel, updateContentModel, deleteContentModel } from '../models/contentModel.js';

const createContentController = async (req, res) => {
    try {
        const { title, body } = req.body;
        const adminId = req.admin.id;

        if (!title || !body) {
            return res.status(400).json({ error: 'Title and body are required' });
        }

        await createContentModel(title, body, adminId);
        res.status(201).json({ message: 'Content created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllContentController = async (req, res) => {
    try {
        const contents = await getAllContentModel();
        res.json(contents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOneContentController = async (req, res) => {
    try {
        const content = await getByIdContentModel(req.params.id);
        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateContentController = async (req, res) => {
    try {
        const { title, body } = req.body;
        const { id } = req.params;

        if (!title || !body) {
            return res.status(400).json({ error: 'Title and body are required' });
        }

        const content = await getByIdContentModel(id);
        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }

        await updateContentModel(id, title, body);
        res.json({ message: 'Content updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteContentController = async (req, res) => {
    try {
        const content = await getByIdContentModel(req.params.id);
        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }

        await deleteContentModel(req.params.id);
        res.json({ message: 'Content deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 

export { createContentController, getAllContentController, getOneContentController, updateContentController, deleteContentController };