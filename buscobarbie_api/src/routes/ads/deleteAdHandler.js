const { logger, errorHandler, verifyToken } = require('../../utils')
const { deleteAd } = require('../../logic')

module.exports = async function (req, res) {
    const token = req.headers.authorization.substring(7)
    const { body: { userId, adId } } = req
    
    try {
        const tokenUserId = await verifyToken(token)
        
        if (tokenUserId !== userId) {
            logger.error('userId does not match with token user id')
            res.status(401).json({ error: 'wrong credentials' })
            return
        }
        const ads = await deleteAd(userId, adId)
        logger.info(`user ${userId} deleted Ad ${adId}`)
        res.json(ads)
    } catch (error) {
        errorHandler(error, res)
        return
    }
}