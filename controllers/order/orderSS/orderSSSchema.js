const mongoose = require("mongoose");

const orderScreenShotSchema = new mongoose.Schema({
  orderSS: { type: String },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "driverProfile",
  },
});

module.exports = mongoose.model("orderScreenShot", orderScreenShotSchema);
