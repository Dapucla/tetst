
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientServiceReferralSchema = new Schema({
    patientID: {
        type: Number,
        required: true
    },
    servicePointID: {
        type:Number,
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    result: {
        type: String,
        
    },
    entryDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('PatientServiceReferral', PatientServiceReferralSchema);