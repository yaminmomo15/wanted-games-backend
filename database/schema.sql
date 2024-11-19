-- Admin users table
-- Stores admin credentials and metadata
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,      -- Unique username for login
    password TEXT NOT NULL,             -- Hashed password
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Content table
-- Stores all content entries with metadata
CREATE TABLE IF NOT EXISTS contents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,                -- Content title
    body TEXT NOT NULL,                 -- Main content body
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,                 -- References admin who created the content
    FOREIGN KEY (created_by) REFERENCES admins(id)
); 