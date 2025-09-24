const express = require("express");
const transactions = require("./transactions");

const router = express.Router();
router.use("/api/v1/transactions", transactions);

module.exports = router;
