const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function login(req, res, next) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    if (!email || typeof password !== 'string' || !password) return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    const [rows] = await db.execute('SELECT id, nombre, email, password_hash, rol FROM usuarios WHERE email = ?', [email]);
    const usuario = rows[0];
    if (!usuario || !(await bcrypt.compare(password, usuario.password_hash))) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const token = jwt.sign({ sub: usuario.id, nombre: usuario.nombre, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
    return res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (error) { return next(error); }
}
module.exports = { login };
