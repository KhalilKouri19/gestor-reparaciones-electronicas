require('dotenv').config();

const bcrypt = require('bcryptjs');
const db = require('../config/db');

(async () => {
  try {
    const nombre = process.env.CLIENT_NAME?.trim();
    const email = process.env.CLIENT_EMAIL?.trim().toLowerCase();
    const password = process.env.CLIENT_PASSWORD;

    if (!nombre || !email || !password || password.length < 10) {
      throw new Error(
        'Definí CLIENT_NAME, CLIENT_EMAIL y CLIENT_PASSWORD (mínimo 10 caracteres)'
      );
    }

    const hash = await bcrypt.hash(password, 12);

    await db.execute(
      'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, 'cliente']
    );

    console.log(`Cliente creado correctamente: ${email}`);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('Ya existe un usuario con ese email.');
    } else {
      console.error(error.message);
    }

    process.exitCode = 1;
  } finally {
    await db.end();
  }
})();