const db = require('better-sqlite3')('vortex.db');

try {
  // Add isVerified to users if it doesn't exist (default 1 for existing users)
  db.exec('ALTER TABLE users ADD COLUMN isVerified BOOLEAN DEFAULT 1');
  console.log('Added isVerified column to users');
} catch (e) {
  if (e.message.includes('duplicate column name')) {
    console.log('isVerified column already exists');
  } else {
    console.error(e);
  }
}

// Create verification_tokens table
db.exec(`
  CREATE TABLE IF NOT EXISTS verification_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    token TEXT NOT NULL,
    expiresAt DATETIME NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log('Created verification_tokens table');
