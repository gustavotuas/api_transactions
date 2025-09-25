const transactions = require("../models/transactions");
const ErrorResponse = require("../utils/errorResponse");
const statusCodes = require("../utils/statusCodes");
const asyncHandler = require("./async");
const jwt = require("jsonwebtoken");

exports.isAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log(`${token}`.yellow.inverse);

  if (!token) {
    return next(
      new ErrorResponse(
        `Not autorized to access this route - Token Invalid`,
        statusCodes.FORBIDDEN
      )
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await transactions.findById(decoded.id);
    req.user = user;
    next();
  } catch (error) {
    return next(
      new ErrorResponse(
        `Not autorized to access this route`,
        statusCodes.FORBIDDEN
      )
    );
  }
});
