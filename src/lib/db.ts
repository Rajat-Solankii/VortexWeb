import Database from 'better-sqlite3';
import path from 'path';

// Create or connect to local SQLite database
const dbPath = path.join(process.cwd(), 'vortex.db');
export const db = new Database(dbPath);

// Initialize tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    image TEXT,
    role TEXT DEFAULT 'user',
    isVerified INTEGER DEFAULT 0,
    lastIp TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS banned_ips (
    ip TEXT PRIMARY KEY,
    reason TEXT,
    bannedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS verification_tokens (
    email TEXT NOT NULL,
    token TEXT NOT NULL,
    expiresAt DATETIME NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    mediaId TEXT NOT NULL,
    mediaType TEXT NOT NULL,
    title TEXT NOT NULL,
    posterPath TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userId, mediaId, mediaType)
  );

  CREATE TABLE IF NOT EXISTS user_profiles (
    userId TEXT PRIMARY KEY,
    watchHistory TEXT DEFAULT '[]',
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    isKids BOOLEAN DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profile_bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profileId TEXT NOT NULL,
    mediaId TEXT NOT NULL,
    mediaType TEXT NOT NULL,
    title TEXT NOT NULL,
    posterPath TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profileId, mediaId, mediaType)
  );

  CREATE TABLE IF NOT EXISTS profile_history (
    profileId TEXT PRIMARY KEY,
    watchHistory TEXT DEFAULT '[]',
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS collections (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS collection_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collectionId TEXT NOT NULL,
    mediaId TEXT NOT NULL,
    mediaType TEXT NOT NULL,
    title TEXT NOT NULL,
    posterPath TEXT,
    addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(collectionId) REFERENCES collections(id) ON DELETE CASCADE,
    UNIQUE(collectionId, mediaId, mediaType)
  );
`);
