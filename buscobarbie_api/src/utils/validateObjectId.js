const { Types: { ObjectId: { isValid } } } = require('mongoose')
const { FormatError } = require('errors')

module.exports = function(id) {
    if (!isValid(id)) throw new FormatError('id not valid')
}