const {mongoose} = require('../bin/mongoose.util');
const {Schema} = require("mongoose");

const faceSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    descriptions: {
        type: Array,
        required: true,
    },
}, );

module.exports = mongoose.model('Face', faceSchema);
