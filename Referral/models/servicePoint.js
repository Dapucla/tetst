// models/treatment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServicePointSchema = new Schema({
    servicePointID:{
        type: Number,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    patientRegistrations: [{
        type: Schema.Types.ObjectId, ref: 'PatientRegistration',
        required: false
    }]
});

module.exports = mongoose.model('ServicePoint', ServicePointSchema);