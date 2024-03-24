const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the patient schema
const patientSchema = new mongoose.Schema({
    patientId: {
        type: Number,
        unique: true,
        //required: true
    },
    name: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    knownDiseases: [String], // Array of strings for known diseases
    pastDiagnoses: [{
        type: Schema.Types.ObjectId, ref: 'diagnosis',
        required: false
    }],
    pastRegistrations: [{
        type: Schema.Types.ObjectId, ref: 'PatientRegistration',
        required: false
    }],
    Admissions: [{
        type: Schema.Types.ObjectId, ref: 'PatientAdmissionDischarge',
        required: false
    }],
    referrals: [{
        type: Schema.Types.ObjectId, ref: 'PatientServiceReferrals',
        required: false
    }]
});

// Pre-save middleware to generate patientId
patientSchema.pre('save', async function(next) {
    try {
        // Only generate patientId if it's not already set or is null
        if (!this.patientId || this.patientId === null) {
            // Find the document with the highest patientId
            const highestPatient = await this.constructor.findOne({}).sort({ patientId: -1 }).exec();
            console.log('Highest patient is ', highestPatient);

            // Extract the highest patientId value
            const highestPatientId = highestPatient ? highestPatient.patientId : 0;
            console.log('Highest patient ID is ', highestPatientId);

            // Increment the highest patientId or start from 1 if no existing patients
            this.patientId = highestPatientId + 1;
            console.log('This patient  is ', this);
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Create the patient model
const Patient = mongoose.model('Patient', patientSchema);

module.exports = mongoose.models.Patient || mongoose.model('Patient', patientSchema);