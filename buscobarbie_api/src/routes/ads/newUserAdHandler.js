const { logger, errorHandler, verifyToken } = require('../../utils')
const { newUserAd } = require('../../logic')

module.exports = async function (req, res) {
    const token = req.headers.authorization.substring(7)
    let images = []
    const { body: { title, body, province, area, phone, price, categories, id, country_code, year = '', tags } } = req

    if (req.files) {
        if (req.files.images instanceof Array) {
            images = req.files.images
        } else {
            images = [req.files.images]
        }
    }
    try {
        const tokenUserId = await verifyToken(token)

        if (tokenUserId !== id) {
            logger.error('userId does not match with token user id')
            res.status(401).json({ error: 'wrong credentials' })
            return
        }
        const ads = await newUserAd(id, country_code, title, body, province, area, phone, price, categories, images, year, tags)
        logger.info(`user ${id} created new ad`)
        res.status(201).json(ads)
    } catch (error) {
        errorHandler(error, res)
        return
    }
}