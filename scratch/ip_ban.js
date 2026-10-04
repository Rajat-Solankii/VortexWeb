const db = require('better-sqlite3')('vortex.db');

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS banned_ips (
      ip TEXT PRIMARY KEY,
      reason TEXT,
      bannedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Created banned_ips table.');
} catch (e) {
  console.log(e.message);
}

try {
  db.exec(`ALTER TABLE users ADD COLUMN lastIp TEXT;`);
  console.log('Added lastIp column to users table.');
} catch (e) {
  console.log(e.message); // Will error if column already exists, which is fine
}
