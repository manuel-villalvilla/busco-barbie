const forbiddenChars = '<,>,{,},[,],/,^'
const forbiddenArray = forbiddenChars.split(',')

module.exports = function (text) {
    if (typeof text !== 'string') throw new Error('body is not a string')
    if (text.trim().length === 0) throw new Error('body is empty or blank')
    if (text.length > 500) throw new Error('body is longer than 500 chars')
    for (let i = 0; i < text.length; i++) {
        if (forbiddenArray.includes(text[i])) throw new Error ('forbidden body chars')
    }
}