const { NotFoundError, SystemError } = require("errors")
const { User, Ad } = require("../../models")
const { validateObjectId } = require("../../utils")
const fs = require('fs/promises')

module.exports = async function (userId, adId) {
    validateObjectId(userId)
    validateObjectId(adId)

    const user = await User.findById(userId).lean()
    if (!user) throw new NotFoundError('user not found')

    const userAds1 = await Ad.find({ user: user._id }).lean()
    const count1 = userAds1.length

    for (let i = 0; i < userAds1.length; i++) {
        if (userAds1[i]._id.toString() === adId) {
            await Ad.deleteOne({ _id: adId })
            await fs.rm(`files/${userId}/${adId}`, { recursive: true, force: true })
        }
    }

    const userAds2 = await Ad.find({ user: user._id }).lean()
    const count2 = userAds2.length

    if (count2 !== count1 - 1)
        throw new SystemError('new ads count do not match')

    return userAds2
}