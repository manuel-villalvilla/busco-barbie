const mongoose = require('mongoose')
const { Schema, model } = mongoose

module.exports = model('FistConnection', new Schema({
    ip: {
        type: String,
        required: true,
        unique: true
    },
    locale: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}))