const jwt = require('jsonwebtoken');
function verificarToken(req, res, next) {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');
  if (tipo !== 'Bearer' || !token) return res.status(401).json({ error: 'Autenticación requerida' });
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    if (req.usuario.rol !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
    return next();
  } catch { return res.status(401).json({ error: 'Token inválido o vencido' }); }
}
module.exports = { verificarToken };
