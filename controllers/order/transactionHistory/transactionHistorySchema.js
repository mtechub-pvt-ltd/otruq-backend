const mongoose = require("mongoose");

const transactionHistorySchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "driverProfile",
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "merchantProfile",
  },
  payment: { type: String },
});

module.exports = mongoose.model("transactionHistory", transactionHistorySchema);
