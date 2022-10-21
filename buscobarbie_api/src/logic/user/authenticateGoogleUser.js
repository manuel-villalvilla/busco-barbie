const { validateEmail } = require('validators')
const { User } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const filesFolder = join(__dirname, '../../../files')
const charsString = 'abcdefghijklmnñopqrstuvwxyzáéíóúÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890!@#$%^&*'
const chars = charsString.split('')

module.exports = async function (name, email) {
    validateEmail(email)

    let user = await User.findOne({ email }).lean()
    if (user) return user._id

    let password = ''

    for (let i = 0; i < 8; i++) {
        password += chars[Math.floor(Math.random() * chars.length)]
    }

    const hash = await bcrypt.hash(password, 10)

    user = await User.create({ name, email, role: 'google', password: hash, verified: true })

    await fs.mkdir(`${filesFolder}/${user.id.toString()}`, { recursive: true })

    return user.id
}