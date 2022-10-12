const axios = require('axios')
const { logger } = require('../../utils')

module.exports = async (req, res) => {
    const token = req.headers.authorization.substring(7)

    if (token.length === 0) {
        logger.error('empty token arriving to API')
        res.send('robot')
        return
    }

    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`)

    const { data: { success } } = response
    
    if (success) res.send('human')
    else {
        logger.error('recaptcha not passed by google')
        res.send('robot')
    }
}