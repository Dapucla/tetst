const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const patientController = require('../controllers/patientController');

// Route to handle Patient registration
router.post('/register', registerController.register);
router.post('/update', patientController.updatePatientDetails);
router.get('/:patientId', patientController.getPatientDetails);


module.exports = router;