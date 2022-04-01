const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  jobTitle: { type: String },
  gender: { type: String },
  dob: { type: String },
  role: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("admin", adminSchema);
