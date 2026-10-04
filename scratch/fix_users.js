const db = require('better-sqlite3')('vortex.db');

db.exec(`
  DROP TABLE IF EXISTS users;
  CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    image TEXT,
    role TEXT DEFAULT 'user',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('Successfully recreated users table with TEXT id.');
