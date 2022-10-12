const { FormatError } = require('errors')
const charsString = 'abcdefghijklmnñopqrstuvwxyzáéíóúÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890!@#$%^&*'
const chars = charsString.split('')

module.exports = function (password) {
    if (typeof password !== 'string') throw new TypeError('password is not a string')
    if (password.trim().length === 0) throw new FormatError('password is empty or blank')
    if (password.length < 8) throw new FormatError('password length is less than 8 characters')
    if (password.length > 20) throw new FormatError('password is longer than 20 characters')
    for (const letter of password)
        if (!chars.includes(letter)) throw new FormatError('password chars not valid')
}