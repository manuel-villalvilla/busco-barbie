const { logger, errorHandler, verifyToken } = require('../../utils')
const { updateAdVisibility } = require('../../logic')
const { TokenError } = require('errors')

module.exports = async function (req, res) {
    const { body: { visibility, userId, adId } } = req

    try {
        const token = req.headers.authorization.substring(7)
        const id = await verifyToken(token)
        if (userId !== id) {
            res.status(401).send({ error: 'wrong credentials or token' })
            return
        }

        const ads = await updateAdVisibility(visibility, userId, adId)
        logger.info(`user ${id} updated ad ${adId} visibility to ${visibility}`)
        res.json(ads)
    } catch (error) {
        if (error instanceof TypeError) error = new TokenError(error) // por si viene del substring, cambiarlo
        errorHandler(error, res)
        return
    }
}