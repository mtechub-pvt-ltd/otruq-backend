const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  service: { type: String, required: true },
  vehicleType: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  shippingPrice: { type: Number, required: true },
  recievingTime: { type: String, required: true },
  senderWhatsapp: { type: String, required: true },
  recieverWhatsapp: { type: String, required: true },
  driverNotes: { type: String, required: true },
  payRecieve: { type: String, required: true },
  senderReciepient: { type: String, required: true },
  status: { type: String, required: true },
});

module.exports=mongoose.model("order", orderSchema);