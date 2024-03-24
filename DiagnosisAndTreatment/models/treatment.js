// models/treatment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//test //test //test
const treatmentSchema = new Schema({
    diagnosisId: {  
        type: Schema.Types.ObjectId, 
        ref: 'Diagnosis', 
        required: true
    },
    empId: {
        type: Number,
        required: true
    },
    prescription: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
    },
    treatmentType: {
        type: String,
        enum: ['Hospital', 'Home'],
        required: true
    },
    // Admission: {
    //     type: Schema.Types.ObjectId, 
    //     ref: 'PatientAdmissionDischarge', 
    //     required: false
    // }
});

module.exports = mongoose.model('Treatment', treatmentSchema);
// const mongoose = require('mongoose');

// const treatmentSchema = new mongoose.Schema({
//     patientId: {
//         type: Number,
//         required: true
//     },
//     doctorId: {
//         type: Number,
//         required: true
//     },
//     diagnosis: {
//         type: String,
//         required: true
//     },
//     medication: {
//         type: String,
//         required: true
//     },
//     startDate: {
//         type: Date,
//         required: true,
//         default: Date.now
//     },
//     endDate: {
//         type: Date
//     },
//     treatmentType: {
//         type: String,
//         enum: ['Hospital', 'Home'],
//         required: true
//     },
//     intakeDetails: {
//         type: String
//     }
// });

// const Treatment = mongoose.model('Treatment', treatmentSchema);

// module.exports = Treatment;