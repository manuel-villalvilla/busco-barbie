const { verifyToken, errorHandler } = require('../../utils')
const { retrieveUserWithAds } = require('../../logic')

module.exports = async function (req, res) {
    const token = req.headers.authorization.substring(7)

    try {
        const userId = await verifyToken(token)
        const pack = await retrieveUserWithAds(userId)
        res.json(pack)
    } catch (error) {
        errorHandler(error, res)
        return
    }
}