const { CredentialsError, NotFoundError } = require("errors")
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
 * @throws {NotFoundError} If the user's id is not found in db.
 * @throws {CredentialsError} If the user's old password doesn't match with current db password.
 * @throws {FormatError} If userId | oldPassword | newPassword are not valid.
 * @throws {TypeError} If oldPassword | newPassword are not a string.
 */

module.exports = async function (userId, pass1, pass2) {
    validateObjectId(userId)
    validatePassword(pass1)
    validatePassword(pass2)

    if (pass1 !== pass2) throw new CredentialsError('passwords are different')

    const user = await User.findById(userId)

    if (!user) throw new NotFoundError(`user with id ${userId} not found`)

    const hash = await bcrypt.hash(pass1, 10)

    user.password = hash
    await user.save()
}