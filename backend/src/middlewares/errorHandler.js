function errorHandler(error, req, res, next) {
  console.error(error);
  if (res.headersSent) return next(error);
  const status = error.message?.includes('obligatorio') || error.message?.includes('inválido') || error.message?.includes('inválida') ? 400 : 500;
  return res.status(status).json({ error: status === 500 ? 'Error interno del servidor' : error.message });
}
module.exports = errorHandler;
