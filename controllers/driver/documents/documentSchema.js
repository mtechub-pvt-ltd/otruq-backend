const moongose = require('mongoose');

const driverDocumentsSchema = new moongose.Schema({
    idCardFront: { type: String, required: true },
    idCardBack: { type: String, required: true },
    driverLicense: { type: String, required: true },
    vehicleOwnership: { type: String, required: true }
});

module.exports = moongose.model('driverDocuments', driverDocumentsSchema);