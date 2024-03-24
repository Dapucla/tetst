const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');

// Route to make a referral
router.post('/refer', referralController.makeReferral);

module.exports = router;