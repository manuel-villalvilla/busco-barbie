const { FormatError, SystemError, CredentialsError, NotFoundError, DuplicityError, TokenError, LimitError, GoogleError } = require('errors')
const logger = require("./logger")

module.exports = function (error, res) {
    if (error instanceof FormatError || error instanceof TypeError)
        res.status(400).json({ error: error.message })

    else if (error instanceof SystemError)
        res.status(500).json({ error: 'system error' })

    else if (error instanceof CredentialsError)
        res.status(401).json({ error: 'wrong credentials' })

    else if (error instanceof NotFoundError)
        res.status(401).json({ error: error.message })

    else if (error instanceof DuplicityError)
        res.status(409).json({ error: error.message })

    else if (error instanceof GoogleError)
        res.status(401).json({ error: error.message })

    else if (error instanceof TokenError)
        res.status(401).json({ error: error.message })

    else if (error instanceof LimitError)
        res.status(403).json({ error: error.message })

    else
        res.status(500).json({ error: 'system error' })

    logger.error(error)
}