const express = require("express");
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  login,
} = require("../controller/transactions");
const { isAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", getTransactions);

router.post("/", createTransaction);

router.put("/:id", updateTransaction);

router.delete("/:id", isAuth, deleteTransaction);

router.post("/:id", login);

module.exports = router;
