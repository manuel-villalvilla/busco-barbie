const { NotFoundError, CredentialsError } = require('errors')
const { User } = require('../../models')
const { validateObjectId } = require('../../utils')

module.exports = function (id) {
    validateObjectId(id)

    return User.findById(id).lean()
        .then(user => {
            if (!user) throw new NotFoundError('user not found')
            if (user.verified === true) throw new CredentialsError('user already verified')
            return User.updateOne({ _id: id }, { $set: { verified: true } })
        })
}