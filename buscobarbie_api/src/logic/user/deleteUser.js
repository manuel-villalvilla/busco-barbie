const { validateObjectId } = require("../../utils")
const { User, Ad } = require('../../models')
const { NotFoundError } = require('errors')
const fs = require('fs/promises')

module.exports = async function (userId) {
    validateObjectId(userId)

    const user = await User.findById(userId).lean()
    if (!user) throw new NotFoundError('user not found')

    await Ad.deleteMany({ user: user._id })

    await User.deleteOne({ _id: userId })

    await fs.rm(`files/${userId}`, { recursive: true, force: true })
}