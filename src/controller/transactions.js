const TransactionsSchema = require("../models/transactions");
const statusCodes = require("../utils/statusCodes");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const jsonwebtoken = require("jsonwebtoken");

//@des Get All Transacctions
//@route GET /api/v1/transactions
//@access Public
exports.getTransactions = asyncHandler(async (req, res, next) => {
  // #swagger.tags = ['Transactions']
  // #swagger.description = 'Get All Transactions'
  // #swagger.responses[200] = {
  //   description: 'Transaction List',
  //   schema: {
  //     success: true,
  //     count: 2,
  //     data: [
  //       { _id: "1", amount: 100, type: "income", description: "Salary" },
  //       { _id: "2", amount: 50, type: "expense", description: "Food" }
  //     ]
  //   }
  // }

  let query = TransactionsSchema.find();

  if (req.query.sort) {
    const sortStr = req.query.sort.split(",").join(" ");
    query = query.sort(sortStr);
  }

  if (req.query.select) {
    const strSelect = req.query.select.split(",").join(" ");
    query = query.select(strSelect);
  }

  const limit = parseInt(req.query.limit) ?? 1;
  query = query.limit(limit);

  const page = parseInt(req.query.page) ?? 1;
  const startIndex = limit * (page - 1);
  const endIndex = limit * page;
  const totalDocuments = await TransactionsSchema.countDocuments();
  query = query.skip(startIndex);

  //pagination
  const pagination = {};

  let hasMore = true;

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  if (endIndex < totalDocuments) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  } else {
    hasMore = false;
  }

  const transactions = await query;

  res.status(statusCodes.OK).json({
    success: true,
    count: transactions.length,
    hasMore,
    pagination,
    data: transactions,
  });
});

//@desc Create a new Transaction
//@route POST /api/v1/transactions
//@access Public
exports.createTransaction = asyncHandler(async (req, res, next) => {
  /* 
  #swagger.tags = ['Transactions']
  #swagger.description = 'Generate a new transaction'
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    description: 'Transaction Info',
    schema: {
      $name: "Carlos Jam",
      $age: 25,
      $city: "New York",
      $sin: "123456783",
      $creditCardNumber: "9999777712340069",
      $creditCardType: "Visa",
      $amount: 800
    }
  }
  #swagger.responses[201] = {
    description: 'Transaction created',
    schema: { 
      success: true, 
      data: { 
        _id: "3", 
        name: "Carlos Jam",
        age: 25,
        city: "New York",
        sin: "123456783",
        creditCardNumber: "9999777712340069",
        creditCardType: "Visa",
        amount: 800
      } 
    }
  }
  #swagger.responses[400] = {
    description: 'Incorrect Information'
  }
*/

  const data = req.body;

  if (!data) {
    next(
      new ErrorResponse(
        "Data for create transaction is required",
        statusCodes.BAD_REQUEST
      )
    );
  }

  const newTransaction = await TransactionsSchema.create(data);

  res.status(statusCodes.OK).json({
    success: true,
    count: newTransaction.length,
    data: newTransaction,
  });
});

//@desc Update a Transaction
//@route PUT /api/v1/transactions/:id
//@access Public
exports.updateTransaction = asyncHandler(async (req, res, next) => {
  const body = req.body;

  if (!body) {
    next(
      new ErrorResponse(
        "Params required for update transaction",
        statusCodes.BAD_REQUEST
      )
    );
  }

  const updateTransaction = await TransactionsSchema.findByIdAndUpdate(
    req.params.id,
    body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updateTransaction) {
    return next(
      new ErrorResponse(
        `Not found transaction with id:${req.params.id}`,
        statusCodes.BAD_REQUEST
      )
    );
  }

  res.status(statusCodes.OK).json({ success: true, data: updateTransaction });
});

//@desc Delete a Transaction
//@route DELETE /api/v1/transactions/:id
//@access Private
exports.deleteTransaction = asyncHandler(async (req, res, next) => {
  const deletedTransaction = await TransactionsSchema.findByIdAndDelete(
    req.params.id
  );

  if (!deletedTransaction) {
    return next(
      new ErrorResponse(
        `Not found resource with id: ${req.params.id}`,
        statusCodes.BAD_REQUEST
      )
    );
  }

  res.status(statusCodes.OK).json({ success: true });
});

exports.login = asyncHandler(async (req, res, next) => {
  const transaction = TransactionsSchema.findById(req.params.id);

  if (!transaction) {
    return next(
      new ErrorResponse(
        `Not Found resource with id: ${req.params.id}`,
        statusCodes.NOT_FOUND
      )
    );
  }

  const token = jsonwebtoken.sign(
    { id: req.params.id },
    process.env.SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );

  res.status(statusCodes.OK).json({ success: true, token });
});
