import { createContentModel, getAllContentModel, getByIdContentModel, updateContentModel, deleteContentModel } from '../models/contentModel.js';

/**
 * Creates a new content entry
 * Requires authentication
 * 
 * @param {Object} req - Express request object with title and body in request body
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message or error
 */
const createContentController = async (req, res) => {
    try {
        const { title, body } = req.body;
        const adminId = req.admin.id;
        
        if (!title || !body) {
            return res.status(400).json({ error: 'Title and body are required' });
        }

        let image = null;
        let imageType = null;
        
        if (req.file) {
            image = req.file.buffer;
            imageType = req.file.mimetype;
        }

        await createContentModel(title, body, adminId, image, imageType);
        res.status(201).json({ message: 'Content created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Retrieves all content entries
 * Requires authentication
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with all content entries or error
 */
const getAllContentController = async (req, res) => {
    try {
        const contents = await getAllContentModel();
        
        // Convert image buffers to data URLs
        const contentsWithImages = contents.map(content => {
            if (content.image) {
                // Convert Buffer to base64 and create a data URL
                const base64Image = content.image.toString('base64');
                return {
                    ...content,
                    // Replace binary buffer with data URL for frontend use
                    image: `data:${content.image_type};base64,${base64Image}`
                };
            }
            return content;
        });
        res.json(contentsWithImages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Retrieves a single content entry
 * Requires authentication
 * 
 * @param {Object} req - Express request object with content ID in params
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with the content entry or error
 */
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

/**
 * Updates an existing content entry
 * Requires authentication
 * 
 * @param {Object} req - Express request object with title and body in request body
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message or error
 */
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

/**
 * Deletes a content entry
 * Requires authentication
 * 
 * @param {Object} req - Express request object with content ID in params
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message or error
 */
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