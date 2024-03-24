// models/diagnosis.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const diagnosisSchema = new Schema({
    patientId: {  
        type: Number,
        required: true
     },
    doctorId: {
        type: Number,
        required: true
    },
    diagnosis: {
         type: String,
         required: true 
    },
    Date: {
        type: Date,
        required: true,
        default: Date.now
    },

 });

module.exports = mongoose.model('Diagnosis', diagnosisSchema);