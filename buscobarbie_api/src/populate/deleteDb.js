require('dotenv').config()
const { env: { MONGO_URL } } = process
const { User, Ad } = require('../models')
const { connect, disconnect } = require('mongoose');

(async () => {
    await connect(MONGO_URL)

    await Promise.all([User.deleteMany(), Ad.deleteMany()])

    console.log('Db deleted')

    await disconnect()
})()



