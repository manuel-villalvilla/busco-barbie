const jwt = require('jsonwebtoken')
const { logger, errorHandler, arrangeGoogleName } = require('../../utils')
const { authenticateGoogleUser } = require('../../logic')
const JWT_SECRET = process.env.JWT_SECRET

module.exports = async function (req, res) {
    let { body: { name, email } } = req

    name = arrangeGoogleName(name)

    try {
        const userId = await authenticateGoogleUser(name, email)
        const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '30 days' })
        res.json({ token })
        logger.info(`google user ${email} authenticated`)
    } catch (error) {
        errorHandler(error, res)
        return
    }
}