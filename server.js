const { AssemblyAI } = require('assemblyai');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
//const config = require('config');
//const Employee = require('./models/Employee');

const app = express();
const db = process.env.MONGODB_URL;

// Connect to MongoDB using Mongoose
mongoose.connect(db, {
 
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch(err => {
  console.error("Failed to connect to MongoDB:", err);
});

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
//Authentication Route
const authenticationRoutes = require('./authentication/routes/authRoutes');
app.use('/auth', authenticationRoutes);

//Patient Registeration Route
const RegisrationRoutes = require('./PatientRegistration/routes/registerRoutes');
app.use('/patients', RegisrationRoutes);

//Treatment Route
const treatmentRoutes = require('./DiagnosisAndTreatment/routes/treatmentRoutes');
app.use('/treatment', treatmentRoutes);
//Treatment Route
const diagnosisRoutes = require('./DiagnosisAndTreatment/routes/diagnosisRoutes');
app.use('/diagnose', diagnosisRoutes);

const admissionRoutes = require('./Admission/routes/AdmissionRoutes');
app.use('/Admission', admissionRoutes);

const referralRoutes = require('./Referral/routes/referralRoutes');
app.use('/Referral', referralRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// const client = new AssemblyAI({
//   apiKey: "3cb458c2dfb641d796ff6be869882a37"
// })

// const audioUrl =
//   'Recording.m4a'

// const configurl = {
//   audio_url: audioUrl
// }

// const run = async () => {
//   const transcript = await client.transcripts.create(configurl)
//   console.log(transcript.text)
// }

// run()
// Define employee data
/*const newEmpData = {
  name: 'KholoudTEST',
  Address: 'TEST'
};

// Create a new employee instance
const newEmp = new Employee(newEmpData);

// Save the new employee to the database
newEmp.save()
  .then(item => console.log(item))
  .catch(err => console.error("Failed to save employee:", err));*/
