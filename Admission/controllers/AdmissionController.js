const User = require('../../authentication/models/user.js');
const { verifyToken } = require('../../authentication/controllers/authController');

const Patient = require('../../PatientRegistration/models/Patient.js');
const Ward = require('../../Referral/models/wards.js');
const Treatment = require('../../DiagnosisAndTreatment/models/treatment.js');
const AdmissionDetails = require('../models/AdmissionDetails.js');
const PatientAdmissionDischarge = require('../models/PatientAdmissionDischarge.js');

require('dotenv').config();

exports.AdmitPatient = async (req, res) => {
    try {
        // Verify the JWT token
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authorizationHeader.split(' ')[1]; // Extract token from authorization header
        const decodedToken = await verifyToken(token);

        if (decodedToken.roleID !== 2) {
            return res.status(403).json({ message: 'Access Denied. Only doctors are allowed to admit patients to wards' });
        }

        const { PatientID, WardID, TreatmentID } = req.body;

        const MovementType = "Admission";

        const patient = await Patient.findOne({ patientId: PatientID });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        const ward = await Ward.findOne({WardID});

        const newPatientAdmission = new PatientAdmissionDischarge({
            MovementType,
            WardID,
            PatientID,
            TreatmentID
        });

        await newPatientAdmission.save();

        res.status(200).json({ message: 'Patient Admitted successfully' });

    } catch (error) {
        console.error('Error admitting patient:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.DischargePatient = async (req, res) => {
    try {
        // Verify the JWT token
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authorizationHeader.split(' ')[1]; // Extract token from authorization header
        const decodedToken = await verifyToken(token);

        if (decodedToken.roleID !== 2) {
            return res.status(403).json({ message: 'Access Denied. Only doctors are allowed to discharge patients' });
        }

        const empID = decodedToken.empID;

        const { PatientID, prescription } = req.body;

        const MovementType = "Discharge";

        const patient = await Patient.findOne({ patientId: PatientID });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        let lastWardID;
        let lastAdmission;

        // PatientAdmissionDischarge.find({ PatientID }).sort({ "Date": -1 }).exec(function (err, admission) {
        //     lastWardID = admission.WardID;
        //     lastAdmission = admission;
        // });
        const admission = await PatientAdmissionDischarge.findOne({ PatientID: PatientID }).sort({ "Date": -1 }).exec();
        lastAdmission = admission;

       // Retrieve the diagnosisId from the latest treatment
       const lastTreatment = await Treatment.findById(lastAdmission.TreatmentID);
       const lastAdmissionDiagnosisID = lastTreatment.diagnosisId;
        //console.log(lastAdmission);
        //doctor is discharging with a new home treatment
        const newTreatment = new Treatment({
            diagnosisId: lastAdmissionDiagnosisID,
            prescription,
            empId: empID,
            treatmentType: 'Home',
        });
        
        await newTreatment.save();

        const newPatientDischarge = new PatientAdmissionDischarge({
            MovementType,
            WardID,
            PatientID,
            TreatmentID: newTreatment._id
        });

        await newPatientDischarge.save();

        res.status(200).json({ message: 'Patient Discharged successfully' });

    } catch (error) {
        console.error('Error discharging patient:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.AddDetail = async (req, res) => {
    try {
        // Verify the JWT token
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authorizationHeader.split(' ')[1]; // Extract token from authorization header
        const decodedToken = await verifyToken(token);

        if (decodedToken.roleID != 2 && decodedToken.roleID != 3) {
            return res.status(403).json({ message: 'Access Denied. Only doctors and nurses are allowed to add details of admitted patients.' });
        }

        const empID = decodedToken.empID;

        const { patientID, BloodPressure, PulseRate, Temperature, Progress, Remarks } = req.body;

        let lastAdmission;

        // PatientAdmissionDischarge.find({ PatientID: patientID }).sort({ "Date": -1 }).exec(function (err, admission) {
        //     lastAdmission = admission;
        // });
        console.log(patientID);
        const admission = await PatientAdmissionDischarge.findOne({ PatientID: patientID }).sort({ "Date": -1 }).exec();
        lastAdmission = admission;
        console.log(admission);
        if (!lastAdmission || lastAdmission.MovementType !== "Admission")
            return res.status(400).json({ message: 'Patient is not currently admitted in the hospital.' });
        

        newAdmissionDetails = new AdmissionDetails({
            BloodPressure,
            PulseRate,
            Temperature,
            Progress,
            Remarks,
            EmpID: empID,
            AdmissionID: lastAdmission.id
        });

        await newAdmissionDetails.save()

        res.status(200).json({ message: 'Details added successfully' });

    } catch (error) {
        console.error('Error adding details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};