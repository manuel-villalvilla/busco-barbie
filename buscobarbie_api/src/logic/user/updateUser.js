const { validateObjectId } = require('../../utils')
const { validateName, validatePassword } = require('validators')
const { User } = require('../../models')
const { NotFoundError } = require('errors')
const bcrypt = require('bcryptjs')

module.exports = async function (id, name, password) {
    validateObjectId(id)
    validateName(name)
    if (password) {
        validatePassword(password)
    
        const hash = await bcrypt.hash(password, 10)

        const user = await User.findByIdAndUpdate(id, { name, password: hash }, { new: true }).lean()

        if (!user) throw new NotFoundError('user not found')

        return user
    }

    else {
        const user = await User.findByIdAndUpdate(id, { name }, { new: true }).lean()

        if (!user) throw new NotFoundError('user not found')

        return user
    }
}