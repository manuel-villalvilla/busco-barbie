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
const fs = require('fs/promises')
require('dotenv').config()
const NAS_IMAGES_URL = process.env.NAS_IMAGES_URL

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
    validateYear(year)
    let arr = []
    if (tags.length) {
        arr = tags.split(',')
        validateTags(arr)
    }
    validateFiles(images)

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

    ad.markModified('location')

    await ad.save()

    const ads = Ad.find({ user: user._id }).lean()

    return ads
}