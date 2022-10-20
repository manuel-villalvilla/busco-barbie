const { NotFoundError, LimitError } = require('errors')
const { User, Ad } = require('../../models')
const { validateObjectId } = require("../../utils")
const {
    validateTitle,
    validateBody,
    validateProvince,
    validatePrice,
    validateCategories,
    validateFiles,
    validateArea,
    validateCountry,
    validatePhoneNumber,
    validateYear,
    validateTags
} = require('validators')
const fs = require('fs/promises')
require('dotenv').config()
const NAS_IMAGES_URL = process.env.NAS_IMAGES_URL

module.exports = async function (id, country_code, title, body, province, area, phone, price, categories, images, year, tags) {
    validateTitle(title)
    validateBody(body)
    validateProvince(province)
    validateArea(area)
    validatePhoneNumber(phone)
    validatePrice(price)
    validateCategories(categories)
    validateObjectId(id)
    validateCountry(country_code)
    validateYear(year)
    validateFiles(images)
    let arr = []
    if (tags.length) {
        arr = tags.split(',')
        validateTags(arr)
    }

    const user = await User.findById(id).lean()
    if (!user) throw new NotFoundError('user not found')

    const location = {
        country: country_code,
        province,
        area
    }

    const count = await Ad.countDocuments({ user: user._id })

    if (count > 9) throw new LimitError('user reached the limit of 10 ads')

    const ad = await Ad.create({ user: user._id, title, body, location, phone, price, categories, year, tags: arr })

    await fs.mkdir(`files/${id}/${ad.id.toString()}`)

    const urls = []
    if (images.length > 0) {
        /* Upload new images */
        for (let i = 0; i < images.length; i++) {
            urls.push(`${NAS_IMAGES_URL}/${id}/${ad.id.toString()}/${images[i].name}`)
            await fs.writeFile(`files/${id}/${ad.id.toString()}/${images[i].name}`, images[i].data)
        }
    }

    /* Update Ad with URLs */
    ad.image = urls

    await ad.save()

    const ads = Ad.find({ user: user._id }).lean()

    return ads
}