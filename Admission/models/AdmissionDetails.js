// models/treatment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdmissionDetailsSchema = new Schema({
    BloodPressure: {
        type: Number,
        required: false
    },
    PulseRate: {
        type: Number,
        required: false
    },
    Temperature: {
        type: Number,
        required: false
    },
    Progress: {
        type: String,
        required: false
    },
    Remarks: {
        type: String,
        required: false
    },
    EntryDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    EmpID: {
        type: Number, 
        required: true
    },
    AdmissionID: {  
        type: Schema.Types.ObjectId, ref: 'PatientAdmissionDischarge', 
        required: true
    },
});

module.exports = mongoose.model('AdmissionDetails', AdmissionDetailsSchema);