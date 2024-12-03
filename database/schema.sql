-- Admin users table
-- Stores admin credentials and metadata
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,      -- Unique username for login
    password TEXT NOT NULL,             -- Hashed password
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sort_id INTEGER NOT NULL,
    image_url TEXT NOT NULL
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sort_id INTEGER NOT NULL,    -- Unique identifier (e.g., 1, 2, 3)
    title TEXT NOT NULL,               -- Game title
    description_1 TEXT NOT NULL,       -- First game description
    description_2 TEXT NOT NULL,       -- Second game description
    background_color TEXT NOT NULL,    -- Background color for the game section
    text_color TEXT NOT NULL,          -- Text color for the game section
    url TEXT,                  -- URL for the game
    image_main_url TEXT NOT NULL,       -- Main game image URL
    image_1_url TEXT,                   -- Additional game image 1 URL
    image_2_url TEXT,                   -- Additional game image 2 URL
    image_3_url TEXT                    -- Additional game image 3 URL
);

-- Contact table
CREATE TABLE IF NOT EXISTS email (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT NOT NULL              -- Email address
);

-- Misc images table
CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT UNIQUE NOT NULL,         -- Unique identifier (e.g., 'map', 'building')
    image_url TEXT NOT NULL
);

-- Social media links table
CREATE TABLE IF NOT EXISTS social (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sort_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    url TEXT NOT NULL
);

-- Phone numbers table
CREATE TABLE IF NOT EXISTS phone (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sort_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    number TEXT NOT NULL
);

-- About table
CREATE TABLE IF NOT EXISTS about (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sort_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    paragraph_1 TEXT,
    paragraph_2 TEXT,
    paragraph_3 TEXT
);

-- Home table
CREATE TABLE IF NOT EXISTS home (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sort_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    header TEXT NOT NULL,
    paragraph_1 TEXT,
    paragraph_2 TEXT,
    action TEXT
);
