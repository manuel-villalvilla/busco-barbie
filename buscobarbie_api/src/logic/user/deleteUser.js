const { validateObjectId } = require("../../utils")
const { User, Ad } = require('../../models')
const { MongoError, NotFoundError } = require('errors')
const fs = require('fs/promises')

module.exports = async function (userId) {
    validateObjectId(userId)

    const user = await User.findById(userId).lean()
    if (!user) throw new NotFoundError('user not found')

    await Ad.deleteMany({ user: user._id })

    const ads = await Ad.countDocuments({ user: user._id })
    if (ads > 0) throw new MongoError('not all ads were deleted')

    await User.deleteOne({ _id: userId })

    const user2 = await User.countDocuments({ _id: userId })
    if (user2 > 0) throw new MongoError('user not deleted')

    await fs.rm(`files/${userId}`, { recursive: true, force: true })
}