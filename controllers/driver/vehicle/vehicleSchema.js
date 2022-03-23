const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  vehicleType: { type: String, required: true },
  plateNumber: { type: String, required: true },
  plateCode: { type: String, required: true },
  yearOfManufacture: { type: Number, required: true },
  companyOfManufacture: { type: String, required: true },
  vehicleColor: { type: String, required: true }
});

module.exports=mongoose.model("vehicleSchema", vehicleSchema);