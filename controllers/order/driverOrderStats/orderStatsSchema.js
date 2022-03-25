const mongoose = require("mongoose");

const driverOrderStatsSchema = new mongoose.Schema({
  orderDelivered: { type: Number, default: 0 },
  earning: { type: Number, default: 0 },
  orderRejection: { type: Number, default: 0 },
  orderRecieved: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "driverProfile",
  },
});

module.exports = mongoose.model("driverOrderStats", driverOrderStatsSchema);
