const express = require('express')
const bodyParser = require('body-parser')
const fileupload = require('express-fileupload')
const { Router, json } = express
const jsonBodyParser = json()
const {
    retrieveAdsHandler,
    retrieveAdWithIdHandler,
    deleteAdHandler,
    updateAdHandler,
    newUserAdHandler,
    updateAdVisibilityHandler,
    reportAdHandler,
    retrieveFavoriteAdsHandler
} = require('./ads')
const {
    authenticateUserHandler,
    contactUserHandler,
    registerUserWithAdHandler,
    verifyUserHandler,
    retrieveUserWithAdsHandler,
    recoverPasswordHandler,
    updatePasswordHandler,
    updateUserHandler,
    authenticateGoogleUserHandler,
    deleteUserHandler
} = require('./users')
const {
    retrieveAdminDataHandler,
    verifyAdHandler,
    adminDeleteAdHandler,
    adminContactHandler,
    logFirstConnectionHandler,
} = require('./admin')
const { verifyGoogleCaptchaHandler } = require('./utils')

const adsRouter = Router()

adsRouter.get('/ads', retrieveAdsHandler)

adsRouter.get('/ads/:adId', retrieveAdWithIdHandler)

adsRouter.get('/ads/favorites/:ids', retrieveFavoriteAdsHandler)

adsRouter.delete('/ads', jsonBodyParser, deleteAdHandler)

adsRouter.patch('/ads', fileupload(), bodyParser.json(), bodyParser.urlencoded({ extended: false }), updateAdHandler)

adsRouter.patch('/ads/visibility', jsonBodyParser, updateAdVisibilityHandler)

adsRouter.post('/ads/report', jsonBodyParser, reportAdHandler)

adsRouter.post('/ads', fileupload(), bodyParser.json(), bodyParser.urlencoded({ extended: false }), newUserAdHandler)

const usersRouter = Router()

usersRouter.post('/users/recovery', jsonBodyParser, recoverPasswordHandler)

usersRouter.post('/users/google', jsonBodyParser, authenticateGoogleUserHandler)

usersRouter.post('/users/auth', jsonBodyParser, authenticateUserHandler)

usersRouter.patch('/users/auth', jsonBodyParser, updateUserHandler)

usersRouter.post('/users/contact', jsonBodyParser, contactUserHandler)

usersRouter.post('/users', fileupload(), bodyParser.json(), bodyParser.urlencoded({ extended: false }), registerUserWithAdHandler)

usersRouter.patch('/users', jsonBodyParser, verifyUserHandler)

usersRouter.get('/users', retrieveUserWithAdsHandler)

usersRouter.post('/users/pass', jsonBodyParser, updatePasswordHandler)

usersRouter.delete('/users', jsonBodyParser, deleteUserHandler)

const utilsRouter = Router()

utilsRouter.post('/utils', jsonBodyParser, verifyGoogleCaptchaHandler)

const adminRouter = Router()

adminRouter.get('/admin', retrieveAdminDataHandler)

adminRouter.patch('/admin/ads', jsonBodyParser, verifyAdHandler)

adminRouter.delete('/admin/ads', jsonBodyParser, adminDeleteAdHandler)

adminRouter.post('/admin', jsonBodyParser, adminContactHandler)

adminRouter.post('/admin/connection', jsonBodyParser, logFirstConnectionHandler)

module.exports = {
    adsRouter,
    usersRouter,
    utilsRouter,
    adminRouter
}