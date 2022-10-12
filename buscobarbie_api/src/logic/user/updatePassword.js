const { CredentialsError, SystemError, NotFoundError } = require("errors")
const { User } = require("../../models")
const { validatePassword } = require("validators")
const { validateObjectId } = require('../../utils')
const bcrypt = require('bcryptjs')

/**
 * Updates user's password.
 * 
 * @param {string} userId The user's id.
 * @param {string} oldPassword The user's old password.
 * @param {string} newPassword The user's desired new password.
 *  
 * @returns {Promise}
 * 
 * @throws {SystemError} If an error happens in db.
 * @throws {NotFoundError} If the user's id is not found in db.
 * @throws {CredentialsError} If the user's old password doesn't match with current db password.
 * @throws {FormatError} If userId | oldPassword | newPassword are not valid.
 * @throws {TypeError} If oldPassword | newPassword are not a string.
 */

module.exports = function (userId, pass1, pass2) {
    validateObjectId(userId)
    validatePassword(pass1)
    validatePassword(pass2)

    if (pass1 !== pass2) throw new CredentialsError('passwords are different')

    return User.findById(userId)
        .catch(error => {
            throw new SystemError(error.message)
        })
        .then(user => {
            if (!user) throw new NotFoundError(`user with id ${userId} not found`)
            return bcrypt.hash(pass1, 10)
                .then(hash => {
                    user.password = hash
                    return user.save()
                })
        })
        .then(() => {})
}