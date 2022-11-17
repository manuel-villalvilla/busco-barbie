const { logFirstConnection } = require('../../logic')
const { logger } = require('../../utils')

module.exports = async function (req, res) {
    const { body: { ip, locale, country } } = req

    try {
        const res2 = await logFirstConnection(ip, locale, country)
        res2 ? res.status(201).send() : res.status(202).send()
        if (res2) logger.info('logged first connection ip' + ' ' + ip + ' ' + locale + ' ' + country)
    } catch (error) {
        res.status(500).send()
        console.log(error.message)
    }
}