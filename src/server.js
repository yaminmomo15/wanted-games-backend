import dotenv from 'dotenv';
import app from './app.js';

// Load environment variables from .env file
dotenv.config();

// Use PORT from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 