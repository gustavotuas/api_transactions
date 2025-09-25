const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const TransactionsSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Required a name"] },
  age: { type: Number, required: [true, "Required an age"] },
  city: {
    type: String,
    maxlength: [50, "No more than 50 characters for city"],
  },
  sin: {
    type: String,
    required: [true, "Required SIN number"],
    unique: true,
    trim: true,
  },
  creditCardNumber: {
    type: String,
    required: [true, "Required Credit Card Number"],
    unique: true,
    trim: true,
  },
  creditCardType: { type: String, enum: ["Visa", "Mastercard"] },
  amount: { type: Number, required: [true, "Required an Amount"] },
});

TransactionsSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET, {
    expiresIn: "30d",
  });
};

module.exports = mongoose.model(
  "Transaction",
  TransactionsSchema,
  "transactions"
);
