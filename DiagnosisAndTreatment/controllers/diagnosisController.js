// Developer: Kholoud Nasser
const Diagnosis = require('../models/diagnosis');
const { verifyToken } = require('../../authentication/controllers/authController');
require('dotenv').config();

// Controller function to create a new diagnosis
exports.createDiagnosis = async (req, res) => {
    try {
        const { patientId, diagnosis } = req.body;
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Unauthorized' });
        } 
        const token = authorizationHeader.split(' ')[1]; // Extract token from authorization header
        const decodedToken = await verifyToken(token);
        doctorId = decodedToken.empID;
        if (decodedToken.roleID !== 2 ) { // has to be a doctor 
            return res.status(400).json({ message: 'Access Denied' });
        }
        
        // Create diagnosis instance
        const newDiagnosis = new Diagnosis({
            patientId: patientId,
            doctorId:doctorId,
            diagnosis: diagnosis
        });

        // Save diagnosis to the database
        await newDiagnosis.save();

        res.status(201).json({ message: 'Diagnosis created successfully', diagnosis: newDiagnosis });
    } catch (error) {
        console.error('Error creating diagnosis:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Controller function to get diagnosis by ID
exports.getDiagnosisById = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        const token = authorizationHeader.split(' ')[1]; // Extract token from authorization header
        const decodedToken = await verifyToken(token);

        // Extract diagnosis ID from request parameters
        const { diagnosisId } = req.body;

        // Retrieve diagnosis by ID from the database
        const diagnosis = await Diagnosis.findById(diagnosisId);

        if (!diagnosis) {
            return res.status(404).json({ message: 'Diagnosis not found' });
        }

        res.status(200).json({ diagnosis });
    } catch (error) {
        console.error('Error retrieving diagnosis by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Controller function to get diagnosis by patient ID
exports.getDiagnosisByPatientId = async (req, res) => {
    try {

        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authorizationHeader.split(' ')[1]; // Extract token from authorization header
        const decodedToken = await verifyToken(token);

        const { patientId } = req.params;

        // Retrieve diagnosis by patient ID from the database
        const diagnosis = await Diagnosis.find({ patientId });
        //const diagnosis = await Diagnosis.exists({ patientId: patientId });
        if (!diagnosis || diagnosis.length === 0) {
            return res.status(404).json({ message: 'No diagnosis found for the specified patient ID' });
        }

        res.status(200).json({ diagnosis });
    } catch (error) {
        console.error('Error retrieving diagnosis by patient ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};