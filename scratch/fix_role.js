const db = require('better-sqlite3')('vortex.db');
db.prepare("UPDATE users SET role = 'user'").run();
console.log('Downgraded all users to user');
