const { CredentialsError, NotFoundError, SystemError, GoogleError, VerificationError } = require('errors')
const { validateEmail, validatePassword } = require('validators')
const { User } = require('../../models')
const bcrypt = require('bcryptjs')

/**
 * Authenticates a user.
 * 
 * @param {string} email The user email.
 * @param {string} password The user password.
 *  
 * @returns {Promise}
 * 
 * @throws {SystemError} If an error happens in db.
 * @throws {NotFoundError} If the user is not found.
 * @throws {FormatError} If the email | password format is not valid.
 * @throws {TypeError} If the email | password are not strings.
 */

module.exports = function (email, password) {
    validateEmail(email)
    validatePassword(password)

    return User.findOne({ email }).lean()
        .catch(error => {
            throw new SystemError(error.message)
        })
        .then(user => {
            if (!user) throw new NotFoundError(`not found or unverified user`)
            if (user.role === 'google') throw new GoogleError('unauthorized google account sign in')
            if (user.verified === false) throw new VerificationError('unverified user')

            return bcrypt.compare(password, user.password)
                .then(status => {
                    if (!status) throw new CredentialsError('email or password incorrect')
                    return { id: user._id.toString(), role: user.role } // como lo he traido como un pojo con lean, tengo q extraer
                    // el id con _id y como es un objeto, convertirlo a string
                })
        })
}