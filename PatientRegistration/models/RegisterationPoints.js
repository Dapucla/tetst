const mongoose = require('mongoose');

// Define schema for RegistrationPoint
const registrationPointSchema = new mongoose.Schema({
    registrationPointID: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
  
});

// Create RegistrationPoint model
const RegistrationPoint = mongoose.model('RegistrationPoint', registrationPointSchema);

module.exports = RegistrationPoint;