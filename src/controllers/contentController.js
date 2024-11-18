const ContentModel = require('../models/contentModel');

class ContentController {
    static async create(req, res) {
        try {
            const { title, body } = req.body;
            const adminId = req.admin.id;

            if (!title || !body) {
                return res.status(400).json({ error: 'Title and body are required' });
            }

            await ContentModel.create(title, body, adminId);
            res.status(201).json({ message: 'Content created successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const contents = await ContentModel.getAll();
            res.json(contents);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getOne(req, res) {
        try {
            const content = await ContentModel.getById(req.params.id);
            if (!content) {
                return res.status(404).json({ error: 'Content not found' });
            }
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { title, body } = req.body;
            const { id } = req.params;

            if (!title || !body) {
                return res.status(400).json({ error: 'Title and body are required' });
            }

            const content = await ContentModel.getById(id);
            if (!content) {
                return res.status(404).json({ error: 'Content not found' });
            }

            await ContentModel.update(id, title, body);
            res.json({ message: 'Content updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const content = await ContentModel.getById(req.params.id);
            if (!content) {
                return res.status(404).json({ error: 'Content not found' });
            }

            await ContentModel.delete(req.params.id);
            res.json({ message: 'Content deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ContentController; 