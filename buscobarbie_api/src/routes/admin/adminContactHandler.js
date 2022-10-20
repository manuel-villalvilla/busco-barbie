const { errorHandler, logger } = require("../../utils")
const { adminContact } = require('../../logic')

module.exports = async function (req, res) {
    const { body: { payload: { name, email, option, message } } } = req

    try {
        await adminContact(name, email, option, message)
        res.send()
        logger.info(`user ${email} contacted admin`)
    } catch (error) {
        errorHandler(error, res)
    }
}