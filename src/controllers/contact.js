import {
    createContact,
    getAllContact,
    getByLabelContact,
    updateContact,
    deleteContact
} from '../models/contact.js';

export const getAll = async (req, res) => {
    try {
        const contacts = await getAllContact();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getByLabel = async (req, res) => {
    try {
        const { label } = req.params;
        const contact = await getByLabelContact(label);
        
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const { label, description } = req.body;
        
        if (!label || !description) {
            return res.status(400).json({ error: 'Label and description are required' });
        }

        await createContact(label, description);
        res.status(201).json({ message: 'Contact created successfully' });
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
        const { description } = req.body;
        
        if (!description) {
            return res.status(400).json({ error: 'Description is required' });
        }

        const contact = await getByLabelContact(label);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        await updateContact(label, description);
        res.json({ message: 'Contact updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const { label } = req.params;
        
        const contact = await getByLabelContact(label);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        await deleteContact(label);
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
