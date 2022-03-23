const mongoose = require("mongoose");

const merchantProfileSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    homeAddress: { type: String, required: true },
    profileImage: { type: String },
  },
  {
    versionkey: false,
  }
);

module.exports = mongoose.model("merchantProfile", merchantProfileSchema);
