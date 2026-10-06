const Database = require('better-sqlite3');
const db = new Database('vortex.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Local DB Tables:');
console.log(tables.map(t => t.name).join(', '));
