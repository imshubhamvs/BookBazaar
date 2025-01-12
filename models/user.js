const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        unique: true,
        sparse: true // Allows multiple null values
    },
    password: {
        type: String,
        required: true
    }
    ,
    token: {
        type: String
    },
    cart: [
        {
            isbn: { type: String },
            quantity: { type: Number },
        },
    ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
