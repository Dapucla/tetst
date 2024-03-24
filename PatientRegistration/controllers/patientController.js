// Import necessary models and libraries
const Patient = require('../models/Patient');
const PatientRegistration = require('../models/PatientRegistration');
const { verifyToken } = require('../../authentication/controllers/authController');
const jwt = require('jsonwebtoken');
const moment = require('moment');
require('dotenv').config();

// retrieve patient details
exports.getPatientDetails = async (req, res) => {
    try {
        // Extract necessary information from the request body
        const { patientId } = req.params;

        // Verify the JWT token
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authorizationHeader.split(' ')[1]; // Extract token from authorization header
        const decodedToken = await verifyToken(token);

        if (decodedToken.roleID !== 2 && decodedToken.roleID !== 3 && decodedToken.roleID !== 4) {
            return res.status(403).json({ message: 'Access Denied. Only doctors, nurses, and paramedics are allowed to retrieve patient details.' });
        }
        // Find the patient by patientId
        const patient = await Patient.findOne({ patientId });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }
        const RegistrationRecord = await PatientRegistration.findOne({patientId});
        // Return patient details
        return res.status(200).json({ message: 'Patient details retrieved successfully', patient,RegistrationRecord });
        
    } catch (error) {
        console.error('Error retrieving patient details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function to  update additional information
exports.updatePatientDetails = async (req, res) => {
    try {
        // Extract necessary information from the request body
        const { patientId, additionalDiseases } = req.body;

        // Verify the JWT token
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authorizationHeader.split(' ')[1]; // Extract token from authorization header
        const decodedToken = await verifyToken(token);
        console.log('JWT verified successfully');
        console.log('Decoded token:', decodedToken);
        if (decodedToken.roleID !== 2 && decodedToken.roleID !== 3 && decodedToken.roleID !== 4) {
            return res.status(403).json({ message: 'Access Denied. Only doctors, nurses, and paramedics are allowed to retrieve patient details.' });
        }
        // Find the patient by patientId
        const patient = await Patient.findOne({ patientId });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        // Update patient details with additional information
        //append the new diseases to the existing one
        if (additionalDiseases && additionalDiseases.length > 0) {
            patient.knownDiseases.push(...additionalDiseases);
        }
        
        //patient.referralDetails = referralDetails;

        // Save the updated patient details
        await patient.save();

        // // Create a new patient registration entry for the specific service point
        // const registrationDateTime = new Date();
        // const newPatientRegistration = new PatientRegistration({
        //     patientID: patient.patientId,
        //     registrationPointID: registrationPointId,
        //     registrationDateTime
        // });

        ///await newPatientRegistration.save();

        // Return success response
        return res.status(200).json({ message: 'Patient details updated successfully', patient });

    } catch (error) {
        console.error('Error updating patient details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
