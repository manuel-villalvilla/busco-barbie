const { recoverPassword } = require('../../logic')
const { logger } = require('../../utils')

module.exports = async function (req, res) {
    const { body: { email } } = req

    try {
        await recoverPassword(email)
        logger.info(`user with email ${email} is trying to recover password`)
        res.send()
    } catch (error) {
        logger.error(error)
        res.status(401).send()
    }
}