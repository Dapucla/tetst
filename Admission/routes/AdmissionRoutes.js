const express = require('express');
const router = express.Router();
const admissionController = require('../controllers/AdmissionController');

// Route to handle patient admission
router.post('/AdmitPatient', admissionController.AdmitPatient);

// Route to handle patient discharge
router.post('/DischargePatient', admissionController.DischargePatient);

// Route to handle an addition of intake, vitals, or doctor progress report to admitted patient
router.post('/AddDetail', admissionController.AddDetail);

module.exports = router;