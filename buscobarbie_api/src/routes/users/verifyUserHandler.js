const { verifyToken, logger, errorHandler } = require('../../utils')
const { TokenError } = require('errors')
const { verifyUser } = require('../../logic')
const { Blacklist } = require('../../models')

module.exports = (req, res) => {
    const { body: { id, token } } = req

    try {
        verifyToken(token)
            .then(userId => {
                if (userId !== id) throw new TokenError('token does not match with user')
                verifyUser(userId)
                    .then(() => {
                        res.status(204).send()
                        logger.info(`user ${userId} verified`)
                    })
                    .catch(error => errorHandler(error, res))
            }
            )
            .catch(error => errorHandler(error, res))
    } catch (error) {
        if (error instanceof TypeError) error = new TokenError(error) // por si viene del substring, cambiarlo
        errorHandler(error, res)
        return
    }
}