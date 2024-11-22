-- Admin users table
-- Stores admin credentials and metadata
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,      -- Unique username for login
    password TEXT NOT NULL,             -- Hashed password
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- About Us table
CREATE TABLE IF NOT EXISTS about_us (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT UNIQUE NOT NULL,         -- Unique identifier (e.g., 'mission', 'history')
    description TEXT NOT NULL
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT UNIQUE NOT NULL,         -- Unique identifier (e.g., 'team_photo', 'office')
    image BLOB NOT NULL                 -- Image data stored as BLOB
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT UNIQUE NOT NULL,         -- Unique identifier (e.g., 'racing_game', 'puzzle_game')
    name TEXT NOT NULL,                 -- Game name
    description_1 TEXT NOT NULL,        -- First game description
    description_2 TEXT NOT NULL,        -- Second game description
    image_main BLOB NOT NULL,           -- Main game image
    image_1 BLOB,                       -- Additional game image 1
    image_2 BLOB,                       -- Additional game image 2
    image_3 BLOB                        -- Additional game image 3
);

-- Contact table
CREATE TABLE IF NOT EXISTS contact (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT UNIQUE NOT NULL,         -- Unique identifier (e.g., 'email', 'phone', 'address')
    description TEXT NOT NULL
);

-- Contact images table
CREATE TABLE IF NOT EXISTS contact_image (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT UNIQUE NOT NULL,         -- Unique identifier (e.g., 'map', 'building')
    image BLOB NOT NULL                 -- Contact-related image data
);