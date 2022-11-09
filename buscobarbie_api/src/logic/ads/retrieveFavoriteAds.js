const { Ad } = require('../../models')
const { validateObjectId } = require('../../utils')

module.exports = async (ids) => {
    for (const id of ids) validateObjectId(id)

    const arr = []

    for (const id of ids) arr.push(await Ad.findOne({ _id: id, visibility: 'public', verified: true }).lean())

    return arr
}