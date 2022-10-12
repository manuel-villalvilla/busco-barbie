const { FormatError } = require('errors')
const EMAIL_REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

module.exports =  function (email) {
    if (typeof email !== 'string') throw new TypeError('email is not a string')
    if (email.trim().length === 0) throw new FormatError('email is empty or blank')
    if (email.length < 6) throw new FormatError('email length is not valid')
    if (!EMAIL_REGEX.test(email)) throw new FormatError('email is not valid')
}