import {
    createGames,
    getAllGames,
    getByLabelGames,
    updateGames,
    deleteGames
} from '../models/game.js';

export const getAll = async (req, res) => {
    try {
        const games = await getAllGames();
        const processedGames = games.map(game => ({
            ...game,
            image_main: game.image_main.toString('base64'),
            image_1: game.image_1?.toString('base64'),
            image_2: game.image_2?.toString('base64'),
            image_3: game.image_3?.toString('base64')
        }));
        res.json(processedGames);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getByLabel = async (req, res) => {
    try {
        const { label } = req.params;
        const game = await getByLabelGames(label);
        
        if (!game) {
            return res.status(404).json({ 
                error: 'Game not found' 
            });
        }
        
        res.json({
            ...game,
            image_main: game.image_main.toString('base64'),
            image_1: game.image_1?.toString('base64'),
            image_2: game.image_2?.toString('base64'),
            image_3: game.image_3?.toString('base64')
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const { label, name, description } = req.body;
        const files = req.files;

        // Validation
        if (!label || !name || !description) {
            return res.status(400).json({ 
                error: 'Label, name, and description are required' 
            });
        }

        if (!files?.image_main) {
            return res.status(400).json({ 
                error: 'Main image is required' 
            });
        }

        await createGames({
            label,
            name,
            description,
            image_main: files.image_main[0].buffer,
            image_1: files.image_1?.[0]?.buffer || null,
            image_2: files.image_2?.[0]?.buffer || null,
            image_3: files.image_3?.[0]?.buffer || null
        });

        res.status(201).json({ 
            message: 'Game created successfully' 
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
        const { name, description } = req.body;
        const files = req.files;

        // Validation
        if (!name || !description) {
            return res.status(400).json({ 
                error: 'Name and description are required' 
            });
        }

        const game = await getByLabelGames(label);
        if (!game) {
            return res.status(404).json({ 
                error: 'Game not found' 
            });
        }

        await updateGames({
            label,
            name,
            description,
            image_main: files?.image_main?.[0]?.buffer,
            image_1: files?.image_1?.[0]?.buffer,
            image_2: files?.image_2?.[0]?.buffer,
            image_3: files?.image_3?.[0]?.buffer
        });

        res.json({ 
            message: 'Game updated successfully' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const { label } = req.params;
        
        const game = await getByLabelGames(label);
        if (!game) {
            return res.status(404).json({ 
                error: 'Game not found' 
            });
        }

        await deleteGames(label);
        res.json({ 
            message: 'Game deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
