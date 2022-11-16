const { registerUserWithAd } = require('../../logic')
const { logger, errorHandler } = require('../../utils')

module.exports = (req, res) => {
    let images = []
    const { body: { title, body, province, area, phone, price, categories, name, email, password, country_code, year = '', tags } } = req

    const price2 = {
        number: !isNaN(price.split(',')[0]) ? price.split(',')[0] : null,
        negotiable: price.split(',')[1] === 'true' ? true : price.split(',')[1] === 'false' ? false : null
    }

    if (req.files) {
        if (req.files.images instanceof Array) {
            images = req.files.images
        } else {
            images = [req.files.images]
        }
    }

    try {
        registerUserWithAd(country_code, name, email, password, title, body, province, area, phone, price2, categories, images, year, tags)
            .then(() => {
                res.status(201).send()
                logger.info(`user ${email} registered`)
            })
            .catch(error => {
                errorHandler(error, res)
                return
            })
    } catch (error) {
        errorHandler(error, res)
    }
}