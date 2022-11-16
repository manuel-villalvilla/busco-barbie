require('dotenv').config()
const { env: { MONGO_URL, ADMIN_EMAIL, ADMIN_PASSWORD } } = process
const { User, Ad, FirstConnection } = require('../models')
const { connect, disconnect } = require('mongoose')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path');

(async () => {
    await connect(MONGO_URL)

    await Promise.all([User.deleteMany(), Ad.deleteMany(), FirstConnection.deleteMany()])

    console.log('Db deleted')

    const folder = join(__dirname, '../../files')
    const populateFolder = join(__dirname, '/')

    await fs.rm(folder, { recursive: true, force: true })
    console.log('Deleted files and folders')

    await fs.mkdir(folder, { recursive: true })

    await fs.copyFile(`${populateFolder}logo4.png`, `${folder}/logo4.png`)
    console.log('Logo copied')

    /* Create admin user */

    const adminPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)

    await User.create({ name: 'admin', email: ADMIN_EMAIL, password: adminPassword, role: 'admin', verified: true })

    console.log('admin user created')

    await disconnect()
})()



