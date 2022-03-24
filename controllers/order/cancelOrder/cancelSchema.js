const mongoose = require("mongoose");

const cancelOrderSchema = new mongoose.Schema({
  status: { type: String, required: true },
  reason: { type: String, required: true },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "driverProfile",
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "merchantProfile",
    },
});

module.exports = mongoose.model("cancelOrder", cancelOrderSchema);
