const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    discount: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
});

module.exports = mongoose.model("coupon", couponSchema);