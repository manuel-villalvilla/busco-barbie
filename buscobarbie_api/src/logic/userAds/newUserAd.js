const { NotFoundError, LimitError } = require('errors')
const { User, Ad } = require('../../models')
const { logger } = require('../../utils')
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
const NAS_IMAGES_URL = process.env.NAS_IMAGES_URL
const fs = require('fs/promises')
module.exports = async function (id, country_code, title, body, province, area, phone, price, categories, images, year, tags) {
    console.log(tags)
    validateTitle(title)
    validateBody(body)
    validateProvince(province)
    validateArea(area)
    validatePhoneNumber(phone)
    validatePrice(price)
    validateCategories(categories)
    validateObjectId(id)
    validateCountry(country_code)
    if (year) validateYear(year)
    let arr = []
    if (tags.length) {
        arr = tags.split(',')
        validateTags(arr)
    }
    if (images.length) validateFiles(images)

    const user = await User.findById(id).lean()
    if (!user) throw new NotFoundError('user not found')

    const location = {
        country: country_code,
        province,
        area
    }

    const count = await Ad.countDocuments({ user: user._id })

    if (count > 10) throw new LimitError('user reached the limit of 10 ads')

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

// const axios = require('axios')
// const FormData = require('form-data')
// const NAS_API = process.env.NAS_API
// const NAS_USER = process.env.NAS_USER
// const NAS_PASSWORD = process.env.NAS_PASSWORD
// const NAS_FOLDER_PATH = process.env.NAS_FOLDER_PATH

/* NAS query for API version */
    // const { data: { data: { 'SYNO.API.Auth': { maxVersion, minVersion, path } } } } = await axios.get(`${NAS_API}/query.cgi?api=SYNO.API.Info&version=1&method=query&query=all`)

/* NAS login */
    // const { data: { data: { sid } } } = await axios.get(`${NAS_API}/${path}?api=SYNO.API.Auth&version=${maxVersion}&method=login&account=${NAS_USER}&passwd=${NAS_PASSWORD}&session=FileStation&format=sid`)

/* Create NAS new ad folder */
    // await axios.get(`${NAS_API}/${path}?api=SYNO.FileStation.CreateFolder&version=2&method=create&folder_path=["${NAS_FOLDER_PATH}/${user._id.toString()}"]&name=["${ad.id.toString()}"]&_sid=${sid}`)

/* Upload new images */
    // const form = new FormData()
    // form.append('api', 'SYNO.FileStation.Upload')
    // form.append('version', '2')
    // form.append('method', 'upload')
    // form.append('path', `${NAS_FOLDER_PATH}/${id}/${ad.id.toString()}`)
    // form.append('_sid', sid)
    // form.append('file', images[i].data, { 'filename': images[i].name })
    // await axios.post(`${NAS_API}/${path}/?_sid=${sid}`, form)

/* NAS logout */
    // await axios.get(`${NAS_API}/${path}?api=SYNO.API.Auth&version=${maxVersion}&method=logout&session=FileStation&_sid=${sid}`)