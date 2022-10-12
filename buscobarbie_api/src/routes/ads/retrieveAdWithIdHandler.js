const { retrieveAdWithId } = require('../../logic')
const { logger } = require('../../utils')

module.exports = (req, res) => {
    const { params: { adId }, query: { country } } = req

    try {
        retrieveAdWithId(country, adId)
            .then(ad => res.status(200).json(ad))
            .catch(error => {
                logger.error(error.message)
                res.status(500).json({ error: 'mongo system error' })
                return
            })
    } catch (error) {
        logger.error(error.message)
        res.status(401).json({ error: 'invalid ad filters' })
    }
}