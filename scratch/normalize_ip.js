const db = require('better-sqlite3')('vortex.db');

try {
  db.exec("UPDATE banned_ips SET ip = '127.0.0.1' WHERE ip = '::1';");
  db.exec("UPDATE users SET lastIp = '127.0.0.1' WHERE lastIp = '::1';");
  console.log('Normalized IPs to 127.0.0.1');
} catch (e) {
  console.log(e);
}
