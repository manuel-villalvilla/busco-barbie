const { FirstConnection } = require('../../models')

module.exports = async function (ip, locale, country) {
    // TODO VALIDATE INPUTS

    const connection = await FirstConnection.findOne({ ip })

    if (connection) return false

    await FirstConnection.create({ ip, locale, country })

    return true
}