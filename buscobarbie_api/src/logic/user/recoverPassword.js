const { validateEmail } = require('validators')
const { User } = require('../../models')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD = process.env.SMTP_PASSWORD
const APP_URL = process.env.APP_URL
const JWT_SECRET = process.env.JWT_SECRET

module.exports = async function (email) {
    validateEmail(email)

    const user = await User.findOne({ email }).lean()

    if (user) {
        /* Send password recovery email */
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: true,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASSWORD
            }
        })

        const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '1h' })

        const info = await transporter.sendMail({
            from: '"BuscoBarbie.com" <noresponder@buscobarbie.com>',
            to: user.email,
            subject: `Recupera tu contraseña de BuscoBarbie.com`,
            html: `<h1 style='text-align:center'>¡Hola ${user.name}!</h1><a href='${APP_URL}/updatePassword?id=${user._id.toString()}&token=${token}'>Pulsa aquí para cambiar tu contraseña</a>`
        })

        return info
    } else return 'no user'
}