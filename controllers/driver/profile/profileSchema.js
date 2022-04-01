const mongoose = require("mongoose");

const driverProfileSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    firstName: { type: String },
    lastName: { type: String },
    homeAddress: { type: String },
    phoneNumber: { type: String },
    location: {
      lat: { type: String },
      lng: { type: String },
    },
    profileImage: { type: String },
    status: { type: String, default: "active" },
  },
  {
    versionkey: false,
  }
);

module.exports = mongoose.model("driverProfile", driverProfileSchema);
