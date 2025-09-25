const statusCodes = require("../utils/statusCodes");

// Array global en memoria
let transactionsArray = [
  { id: 1, amount: 100, type: "income", description: "Salario" },
  { id: 2, amount: 50, type: "expense", description: "Comida" },
  { id: 3, amount: 200, type: "income", description: "Freelance" },
];

// @desc Get all transactions
// @route GET /api/v1/transactionsArray
// @access Public
exports.getTransactions = (req, res) => {
  let results = [...transactionsArray]; // copia del array

  // --- Sort ---
  if (req.query.sort) {
    const sortFields = req.query.sort.split(",");
    results.sort((a, b) => {
      for (let field of sortFields) {
        const desc = field.startsWith("-");
        const key = desc ? field.substring(1) : field;

        if (a[key] < b[key]) return desc ? 1 : -1;
        if (a[key] > b[key]) return desc ? -1 : 1;
      }
      return 0;
    });
  }

  // --- Select ---
  if (req.query.select) {
    const fields = req.query.select.split(",");
    results = results.map((item) => {
      const obj = {};
      fields.forEach((f) => {
        if (item[f] !== undefined) obj[f] = item[f];
      });
      return obj;
    });
  }

  // --- Pagination ---
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedResults = results.slice(startIndex, endIndex);

  const pagination = {};
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };
  if (endIndex < results.length) pagination.next = { page: page + 1, limit };

  res.status(statusCodes.OK).json({
    success: true,
    count: paginatedResults.length,
    pagination,
    data: paginatedResults,
  });
};

// @desc Get single transaction
// @route GET /api/v1/transactionsArray/:id
// @access Public
exports.getTransaction = (req, res) => {
  const transaction = transactionsArray.find(
    (t) => t.id === parseInt(req.params.id)
  );

  if (!transaction) {
    return res.status(statusCodes.NOT_FOUND).json({
      success: false,
      error: `Transaction with id ${req.params.id} not found`,
    });
  }

  res.status(statusCodes.OK).json({
    success: true,
    data: transaction,
  });
};

// @desc Create transaction
// @route POST /api/v1/transactionsArray
// @access Public
exports.createTransaction = (req, res) => {
  const newTransaction = {
    id: transactionsArray.length + 1,
    ...req.body,
  };

  transactionsArray.push(newTransaction);

  res.status(statusCodes.CREATED).json({
    success: true,
    data: newTransaction,
  });
};

// @desc Update transaction
// @route PUT /api/v1/transactionsArray/:id
// @access Public
exports.updateTransaction = (req, res) => {
  const index = transactionsArray.findIndex(
    (t) => t.id === parseInt(req.params.id)
  );

  if (index === -1) {
    return res.status(statusCodes.NOT_FOUND).json({
      success: false,
      error: `Transaction with id ${req.params.id} not found`,
    });
  }

  transactionsArray[index] = { ...transactionsArray[index], ...req.body };

  res.status(statusCodes.OK).json({
    success: true,
    data: transactionsArray[index],
  });
};

// @desc Delete transaction
// @route DELETE /api/v1/transactionsArray/:id
// @access Public
exports.deleteTransaction = (req, res) => {
  const index = transactionsArray.findIndex(
    (t) => t.id === parseInt(req.params.id)
  );

  if (index === -1) {
    return res.status(statusCodes.NOT_FOUND).json({
      success: false,
      error: `Transaction with id ${req.params.id} not found`,
    });
  }

  const deleted = transactionsArray.splice(index, 1);

  res.status(statusCodes.OK).json({
    success: true,
    data: deleted[0],
  });
};
