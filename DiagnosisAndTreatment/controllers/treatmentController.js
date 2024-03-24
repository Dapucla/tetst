// Developer: Kholoud Nasser
const Treatment = require('../models/treatment');
const { verifyToken } = require('../../authentication/controllers/authController');
const Patient = require('../../PatientRegistration/models/Patient');
const  Diagnosis  = require('../models/diagnosis');
require('dotenv').config();

// Controller function to create a new treatment
exports.recordTreatment = async (req, res) => {
    try {
        let doctorId=null;
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Unauthorized' });
        }        
        const token = authorizationHeader.split(' ')[1]; // Extract token from authorization header
        const decodedToken = await verifyToken(token);

        doctorId = decodedToken.empID; //get doctorID from decodedToken
        if (decodedToken.roleID !== 2 ) { // has to be a doctor 
            return res.status(400).json({ message: 'Access Denied' });
        }
        const {diagnosisId,diagnosis, prescription, days, treatmentType, dosage } = req.body;

        
        const diagnosisDet = await Diagnosis.findOne({ _id: diagnosisId });
        if (!diagnosisDet) {
            return res.status(404).json({ message: 'Diagnosis not Found.' });
        }
        // Check if the patient exists
        //const patientDetails = await getPatientDetails(patientId);
        //if (!patientDetails) {
            //return res.status(404).json({ message: 'Patient not found.' });
        //}
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

        const newTreatment = new Treatment({
            diagnosisId,
            patientId:diagnosisDet.patientId,
            empId:doctorId,
            diagnosis,
            prescription,
            endDate,
            treatmentType,
            dosage

        });

        // Save the new treatment to the database
        await newTreatment.save();

        res.status(201).json({ message: 'Treatment created successfully', treatment: newTreatment });
    } catch (error) {
        // Check if the error is a validation error
        if (error.name === 'ValidationError') {
            // Check if the error is related to the 'treatmentType' field
            if (error.errors && error.errors.treatmentType && error.errors.treatmentType.kind === 'enum') {
                const errorMessage = `Invalid value for treatmentType: '${error.errors.treatmentType.value}'. Valid values are: 'Hospital', 'Home' .`;
                // Return error response
                return res.status(400).json({ message: errorMessage });
            }
        }
        console.error('Error creating treatment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Controller function to retrieve treatments by patient ID
exports.getTreatmentsByPatientId = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Unauthorized' });
        }        
        const token = authorizationHeader.split(' ')[1]; // Extract token from authorization header
        await verifyToken(token); // Verify token

        const { patientId } = req.params;
        const treatments = await Treatment.find({ patientId });

        if (treatments.length === 0) {
            return res.status(404).json({ message: 'No treatments found for the specified patient ID' });
        }

        res.status(200).json({ treatments });
    } catch (error) {
        console.error('Error retrieving treatments by patient ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// // Controller function to retrieve all treatments
// exports.getAllTreatments = async (req, res) => {
//     try {
//         // Retrieve all treatments from the database
//         const treatments = await Treatment.find();

//         res.status(200).json({ treatments });
//     } catch (error) {
//         console.error('Error retrieving treatments:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

