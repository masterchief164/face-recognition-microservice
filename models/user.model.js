const mongoose = require('../bin/mongoose.util');
const {Schema} = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String, required: true
    }, email: {
        type: String, required: true
    }, picture: {
        type: String, required: true,
    }, sub: {
        type: String, required: true
    }, given_name: {
        type: String, required: true
    }, family_name: {
        type: String, required: true
    }, phoneNumber: {
        type: String,
    }, department: {
        type: String,
    }, courses: {
        type: [Schema.Types.ObjectId], ref: "Course"
    }, roll: {
        type: String, required: true
    }, batch: {
        type: String,
    }, userType: {
        type: String, required: true, enum: ['student', 'instructor', 'admin'], default: 'student'
    }, descriptions: {
        type: Array,
        required: true,
    }, faceData: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);

