const { retrieveFavoriteAds } = require('../../logic')
const { errorHandler } = require('../../utils')

module.exports = async (req, res) => {
    const { params: { ids } } = req

    try {
        const ads = await retrieveFavoriteAds(ids.split(','))
        res.status(200).json(ads)
    } catch (error) {
        errorHandler(error, res)
    }
}