const { NotFoundError } = require("errors")
const { User, Ad } = require("../../models")
const axios = require('axios')

module.exports = async function (userId) {
    const user = await User.findById(userId, '_id name email role').lean()
    if (!user) throw new NotFoundError('user not found')
    const count = await Ad.countDocuments({ user: user._id })
    const ads = await Ad.find({ user: user._id.toString() }).lean()

    const pack = { user, ads, count }

    return pack
}