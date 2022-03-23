const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  recievingTime: { type: String, required: true },
  shippingPrice: { type: Number, required: true },
  vehicleType: { type: String, required: true },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "driverProfile",
  },
});

module.exports = mongoose.model("bidOrder", bidSchema);
