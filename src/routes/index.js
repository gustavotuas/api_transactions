const express = require("express");
const transactions = require("./transactions");
const transactionsArray = require("./transactionsArray");

const router = express.Router();
router.use("/api/v1/transactions", transactions);
router.use("/api/v1/transactionsArray", transactionsArray);

module.exports = router;
