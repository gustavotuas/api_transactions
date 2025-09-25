const yup = require("yup");

const transactionArray = yup.object().shape({
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  type: yup
    .string()
    .oneOf(["income", "expense"], "Type must be income or expense")
    .required(),
  description: yup
    .string()
    .required("Description is required")
    .min(3, "Description must have at least 3 chars"),
});

module.exports = transactionArray;
