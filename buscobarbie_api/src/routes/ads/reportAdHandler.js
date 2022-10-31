const { errorHandler, logger } = require("../../utils")
const { reportAd } = require('../../logic')
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL

module.exports = async function (req, res) {
    const { body: { select, body, adId } } = req

    try {
        const result = await reportAd(select, body, adId)
        if (result.accepted[0] === SUPPORT_EMAIL) {
            res.send()
            logger.info(`Anuncio con id ${adId} reportado`)
        }
        else res.status(500).send()

    } catch (error) {
        errorHandler(error, res)
    }
}