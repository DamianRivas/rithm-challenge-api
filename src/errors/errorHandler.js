function errorHandler(err, req, res, next) {
  const { status = 500, message = "Something went wrong!" } = err;
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
