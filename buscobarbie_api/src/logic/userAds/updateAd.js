const { NotFoundError, CredentialsError } = require('errors')
const { User, Ad } = require('../../models')
const path = require('path')
const { validateObjectId } = require("../../utils")
const {
    validateTitle,
    validateBody,
    validateProvince,
    validatePrice,
    validateCategories,
    validateFiles,
    validateArea,
    validatePhoneNumber,
    validateYear,
    validateTags
} = require('validators')
const NAS_IMAGES_URL = process.env.NAS_IMAGES_URL
const fs = require('fs/promises')
module.exports = async function (userId, adId, title, body, province, area, phone, price, categories, images, year, tags) {
    validateTitle(title)
    validateBody(body)
    validateProvince(province)
    validateArea(area)
    validatePhoneNumber(phone)
    validatePrice(price)
    validateCategories(categories)
    validateObjectId(userId)
    validateObjectId(adId)
    if (year) validateYear(year)
    let arr = []
    if (tags.length) {
        arr = tags.split(',')
        validateTags(arr)
    }
    if (images.length) validateFiles(images)

    const user = await User.findById(userId).lean()
    if (!user) throw new NotFoundError('user not found')

    const ad = await Ad.findById(adId)
    if (!ad) throw new NotFoundError('ad not found')
    if (ad.user.toString() !== userId) throw new CredentialsError('ad does not belong to user')

    ad.title = title
    ad.body = body
    ad.location.province = province
    ad.location.area = area
    ad.phone = phone
    ad.price = price
    ad.categories = categories
    ad.verified = false
    ad.tags = arr
    ad.year = year
    ad.modifiedAt = Date.now()

    /* Delete ad files */
    const files = await fs.readdir(`files/${userId}/${adId}/`)
    const extensions = ['.png', '.jpg', '.jpeg', '.gif']
    files.filter(async file => {
        if (extensions.includes(path.extname(file).toLowerCase()))
            await fs.unlink(`files/${userId}/${adId}/${file}`)
    })

    const urls = []
    if (images.length > 0) {
        /* Upload new images */
        for (let i = 0; i < images.length; i++) {
            urls.push(`${NAS_IMAGES_URL}/${userId}/${adId}/${images[i].name}`)
            await fs.writeFile(`files/${userId}/${adId}/${images[i].name}`, images[i].data)
        }
    }

    /* Update Ad with URLs */
    ad.image = urls

    ad.markModified('location') // sirve para q funcione el cambio en un nested object

    await ad.save()

    const ads = Ad.find({ user: user._id }).lean()

    return ads
}

// const NAS_API = process.env.NAS_API
// const NAS_USER = process.env.NAS_USER
// const NAS_PASSWORD = process.env.NAS_PASSWORD
// const NAS_FOLDER_PATH = process.env.NAS_FOLDER_PATH
// const axios = require('axios')
// const FormData = require('form-data')

/* NAS query for API version */
    // const { data: { data: { 'SYNO.API.Auth': { maxVersion, minVersion, path } } } } = await axios.get(`${NAS_API}/query.cgi?api=SYNO.API.Info&version=1&method=query&query=all`)

/* NAS login */
    // const { data: { data: { sid } } } = await axios.get(`${NAS_API}/${path}?api=SYNO.API.Auth&version=${maxVersion}&method=login&account=${NAS_USER}&passwd=${NAS_PASSWORD}&session=FileStation&format=sid`)

/* NAS list ad files */
    // const { data: { data: { files } } } = await axios.get(`${NAS_API}/${path}?api=SYNO.FileStation.List&version=2&method=list&folder_path=${NAS_FOLDER_PATH}/${userId}/${adId}&_sid=${sid}`)

/* NAS delete ad files */
    // for (let i = 0; i < files.length; i++) {
    //     const res = await axios.get(`${NAS_API}/${path}?api=SYNO.FileStation.Delete&version=2&method=delete&path=${NAS_FOLDER_PATH}/${userId}/${adId}/${files[i].name}&_sid=${sid}`)
    //     if (res.data.error) logger.error(res.data.error.errors)
    // }

/* Upload new images */
    // const form = new FormData()
    // form.append('api', 'SYNO.FileStation.Upload')
    // form.append('version', '2')
    // form.append('method', 'upload')
    // form.append('path', `${NAS_FOLDER_PATH}/${userId}/${adId}`)
    // form.append('_sid', sid)
    // form.append('file', images[i].data, { 'filename': images[i].name })
    // await axios.post(`${NAS_API}/${path}/?_sid=${sid}`, form)

/* NAS logout */
    // await axios.get(`${NAS_API}/${path}?api=SYNO.API.Auth&version=${maxVersion}&method=logout&session=FileStation&_sid=${sid}`)