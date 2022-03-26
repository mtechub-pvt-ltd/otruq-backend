const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  service: { type: String, required: true },
  vehicleType: { type: String, required: true },
  pickupLocation: { 
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String },
   },
  dropoffLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String },
  },
  shippingPrice: { type: Number, required: true },
  recievingTime: { type: String, required: true },
  senderWhatsapp: { type: String, required: true },
  recieverWhatsapp: { type: String, required: true },
  driverNotes: { type: String, required: true },
  payRecieve: { type: String, required: true },
  senderReciepient: { type: String, required: true },
  status: { type: String, default: "pending" },
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: "merchantProfile" },
  orderImages: { type: Array },
  OrderId: { type: Number },
});

module.exports=mongoose.model("order", orderSchema);