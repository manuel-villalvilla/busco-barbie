const { logFirstConnection } = require('../../logic')
const { logger } = require('../../utils')

module.exports = async function (req, res) {
    const { body: { ip, locale, country } } = req

    try {
        await logFirstConnection(ip, locale, country)
        res.send()
        logger.info('logged first connection ip')
    } catch (error) {
        res.status(500).send()
        console.log(error.message)
    }
}