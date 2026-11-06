require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
(async () => {
  try {
    const nombre = process.env.ADMIN_NAME || 'Administrador';
    const email = (process.env.ADMIN_EMAIL || 'admin@gestor.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!password || password.length < 10) throw new Error('Definí ADMIN_PASSWORD con al menos 10 caracteres en .env');
    const hash = await bcrypt.hash(password, 12);
    await db.execute('INSERT INTO usuarios (nombre,email,password_hash,rol) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), password_hash=VALUES(password_hash), rol=VALUES(rol)', [nombre,email,hash,'admin']);
    console.log(`Administrador configurado: ${email}`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
  finally { await db.end(); }
})();
