import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, 'website.db');
const schemaPath = path.join(__dirname, 'schema.sql');

async function initializeDatabase() {
    const db = new sqlite3.Database(dbPath, async (err) => {
        if (err) {
            console.error('Error connecting to database:', err);
            process.exit(1);
        }
        console.log('Connected to SQLite database');
    });

    try {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        const runAsync = (sql, params = []) => new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve(this);
            });
        });

        const statements = schema.split(';').filter(stmt => stmt.trim());
        for (let statement of statements) {
            await runAsync(statement);
        }

        // Create default admin account
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await runAsync(
            'INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)',
            ['admin', hashedPassword]
        );

        // Sample image for testing
        const imagePath = path.join(__dirname, 'fixtures/images/sample1.jpg');
        const imageBuffer = await readFile(imagePath);

        // Insert sample data
        const sampleData = {
            about_us: [
                { label: 'button1', description: 'contact us' },
                { label: 'button2', description: 'about us' }
            ],
            gallery: [
                { label: 'image1', image: imageBuffer },
                { label: 'image2', image: imageBuffer }
            ],
            games: [
                {
                    label: 'game1',
                    name: 'sample game 1',
                    description: 'An exciting board game...',
                    image_main: imageBuffer,
                    image_1: imageBuffer,
                    image_2: imageBuffer,
                    image_3: imageBuffer
                }
            ],
            contact: [
                { label: 'email', description: 'contact@example.com' },
                { label: 'phone', description: '+1234567890' }
            ],
            contact_image: [
                { label: 'phone-image1', image: imageBuffer },
                { label: 'phone-image2', image: imageBuffer }
            ]
        };

        // Insert sample data for each table
        for (const [table, data] of Object.entries(sampleData)) {
            for (const item of data) {
                const columns = Object.keys(item).join(', ');
                const placeholders = Object.keys(item).map(() => '?').join(', ');
                const values = Object.values(item);
                
                await runAsync(
                    `INSERT OR IGNORE INTO ${table} (${columns}) VALUES (${placeholders})`,
                    values
                );
            }
        }

        console.log('Database seeded successfully!');
        console.log('Default admin credentials:');
        console.log('Username: admin');
        console.log('Password: admin123');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        db.close();
    }
}

initializeDatabase(); 