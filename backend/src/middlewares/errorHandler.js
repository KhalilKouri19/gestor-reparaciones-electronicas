
function errorHandler(error, req, res, next) {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  const status = Number.isInteger(error.statusCode)
    && error.statusCode >= 400
    && error.statusCode < 500
    ? error.statusCode
    : 500;

  return res.status(status).json({
    error: status === 500
      ? 'Error interno del servidor'
      : error.message
  });
}

module.exports = errorHandler;
