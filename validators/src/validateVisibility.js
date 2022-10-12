const { FormatError } = require('errors')

module.exports = function (visibility) {
    if (typeof visibility !== 'string') throw new TypeError('visibility is not a string')
    if (visibility.trim().length === 0) throw new FormatError('visibility must not be empty')
    if (visibility !== 'public' && visibility !== 'private') throw new Error('visibility not valid')
}