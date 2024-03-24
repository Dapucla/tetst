const User = require('../../authentication/models/user.js');
const { verifyToken } = require('../../authentication/controllers/authController');
const PatientServiceReferral = require('../models/PatientServiceReferral.js');
require('dotenv').config();

exports.makeReferral = async (req, res) => {
    try {
         // Verify the JWT token
         const authorizationHeader = req.headers.authorization;
         if (!authorizationHeader) {
             return res.status(401).json({ message: 'Unauthorized' });
         }
         const token = authorizationHeader.split(' ')[1]; // Extract token from authorization header
         const decodedToken = await verifyToken(token);

         if (decodedToken.roleID !== 2) {
            return res.status(403).json({ message: 'Access Denied. Only doctors are allowed to refer patients to service points' });
        }

        const { patientID, servicePointID, serviceName } = req.body;

        const newReferral = new PatientServiceReferral({          
            patientID,
            servicePointID,
            serviceName
        });

        console.log('before save');
        console.log(newReferral);

        // Save new patient referral to the database
        await newReferral.save();

        res.status(200).json({ message: 'Referral successful' });
        
    } catch (error) {
        console.error('Error making referral:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};