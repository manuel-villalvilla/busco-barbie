const mongoose = require('mongoose')
const { Schema, model, Types: { ObjectId } } = mongoose

module.exports = model('Ad', new Schema({
    user: {
        type: ObjectId,
        required: true,
        ref: 'User' // linked
    },
    title: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length <= 30
            }
        }
    },
    body: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length <= 500
            }
        }
    },
    location: {
        type: Object,
        country: {
            type: String,
            required: true,
            enum: ['AR', 'MX', 'ES', 'US']
        },
        province: {
            type: String,
            default: ''
        },
        area: {
            type: String,
            default: '',
            validate: {
                validator: function(v) {
                    return v.length <= 50
                }
            }
        }
    },
    phone: {
        type: String,
        default: '',
        validate: {
            validator: function(v) {
                return v.length <= 20
            }
        }
    },
    image: {
        type: Array,
        default: [],
        validate: {
            validator: function(v) {
                return v.length <= 4 
            }
        }
    },
    categories: {
        type: String,
        enum: ['modelos', 'complementos'],
        required: true
    },
    year: {
        type: String,
        default: '',
        enum: ['', 'Todas', '1960', '1970', '1980', '1990', '2000', '2010', '2020']
    },
    tags: {
        type: Array,
        default: []
    },
    price: {
        type: Number,
        required: true
    },
    visibility: {
        type: String,
        enum: ['private', 'public'], // le dice a mongo q solo acepte esos dos valores
        default: 'public'
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date
    }
}))
// .index({ title: 'text', body: 'text', 'location.area': 'text', 'location.province': 'text', 'categories': 'text' }))