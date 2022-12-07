const forbiddenChars = '<,>,{,},[,],/,^'
const forbiddenArray = forbiddenChars.split(',')

module.exports = function (text) {
    if (typeof text !== 'string') throw new Error('name is not a string')
    if (text.trim().length === 0) throw new Error('name is empty or blank')
    if (text.length > 20) throw new Error('name is longer than 20 chars')
    for (let i = 0; i < text.length; i++) {
        if (forbiddenArray.includes(text[i])) throw new Error ('forbidden name chars')
    }
}