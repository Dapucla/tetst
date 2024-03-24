const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController');


// Route to handle Patient registration
router.post('/record', treatmentController.recordTreatment);
router.get('/get/:patientId', treatmentController.getTreatmentsByPatientId);

module.exports = router;