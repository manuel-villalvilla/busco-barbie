const { logger, errorHandler, verifyToken } = require('../../utils')
const { updateAd } = require('../../logic')

module.exports = async function (req, res) {
    const token = req.headers.authorization.substring(7)
    let images = []
    const { body: { title, body, province, area, phone, price, categories, userId, adId, year = '', tags } } = req
    
    if (req.files) {
        if (req.files.images instanceof Array) {
            images = req.files.images
        } else {
            images = [req.files.images]
        }
    }
    try {
        const tokenUserId = await verifyToken(token)

        if (tokenUserId !== userId) {
            logger.error('userId does not match with token user id')
            res.status(401).json({ error: 'wrong credentials' })
            return
        }
        const ads = await updateAd(userId, adId, title, body, province, area, phone, price, categories, images, year, tags)
        logger.info(`user ${userId} updated ad ${adId}`)
        res.json(ads)
    } catch (error) {
        errorHandler(error, res)
        return
    }
}