const statusCodes = require("../utils/statusCodes");

const notFound = (req, res, next) => {
  const error = new Error(`Resource not found: ${req.originalUrl}`);
  error.statusCode = statusCodes.NOT_FOUND;
  next(error);
};

module.exports = notFound;
