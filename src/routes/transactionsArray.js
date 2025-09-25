const express = require("express");
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controller/transactionsArray");

const validate = require("../middleware/validate");
const transactionSchema = require("../models/transactionsArray");

const router = express.Router();

router
  .route("/")
  .get(getTransactions)
  .post(validate(transactionSchema), createTransaction);

router
  .route("/:id")
  .get(getTransaction)
  .put(validate(transactionSchema), updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
