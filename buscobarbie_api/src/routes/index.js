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
    updateAdVisibilityHandler
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
    authenticateGoogleUserHandler
} = require('./users')
const { verifyGoogleCaptchaHandler } = require('./utils')

const adsRouter = Router()

adsRouter.get('/ads', retrieveAdsHandler)

adsRouter.get('/ads/:adId', retrieveAdWithIdHandler)

adsRouter.delete('/ads', jsonBodyParser, deleteAdHandler)

adsRouter.patch('/ads', fileupload(), bodyParser.json(), bodyParser.urlencoded({ extended: false }), updateAdHandler)

adsRouter.patch('/ads/visibility', jsonBodyParser, updateAdVisibilityHandler)

adsRouter.post('/ads', fileupload(), bodyParser.json(), bodyParser.urlencoded({ extended: false }), newUserAdHandler)

const usersRouter = Router()

usersRouter.post('/users/recovery', jsonBodyParser, recoverPasswordHandler)

usersRouter.post('/users/google', jsonBodyParser, authenticateGoogleUserHandler)

usersRouter.post('/users/auth', jsonBodyParser, authenticateUserHandler)

usersRouter.patch('/users/auth', jsonBodyParser, updateUserHandler)

usersRouter.post('/users/contact', jsonBodyParser, contactUserHandler)

usersRouter.post('/users', fileupload(), bodyParser.json(), bodyParser.urlencoded({ extended: false }), registerUserWithAdHandler)

usersRouter.patch('/users', jsonBodyParser, verifyUserHandler)

usersRouter.get('/users', jsonBodyParser, retrieveUserWithAdsHandler)

usersRouter.post('/users/pass', jsonBodyParser, updatePasswordHandler)

const utilsRouter = Router()

utilsRouter.post('/utils', jsonBodyParser, verifyGoogleCaptchaHandler)

module.exports = {
    adsRouter,
    usersRouter,
    utilsRouter
}