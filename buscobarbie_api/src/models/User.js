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
        // no se podran repetir los emails. Sirve como filtro
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



// const user = new Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     }
// })

// const User = model('User', user)

// module.exports = User