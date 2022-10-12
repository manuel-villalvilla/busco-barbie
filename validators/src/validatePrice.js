module.exports = function (price) {
    if (isNaN(price)) throw new Error('price is not a number')
    if (price.trim().length === 0) throw new Error('price is empty')
    if (price.length > 4) throw new Error('price over 4 digits')
}