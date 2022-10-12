const { validateEmail } = require('validators')
const { User } = require('../../models')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const HOST = process.env.SMTP_HOST
const PORT = process.env.SMTP_PORT
const USER = process.env.SMTP_USER
const PASSWORD = process.env.SMTP_PASSWORD
const APP_URL = process.env.APP_URL
const JWT_SECRET = process.env.JWT_SECRET

module.exports = async function (email) {
    validateEmail(email)

    const user = await User.findOne({ email }).lean()

    if (user) {
        /* Send password recovery email */
        const transporter = nodemailer.createTransport({
            host: HOST,
            port: PORT,
            secure: true,
            auth: {
                user: USER,
                pass: PASSWORD
            }
        })

        const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '1h' })

        const info = await transporter.sendMail({
            from: '"BuscoBarbie.com" <noresponder@buscobarbie.com>',
            to: user.email,
            subject: `Recupera tu contraseña de BuscoBarbie.com`,
            html: `<h1 style='text-align:center'>¡Hola ${user.name}!</h1><a href='${APP_URL}/updatePassword?id=${user._id.toString()}&token=${token}'>Pulsa aquí para cambiar tu contraseña</a>`
        })
    }
}