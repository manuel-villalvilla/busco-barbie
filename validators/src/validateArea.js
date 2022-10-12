module.exports = function (text) {
    if (typeof text !== 'string') throw new Error('area is not a string')
    if (text.length > 50) throw new Error('area is longer than 50 chars')
}