const { FormatError } = require('errors')
const str = '1234567890-+()'
const chars = str.split('')

module.exports = function (phone) {
    if (typeof phone !== 'string') throw new FormatError('phone is not a string')
    if (phone.length > 20) throw new FormatError('phone cannot be over 20 chars')
    if (phone.length > 0 && phone.length < 6) throw new FormatError('phone number must be min 6 chars long')
    for (let i = 0; i < phone.length; i++) {
        if (!chars.includes(phone[i])) throw new FormatError('phone characters not valid')
    }
}