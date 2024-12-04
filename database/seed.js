import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { sampleData } from './seed-data.js';
import { uploadToS3, emptyS3Bucket } from '../src/utils/s3.js';
import fs from 'fs';
import * as gameModel from '../src/models/game.js';
import * as homeModel from '../src/models/home.js';
import * as aboutModel from '../src/models/about.js';
import * as galleryModel from '../src/models/gallery.js';
import * as socialModel from '../src/models/social.js';
import * as phoneModel from '../src/models/phone.js';
import * as emailModel from '../src/models/email.js';
import * as mediaModel from '../src/models/media.js';
import db from '../src/config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, process.env.DB_NAME);
const schemaPath = path.join(__dirname, 'schema.sql');
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

async function initializeDatabase() {
    
    try {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        

        // drop all tables
        const tables = [
            'admins',
            'gallery',
            'games',
            'email',
            'media',
            'social',
            'phone',
            'about',
            'home'
        ];

        for (const table of tables) {
            await db.runAsync(`DROP TABLE IF EXISTS ${table}`);
        }

        const statements = schema.split(';').filter(stmt => stmt.trim());
        for (let statement of statements) {
            await db.runAsync(statement);
        }

        await emptyS3Bucket();
        await seedAdminUser();
        await seedSampleData();

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        db.close();
    }
}

async function seedAdminUser() {
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
    await db.runAsync(
        'INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)',
        [adminUsername, hashedPassword]
    );
}

async function seedSampleData() {
    try {
        // Helper function to process image paths
        async function processImageField(imagePath, folder) {
            if (!imagePath) return null;
            const filePath = path.join(__dirname, imagePath);
            const fileBuffer = await fs.promises.readFile(filePath);
            const fileName = path.basename(imagePath);
            
            // Get file extension and determine mimetype
            const ext = path.extname(fileName).toLowerCase();
            const mimeTypes = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
                '.svg': 'image/svg+xml',
                '.bmp': 'image/bmp'
            };
            
            const file = {
                buffer: fileBuffer,
                originalname: fileName,
                mimetype: mimeTypes[ext] || 'application/octet-stream'
            };
            return file;
        }

        // Rest of your seeding logic remains the same, using processImageField
        for (const item of sampleData.home) {
            const imageFile = await processImageField(item.image, 'home');
            await homeModel.insert(
                item.header,
                item.paragraph_1,
                item.paragraph_2,
                item.action,
                imageFile,
                item.sort_id
            );
        }
        // About table
        for (const item of sampleData.about) {
            const imageFile = await processImageField(item.image, 'about');
            await aboutModel.insert(
                item.sort_id,
                item.title,
                imageFile,
                item.paragraph_1,
                item.paragraph_2,
                item.paragraph_3
            );
        }

        // Gallery table
        for (const item of sampleData.gallery) {
            const imageFile = await processImageField(item.image, 'gallery');
            await galleryModel.insert(
                item.sort_id,
                imageFile
            );
        }

        // Games table
        for (const item of sampleData.games) {
            const imageMainFile = await processImageField(item.image_main, 'games');
            const image1File = await processImageField(item.image_1, 'games');
            const image2File = await processImageField(item.image_2, 'games');
            const image3File = await processImageField(item.image_3, 'games');
            await gameModel.insert(
                item.title,
                item.description_1,
                item.description_2,
                imageMainFile,
                image1File,
                image2File,
                image3File,
                item.sort_id,
                item.background_color,
                item.text_color,
                item.url
            );
        }


         
        // Email
        for (const item of sampleData.email) {
            await emailModel.insert(item.address);
        }

        // Social media
        for (const item of sampleData.social) {
            const imageFile = await processImageField(item.image, 'social');
            await socialModel.insert(
                imageFile,
                item.url,
                item.sort_id
            );
        }

        // Phone
        for (const item of sampleData.phone) {
            const imageFile = await processImageField(item.image, 'phone');
            await phoneModel.insert(
                imageFile,
                item.number,
                item.sort_id
            );
        }

        // Media
        for (const item of sampleData.media) {
            const imageFile = await processImageField(item.image, 'media');
            await mediaModel.insert(item.label, imageFile);
        }
        

    } catch (error) {
        console.error('Error seeding sample data:', error);
        throw error;
    }
}

await initializeDatabase(); 