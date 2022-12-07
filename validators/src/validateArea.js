const forbiddenChars = '<,>,{,},[,],/,^'
const forbiddenArray = forbiddenChars.split(',')

module.exports = function (text) {
    if (typeof text !== 'string') throw new Error('area is not a string')
    if (text.length > 50) throw new Error('area is longer than 50 chars')
    for (let i = 0; i < text.length; i++) {
        if (forbiddenArray.includes(text[i])) throw new Error ('forbidden area chars')
    }
}