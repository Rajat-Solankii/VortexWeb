const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../vortex.db');
const db = new Database(dbPath);

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
  
  const insertStmt = db.prepare(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`);
  insertStmt.run('maintenance_mode', 'false');
  console.log('Settings table created and maintenance_mode initialized successfully.');
} catch (error) {
  console.error('Error creating settings table:', error);
} finally {
  db.close();
}
