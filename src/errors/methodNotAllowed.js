function methodNotAllowed(req, res, next) {
  next({
    status: 405,
    message: `The request method ${req.method} is not allowed for ${req.baseUrl}`,
  });
}

module.exports = methodNotAllowed;
