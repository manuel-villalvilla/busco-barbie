const { FormatError } = require('errors')

module.exports = function (text, explain = 'text') {
    if (typeof text !== 'string') throw new TypeError(`${explain} is not a string`)
    if (text.trim().length === 0) throw new FormatError(`${explain} is empty or blank`)
}