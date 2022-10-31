const { formatError } = require('errors')

module.exports = function (select) {
    const options = ['unappropriate', 'falseAd', 'others']

    if (typeof select !== 'string') throw new FormatError('select not valid')
    if (!options.includes(select)) throw new FormatError('select not valid')
}