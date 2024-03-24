const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/diagnosisController');

router.post('/record', diagnosisController.createDiagnosis);
router.get('/get/:patientId', diagnosisController.getDiagnosisByPatientId);

module.exports = router;