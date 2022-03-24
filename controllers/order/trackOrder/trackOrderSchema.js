const mongoose = require("mongoose");

const trackOrderSchema = new mongoose.Schema({
  shipmentstarted: { type: Boolean, default: false },
  receiptArrived: { type: Boolean, default: false },
  shipmentRecieved: { type: Boolean, default: false },
  shipmentDelivered: { type: Boolean, default: false },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "driverProfile",
  },
});

module.exports = mongoose.model("trackOrder", trackOrderSchema);
