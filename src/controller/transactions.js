const TransactionsSchema = require("../models/transactions");
const statusCodes = require("../utils/statusCodes");
const asyncHandler = require("../middleware/async");

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
