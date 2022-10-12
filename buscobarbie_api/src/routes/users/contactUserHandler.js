const { contactUser } = require('../../logic')
const { logger, errorHandler } = require('../../utils')

module.exports = (req, res) => {
    try {
        const { body: { name, email, body, adUser } } = req

        contactUser(name, email, body, adUser)
            .then(() => {
                res.status(200).send()
                logger.info(`someone with email ${email} sent an email to ${adUser}`)
            })
            .catch(error => {
                logger.error(error)
                errorHandler(error, res)
                return
            })
    } catch (error) {
        logger.error(error)
        errorHandler(error, res)
    }
}