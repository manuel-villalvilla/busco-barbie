const { logger, errorHandler, verifyToken } = require('../../utils')
const { deleteUser } = require('../../logic')

module.exports = async function (req, res) {
    const token = req.headers.authorization.substring(7)
    const { body: { userId } } = req
    
    try {
        const tokenUserId = await verifyToken(token)
        
        if (tokenUserId !== userId) {
            logger.error('userId does not match with token user id')
            res.status(401).json({ error: 'wrong credentials' })
            return
        }

        await deleteUser(userId)
        logger.info(`user ${userId} deleted account`)
        res.send()
    } catch (error) {
        errorHandler(error, res)
        return
    }
}