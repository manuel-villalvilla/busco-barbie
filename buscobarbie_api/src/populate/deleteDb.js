require('dotenv').config()
const { env: { MONGO_URL } } = process
const { User, Ad, FirstConnection } = require('../models')
const { connect, disconnect } = require('mongoose');

(async () => {
    await connect(MONGO_URL)

    await Promise.all([User.deleteMany(), Ad.deleteMany(), FirstConnection.deleteMany()])

    console.log('Db deleted')

    await disconnect()
})()



