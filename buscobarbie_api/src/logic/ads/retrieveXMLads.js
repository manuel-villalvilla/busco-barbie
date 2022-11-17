const { validateCountry } = require('validators')
const { Ad } = require('../../models')

module.exports = async function (country) {
    validateCountry(country)

    const adsIds = await Ad.find({ ['location.country']: country, verified: true, visibility: 'public' }, '_id').lean()

    const arr = []
    for (const adId of adsIds) arr.push(adId._id.toString())

    return arr
}