// models/treatment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
    departmentID: {
        type: Number,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    wards: [{
        type: Schema.Types.ObjectId, 
        ref: 'Ward'
    }]
});

module.exports = mongoose.model('Department', DepartmentSchema);