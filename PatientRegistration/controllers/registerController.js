const Patient = require('../models/Patient'); // Import the Patient model
const RegistrationPoint = require('../models/RegisterationPoints'); // Import the RegisterationPoints model
const PatientRegistration = require('../models/PatientRegistration'); // Import the PatientRegistration model
const { verifyToken } = require('../../authentication/controllers/authController');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library for token generation
const moment = require('moment');
require('dotenv').config();

// Patients registration
exports.register = async (req, res) => {
    try {
         // Extract patient information from the request body
         const { name, DOB, gender, contactNumber, address, knownDiseases, servicePointID } = req.body;
         //verify the token
         const authorizationHeader = req.headers.authorization;
         if (!authorizationHeader) {
             return res.status(401).json({ message: 'Unauthorized' });
         }
         const token = authorizationHeader.split(' ')[1]; // Extract token from authorization header
         const decodedToken = await verifyToken(token);
         if(decodedToken.roleID !=1){  
            return res.status(400).json({ message: 'Access Denied,only Registration Clerks can register patients' });
        }
       
        // expected date format in Regex ("DD/MM/YYYY")
        const DateFormatRegex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;

        // Validating the date format
        if (!DateFormatRegex.test(DOB)) {
            // If the date format is invalid, return an error message
            return res.status(400).json({ message: 'Invalid date format. Please use the format DD/MM/YYYY.' });
        }
        const dob = moment(DOB, 'DD/MM/YYYY');
        
        const newPatient = new Patient({          
            name,
            DOB: dob,
            gender,
            contactNumber,
            address,
            knownDiseases
        });
        console.log('before save');
        console.log(newPatient);
        // Save new patient to the database
        await newPatient.save();
        
        // Create a new patient registration
        const registrationDateTime = new Date();
        const newPatientRegistration = new PatientRegistration({
            patientId: newPatient.patientId,
            servicePointID,
            registrationDateTime
        });

        // Save new patient registration to the database
        await newPatientRegistration.save();
        
        console.log('after save');
        // Return success response
        res.status(201).json({ message: 'Patient registered successfully', patient: newPatient, Registration: newPatientRegistration});
    } catch (error) {
         // Check if the error is a validation error
         if (error.name === 'ValidationError') {
            // Check if the error is related to the 'gender' field
            if (error.errors && error.errors.gender && error.errors.gender.kind === 'enum') {
                // Customize the error message for invalid enum value
                const errorMessage = `Invalid value for gender: '${error.errors.gender.value}'. Valid values are: 'Male', 'Female' .`;
                
                // Return error response
                return res.status(400).json({ message: errorMessage });
            }
        }

        console.error('There was a problem registering this Patient:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};