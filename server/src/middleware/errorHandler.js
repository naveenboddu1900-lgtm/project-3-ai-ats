export function errorHandler(err, _req, res, next) {
  void next;
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: status === 500 ? 'Unexpected server error.' : err.message
  });
}
