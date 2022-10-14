const mongoose = require('mongoose')
const { Schema, model } = mongoose

module.exports = model('User', new Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length <= 40
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return v.length <= 40
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'source',
        enum: ['source', 'admin', 'google']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}))