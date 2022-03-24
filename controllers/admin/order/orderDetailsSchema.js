const mongoose = require("mongoose");

const orderDetailsSchema = new mongoose.Schema({
  service: { type: String },
  vehicleType: { type: String },
});

module.exports=mongoose.model("orderDetails", orderDetailsSchema);