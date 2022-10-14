const { verifyToken, logger, errorHandler } = require('../../utils')
const { adminDeleteAd } = require('../../logic')

module.exports = async function (req, res) {
    try {
        const { body: { adId }} = req
        
        const token = req.headers.authorization.substring(7)

        const user = await verifyToken(token)

        await adminDeleteAd(user, adId)

        res.send()
        logger.info(`ad ${adId} deleted because unverified`)

    } catch (error) {
        errorHandler(error, res)
    }
}