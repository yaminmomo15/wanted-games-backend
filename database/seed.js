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

/**
 * Database initialization and seeding function
 * Creates tables and populates with initial data
 */
async function initializeDatabase() {
    // Create a new database connection
    const db = new sqlite3.Database(dbPath, async (err) => {
        if (err) {
            console.error('Error connecting to database:', err);
            process.exit(1);
        }
        console.log('Connected to SQLite database');
    });

    try {
        // Synchronous read for schema
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Promisify database operations
        const runAsync = (sql) => new Promise((resolve, reject) => {
            db.run(sql, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Execute each schema statement
        const statements = schema.split(';').filter(stmt => stmt.trim());
        for (let statement of statements) {
            await runAsync(statement);
        }

        // Create default admin account
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await runAsync(`
            INSERT OR IGNORE INTO admins (username, password)
            VALUES ('admin', '${hashedPassword}')
        `);

        // Async read for image
        const imagePath = path.join(__dirname, 'fixtures/images/sample1.jpg');
        const imageBuffer = await readFile(imagePath);
        
        // Insert sample content with image
        const sampleContents = [
            {
                title: 'Welcome to Our Website',
                body: 'This is our first article. We hope you enjoy your stay!',
                image: imageBuffer,
                imageType: 'image/jpeg'
            },
            {
                title: 'Getting Started Guide',
                body: 'Here are some tips to help you get started with our platform...',
            }
        ];

        for (let content of sampleContents) {
            await runAsync(`
                INSERT INTO contents (title, body, created_by, image, image_type)
                VALUES (
                    '${content.title}',
                    '${content.body}',
                    (SELECT id FROM admins WHERE username = 'admin'),
                    ?,
                    '${content.imageType || null}'
                )
            `, content.image || null);
        }

        console.log('Database seeded successfully!');
        console.log('Default admin credentials:');
        console.log('Username: admin');
        console.log('Password: admin123');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close database connection
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('Database connection closed');
            }
        });
    }
}

// Run the initialization
initializeDatabase(); 