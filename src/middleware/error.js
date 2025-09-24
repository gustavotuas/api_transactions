const statusCodes = require("../utils/statusCodes");
const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(err);

  // Duplicate key error (MongoDB code 11000)
  if (err.code === 11000) {
    const field = Object.entries(err.keyValue).map((fieldArr) =>
      fieldArr.join(":")
    );
    console.log(Object.entries(err.keyValue));
    const message = `Duplicated field value entere ${field}`;
    error = new ErrorResponse(message, statusCodes.NOT_FOUND);
  }

  res.status(error.statusCode || statusCodes.ERROR).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
