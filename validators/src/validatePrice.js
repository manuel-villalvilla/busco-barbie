module.exports = function (price) {
    if (isNaN(price.number)) throw new Error('price is not a number')
    if (price.number.length === 0) throw new Error('price is empty')
    if (price.number.length > 4) throw new Error('price over 4 digits')
    if (typeof price.negotiable !== 'boolean') throw new Error('negotiable format not valid')
}