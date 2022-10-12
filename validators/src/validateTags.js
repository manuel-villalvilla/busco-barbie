const { tags: { modelos, complementos } } = require('data')
const { FormatError } = require('errors')

module.exports = function (tags) {
    if (!(tags instanceof Array)) throw new FormatError('Tags not valid')
    for (const tag of tags) {
        if (!modelos.includes(tag) && !complementos.includes(tag)) throw new FormatError('Tags not valid')
    }
}