const { verifyToken, logger, errorHandler } = require('../../utils')
const { retrieveAdminData } = require('../../logic')

module.exports = async function (req, res) {
    try {
        const token = req.headers.authorization.substring(7)
        const userId = await verifyToken(token)

        const pack = await retrieveAdminData(userId)
        res.json({ pack })
    } catch (error) {
        errorHandler(error, res)
        return
    }
}