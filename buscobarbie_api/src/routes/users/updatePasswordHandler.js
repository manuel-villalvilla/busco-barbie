const { verifyToken, logger, errorHandler } = require('../../utils')
const { TokenError } = require('errors')
const { updatePassword } = require('../../logic')

module.exports = async (req, res) => {
    const { body: { pass1, pass2, id } } = req
    try {
        const token = req.headers.authorization.substring(7)
        const userId = await verifyToken(token)
        if (userId !== id) {
            res.status(401).send({ error: 'wrong credentials or token' })
            return
        }

        await updatePassword(id, pass1, pass2)
        logger.info(`user ${id} updated password`)
        res.status(204).send()
    } catch (error) {
        logger.error(error)
        if (error instanceof TypeError) error = new TokenError(error) // por si viene del substring, cambiarlo
        errorHandler(error, res)
        return
    }
}