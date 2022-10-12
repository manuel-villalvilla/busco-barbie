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

// const axios = require('axios')
// const NAS_API = process.env.NAS_API
// const NAS_USER = process.env.NAS_USER
// const NAS_PASSWORD = process.env.NAS_PASSWORD
// const NAS_FOLDER_PATH = process.env.NAS_FOLDER_PATH

/* NAS query for API version */
    // const { data: { data: { 'SYNO.API.Auth': { maxVersion, minVersion, path } } } } = await axios.get(`${NAS_API}/query.cgi?api=SYNO.API.Info&version=1&method=query&query=all`)

    /* NAS login */
    // const { data: { data: { sid } } } = await axios.get(`${NAS_API}/${path}?api=SYNO.API.Auth&version=${maxVersion}&method=login&account=${NAS_USER}&passwd=${NAS_PASSWORD}&session=FileStation&format=sid`)

    /* NAS delete ad folder */
    // const res = await axios.get(`${NAS_API}/${path}?api=SYNO.FileStation.Delete&version=2&method=delete&path=${NAS_FOLDER_PATH}/${userId}/${adId}&_sid=${sid}`)
    // if (res.data.error) logger.error(res.data.error.errors)

    /* NAS logout */
    // await axios.get(`${NAS_API}/${path}?api=SYNO.API.Auth&version=${maxVersion}&method=logout&session=FileStation&_sid=${sid}`)