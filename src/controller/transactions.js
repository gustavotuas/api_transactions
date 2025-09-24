const TransactionsSchema = require("../models/transactions");
const statusCodes = require("../utils/statusCodes");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

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
  const transactions = await TransactionsSchema.find();

  res
    .status(statusCodes.OK)
    .json({ success: true, count: transactions.length, data: transactions });
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
//@access Public
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
