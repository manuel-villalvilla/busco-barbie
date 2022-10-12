module.exports = function (country) {
    const countries = ['AR', 'MX', 'ES', 'US']

    if (!countries.includes(country)) throw new Error('invalid country')
}