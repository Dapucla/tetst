const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for PatientRegistration
const patientRegistrationSchema = new mongoose.Schema({
    registrationID: {
        type: Number,
        unique: true
    },
    patientId: {
        type: Number,
        required: true
    },
    registrationDateTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    servicePointID: {
        //type: Schema.Types.ObjectId, ref: 'ServicePoint',
        type: Number,
        required: true
    }
});
// Pre-save middleware to generate registrationID
patientRegistrationSchema.pre('save', async function(next) {
    try {
        // Only generate patientId if it's not already set or is null
        if (!this.registrationID || this.registrationID === null) {
            // Find the document with the highest patientId
            const highestregistration = await this.constructor.findOne({}).sort({ registrationID: -1 }).exec();
            console.log('Highest registration ID is ', highestregistration);

            // Extract the highest patientId value
            const highestregistrationID = highestregistration ? highestregistration.registrationID : 0;
            console.log('Highest patient ID is ', highestregistrationID);

            // Increment the highest patientId or start from 1 if no existing patients
            this.registrationID = highestregistrationID + 1;
            console.log('This patient  is ', this);
        }

        next();
    } catch (error) {
        next(error);
    }
});
// Create PatientRegistration model
const PatientRegistration = mongoose.model('PatientRegistration', patientRegistrationSchema);

module.exports = PatientRegistration;