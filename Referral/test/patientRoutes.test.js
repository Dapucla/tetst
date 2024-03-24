// patientRoutes.test.js

const request = require('supertest');
const app = express();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('GET /:patientId', () => {
    test('should return patient details by ID', async () => {
       
        const patientId = 'testPatientId';
        const response = await request(app).get(`/patients/${patientId}`);
        expect(response.status).toBe(200);
        expect(response.body.patientId).toBe(patientId);
    });

    test('should return 404 if patient not found', async () => {
        const response = await request(app).get('/patients/nonexistentId');
        expect(response.status).toBe(404);
    });
});

describe('PUT /:patientId', () => {
    test('should update patient details', async () => {
        
        const patientId = 'testPatientId';
        const updatedDetails = { /* Updated patient details */ };
        const response = await request(app)
            .put(`/patients/${patientId}`)
            .send(updatedDetails);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Patient details updated successfully');
    });
});

describe('POST /', () => {
    test('should make a referral if user is a doctor', async () => {

        const userId = 'testDoctorUserId';
        const serviceType = 'testServiceType';
        const response = await request(app)
            .post('/patients')
            .send({ userId, serviceType });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Referral successful');
    });

    test('should deny referral if user is not a doctor', async () => {

        const userId = 'testNonDoctorUserId';
        const serviceType = 'testServiceType';
        const response = await request(app)
            .post('/patients')
            .send({ userId, serviceType });
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Only doctors are allowed to refer patients to services.');
    });
});
