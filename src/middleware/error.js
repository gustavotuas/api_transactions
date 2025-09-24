const statusCodes = require("../utils/statusCodes");
const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;
  error.statusCode = statusCodes.ERROR;

  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, statusCodes.NOT_FOUND);
  }

  if (err.code === 11000) {
    const field = Object.entries(err.keyValue).map((fieldArr) =>
      fieldArr.join(":")
    );
    const message = `Duplicated field value entered ${field}`;
    error = new ErrorResponse(message, statusCodes.NOT_FOUND);
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(messages.join(", "), statusCodes.BAD_REQUEST);
  }

  res.status(error.statusCode || statusCodes.ERROR).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
