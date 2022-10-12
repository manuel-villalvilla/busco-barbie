const { validateVisibility } = require('validators')
const { User, Ad } = require('../../models')
const { validateObjectId } = require('../../utils')
const { NotFoundError, CredentialsError } = require('errors')

module.exports = async function (visibility, userId, adId) {
    validateVisibility(visibility)
    validateObjectId(userId)
    validateObjectId(adId)

    const user = await User.findById(userId).lean()
    if (!user) throw new NotFoundError('user not found')

    const ad = await Ad.findById(adId).lean()
    if (!ad) throw new NotFoundError('ad not found')

    if (userId !== ad.user.toString()) throw new CredentialsError('ad does not belong to user')

    await Ad.updateOne({ _id: adId }, { $set: { visibility } })

    return await Ad.find({ user: userId }).lean()
}