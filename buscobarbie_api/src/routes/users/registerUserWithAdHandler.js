const { registerUserWithAd } = require('../../logic')
const { logger, errorHandler } = require('../../utils')

module.exports = (req, res) => {
    let images = []
    const { body: { title, body, province, area, phone, price, categories, name, email, password, country_code, year = '', tags } } = req
    
    if (req.files) {
        if (req.files.images instanceof Array) {
            images = req.files.images
        } else {
            images = [req.files.images]
        }
    }
    try {
        registerUserWithAd(country_code, name, email, password, title, body, province, area, phone, price, categories, images, year, tags)
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