import {
    insert,
    findAll,
    findByLabel,
    modify,
    destroy
} from '../models/contact.js';

const listAll = async (req, res) => {
    try {
        const contacts = await findAll();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByLabel = async (req, res) => {
    try {
        const { q: label } = req.query;
        const contact = await findByLabel(label);
        
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { label, description } = req.body;
        
        if (!label || !description) {
            return res.status(400).json({ error: 'Label and description are required' });
        }

        await insert(label, description);
        res.status(201).json({ message: 'Contact created successfully' });
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
        const { label:newLabel, description } = req.body;
        
        if (!description) {
            return res.status(400).json({ error: 'Description is required' });
        }

        const contact = await findByLabel(label);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        await modify(contact.id, newLabel, description);
        res.json({ message: 'Contact updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { q: label } = req.query;
        
        const contact = await findByLabel(label);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        await destroy(label);
        res.json({ message: 'Contact deleted successfully' });
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