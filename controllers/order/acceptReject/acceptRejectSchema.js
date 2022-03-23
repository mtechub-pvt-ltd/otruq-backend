const mongoose = require("mongoose");

const acceptRejectSchema = new mongoose.Schema({
  status: { type: String, required: true },
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

module.exports = mongoose.model("acceptRejectOrder", acceptRejectSchema);
