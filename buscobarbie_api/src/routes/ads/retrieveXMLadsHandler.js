const { retrieveXMLads } = require("../../logic")
const { logger, errorHandler } = require('../../utils')

module.exports = async function (req, res) {
    const { params: { country } } = req

    try {
        const adsIds = await retrieveXMLads(country)
        res.status(200).json(adsIds)
        logger.info('retrieved XML ads')
    } catch (error) {
        errorHandler(error, res)
    }
}