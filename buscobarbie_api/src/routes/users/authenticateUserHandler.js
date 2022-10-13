const { authenticateUser } = require('../../logic')
const jwt = require('jsonwebtoken')
const { logger, errorHandler } = require('../../utils')
const JWT_SECRET = process.env.JWT_SECRET

module.exports = (req, res) => {
    try {
        const { body: { email, password } } = req

        authenticateUser(email, password)
            .then(data => {
                const token = jwt.sign({ sub: data.id }, JWT_SECRET, { expiresIn: '30 days' })
                res.json({ token, role: data.role })
                logger.info(`user ${email} authenticated`)
            })
            .catch(error => {
                errorHandler(error, res)
                return
            })
    } catch (error) {
        errorHandler(error, res)
    }
}