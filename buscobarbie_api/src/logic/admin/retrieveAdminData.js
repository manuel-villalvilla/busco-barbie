const { Ad, User } = require("../../models")
const { CredentialsError } = require('errors')
const { validateObjectId } = require("../../utils")

module.exports = async function (userId) {
    validateObjectId(userId)

    const user = await User.findById(userId).lean()
    if (user.role !== 'admin') throw new CredentialsError('not authorized')

    const uAdsCount = await Ad.countDocuments({ verified: false })
    const uAds = await Ad.find({ verified: false }).sort({ createdAt: -1 }).lean()

    const uUsersCount = await User.countDocuments({ verified: false })
    const uUsers = await User.find({ verified: false }, '_id name email role').sort({ createdAt: -1 }).lean()

    return pack = { uAdsCount, uAds, uUsersCount, uUsers }
}