const { verify, JsonWebTokenError, NotBeforeError, TokenExpiredError } = require('jsonwebtoken')
const { TokenError, SystemError } = require('errors')
const { Blacklist } = require('../models')
const JWT_SECRET = process.env.JWT_SECRET

module.exports = async function (token) {
    try {
        const res = await Blacklist.findOne({ token })
        if (res) throw new TokenError('invalid token')
        const payload = verify(token, JWT_SECRET)
        return payload.sub
    } catch (error) {
        if (error instanceof JsonWebTokenError || error instanceof NotBeforeError || error instanceof TokenExpiredError || error instanceof TokenError)
            throw new TokenError(error.message)

        else
            throw new SystemError(error.message) // preguntar por q pasa por aqui cuando modifico la segunda parte del token
    }
}