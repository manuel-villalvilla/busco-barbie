module.exports = function (text) {
    if (typeof text !== 'string') throw new Error('title is not a string')
    if (text.trim().length === 0) throw new Error('title is empty or blank')
    if (text.length > 30) throw new Error('title is longer than 30 chars')
}