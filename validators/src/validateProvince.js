const { areas } = require('data')
const { ES, MX, AR } = areas

module.exports = function (province) {
    if (typeof province !== 'string') throw new Error('province is not a string')
    if (province.trim().length === 0) throw new Error('province is empty or blank')
    if (!ES.includes(province) && !MX.includes(province) && !AR.includes(province)) 
        throw new Error('province not valid')
}