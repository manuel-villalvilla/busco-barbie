const { verifyToken, logger, errorHandler } = require('../../utils')
const { TokenError } = require('errors')
const { updateUser } = require('../../logic')

module.exports = async (req, res) => {
    const { body: { id, name, pass1, pass2 } } = req
    if (pass1 !== pass2) {
        res.status(401).send({ error: 'passwords do not match' })
        return
    }
    try {
        const token = req.headers.authorization.substring(7)
        const userId = await verifyToken(token)
        if (userId !== id) {
            res.status(401).send({ error: 'wrong credentials or token' })
            return
        }

        const user = await updateUser(id, name, pass1)
        logger.info(`user ${id} updated name and or password`)
        res.json(user)
    } catch (error) {
        logger.error(error)
        if (error instanceof TypeError) error = new TokenError(error) // por si viene del substring, cambiarlo
        errorHandler(error, res)
        return
    }
}