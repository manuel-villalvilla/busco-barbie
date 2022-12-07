const { FormatError } = require('errors')
const forbiddenChars = '<,>,{,},[,],/,^'
const forbiddenArray = forbiddenChars.split(',')

module.exports = function (text, explain = 'text') {
    if (typeof text !== 'string') throw new TypeError(`${explain} is not a string`)
    if (text.trim().length === 0) throw new FormatError(`${explain} is empty or blank`)
    for (let i = 0; i < text.length; i++) {
        if (forbiddenArray.includes(text[i])) throw new Error ('forbidden text chars')
    }
}