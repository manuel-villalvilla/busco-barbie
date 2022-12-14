const { years } = require('data')
const { FormatError } = require('errors')

module.exports = function (year) {
    if (typeof year !== 'string') throw new FormatError('Year not valid')
    if (year.length && !years.includes(year)) throw new FormatError('Year not valid')
}