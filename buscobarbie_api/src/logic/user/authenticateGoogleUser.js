const { validateEmail } = require('validators')
const { User } = require('../../models')
const bcrypt = require('bcryptjs')
const charsString = 'abcdefghijklmnñopqrstuvwxyzáéíóúÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890!@#$%^&*'
const chars = charsString.split('')

module.exports = async function (name, email) {
    validateEmail(email)

    let user = await User.findOne({ email, role: 'google' }).lean()
    if (user) return user._id

    let password = ''

    for (let i = 0; i < 8; i++) {
        password += chars[Math.floor(Math.random() * chars.length)]
    }

    const hash = await bcrypt.hash(password, 10)

    user = await User.create({ name, email, role: 'google', password: hash, verified: true })

    return user.id
}