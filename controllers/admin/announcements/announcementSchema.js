const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
    message: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
});

module.exports = mongoose.model("announcement", announcementSchema);