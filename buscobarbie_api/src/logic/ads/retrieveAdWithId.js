const { validateCountry } = require('validators')
const { Ad, User } = require('../../models')
const { validateObjectId } = require('../../utils')

module.exports = function(country, adId) {
    validateCountry(country)
    validateObjectId(adId)
    return Ad.findOne({ _id: adId, visibility: 'public', verified: true }).lean()
        .then(ad => {
            if (!ad) return {}
            if (ad.location.country !== country) return {}
            return User.findById(ad.user, 'name verified').lean()
            .then(user => {
                if (!user.verified) return {}
                ad.name = user.name
                return ad
            })
        })
}