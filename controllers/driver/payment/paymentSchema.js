const mongoose = require("mongoose");

const driverPaymentSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  accountHolderName: { type: String, required: true },
  expiryDate: { type: String, required: true },
  CVV: { type: Number, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "driverProfile" },
});

module.exports=mongoose.model("driverPayment", driverPaymentSchema);