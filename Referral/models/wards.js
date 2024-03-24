const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
    wardID: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    departmentID: {
        type: Number,
        required: true
    },
    patientAdmissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PatientAdmissionDischarge',
        required: false
    }]
});

const Ward = mongoose.model('Ward', wardSchema);

module.exports = Ward;
