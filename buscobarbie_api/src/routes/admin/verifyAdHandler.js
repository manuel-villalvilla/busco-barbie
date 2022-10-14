const { verifyToken, logger, errorHandler } = require('../../utils')
const { verifyAd } = require('../../logic')

module.exports = async function (req, res) {
    try {
        const { body: { adId }} = req

        const token = req.headers.authorization.substring(7)

        const user = await verifyToken(token)

        await verifyAd(user, adId)

        res.send()
        logger.info(`ad ${adId} verified`)

    } catch (error) {
        errorHandler(error, res)
    }
}