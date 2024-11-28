import {
    insert,
    findAll,
    modify,
    destroy,
    findById
} from '../models/email.js';

const listAll = async (req, res) => {
    try {
        const emails = await findAll();
        res.json(emails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { address } = req.body;

        // Validation
        if (!address) {
            return res.status(400).json({
                error: 'Email address is required'
            });
        }

        const result = await insert(address);
        
        res.status(201).json({
            id: result.id
        });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({
                error: error.message
            });
        }
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { address } = req.body;
  
        // Validation
        if (!address) {
            return res.status(400).json({
                error: 'Email address is required'
            });
        }

        const email = await findById(id);
        if (!email) {
            return res.status(404).json({
                error: 'Email not found'
            });
        }

        await modify(id, address);

        res.json({
            message: 'Email updated successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const email = await findById(id);
        if (!email) {
            return res.status(404).json({
                error: 'Email not found'
            });
        }

        await destroy(id);
        res.json({
            message: 'Email deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const email = await findById(id);

        if (!email) {
            return res.status(404).json({
                error: 'Email not found'
            });
        }

        res.json(email);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    listAll,
    create,
    update,
    remove,
    getById
};
