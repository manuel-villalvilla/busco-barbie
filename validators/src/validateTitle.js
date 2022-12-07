const forbiddenChars = '<,>,{,},[,],/,^'
const forbiddenArray = forbiddenChars.split(',')

module.exports = function (text) {
    if (typeof text !== 'string') throw new Error('title is not a string')
    if (text.trim().length === 0) throw new Error('title is empty or blank')
    if (text.length > 30) throw new Error('title is longer than 30 chars')
    for (let i = 0; i < text.length; i++) {
        if (forbiddenArray.includes(text[i])) throw new Error ('forbidden title chars')
    }
}