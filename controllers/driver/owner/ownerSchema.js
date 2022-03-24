const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const ownerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  familyName: {
    type: String,
    required: true,
  },
  whatsappNo: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "driverProfile",
  },
});

module.exports = mongoose.model("owner", ownerSchema);
