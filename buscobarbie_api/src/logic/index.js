module.exports = {
    authenticateUser: require('./user/authenticateUser'),
    registerUserWithAd: require('./user/registerUserWithAd'),
    updatePassword: require('./user/updatePassword'),
    updateAd: require('./userAds/updateAd'),
    deleteAd: require('./userAds/deleteAd'),
    retrieveFilteredAds: require('./ads/retrieveFilteredAds'),
    retrieveAdWithId: require('./ads/retrieveAdWithId'),
    contactUser: require('./user/contactUser'),
    verifyUser: require('./user/verifyUser'),
    retrieveUserWithAds: require('./userAds/retrieveUserWithAds'),
    updateAd: require('./userAds/updateAd'),
    recoverPassword: require('./user/recoverPassword'),
    updateUser: require('./user/updateUser'),
    newUserAd: require('./userAds/newUserAd'),
    updateAdVisibility: require('./userAds/updateAdVisibility'),
    authenticateGoogleUser: require('./user/authenticateGoogleUser')
}