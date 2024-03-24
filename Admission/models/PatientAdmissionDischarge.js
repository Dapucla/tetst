// models/treatment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientAdmissionDischargeSchema = new Schema({
    MovementType: {
        type: String,
        enum: ['Admission', 'Discharge'],
        required: true
    },
    Date: {
        type: Date,
        required: true,
        default: Date.now
    },
    AdmissionDetails: [{
        type: Schema.Types.ObjectId, ref: 'AdmissionDetails',
        required: false
    }],
    WardID: {
        type: Number,
        required: true
    },
    PatientID: {
        type: Number,
        required: true
    },
    TreatmentID: {
        type: Schema.Types.ObjectId, ref: 'Treatment',
        required: true
    },
});

module.exports = mongoose.model('PatientAdmissionDischarge', PatientAdmissionDischargeSchema);