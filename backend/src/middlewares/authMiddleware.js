
const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Autenticación requerida'
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      error: 'Error de configuración del servidor'
    });
  }

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);

    if (usuario.rol !== 'admin') {
      return res.status(403).json({
        error: 'Acceso denegado'
      });
    }

    req.usuario = usuario;

    return next();

  } catch {
    return res.status(401).json({
      error: 'Token inválido o vencido'
    });
  }
}

module.exports = { verificarToken };
