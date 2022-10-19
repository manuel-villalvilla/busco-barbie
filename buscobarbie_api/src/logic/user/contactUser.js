const { NotFoundError } = require('errors')
const { User } = require('../../models')
const nodemailer = require('nodemailer')
require('dotenv').config()
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD = process.env.SMTP_PASSWORD

module.exports = async function(name, email, body, adUser) {
    // TODO VALIDATE INPUTS
    const user = await User.findById(adUser).lean()
    if (!user) throw new NotFoundError('user not found')

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: true,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD
        }
    })

    const info = await transporter.sendMail({
        from: '"BuscoBarbie.com" <noresponder@buscobarbie.com>',
        to: user.email,
        subject: `¡Hola ${user.name}! Un usuario de BuscoBarbie.com quiere ponerse en contacto contigo`,
        html: `<h1 style='text-align:center'>¡Hola ${user.name}! Tienes un mensaje nuevo:</h1><br>
        <p style='text-align:center'>Nombre: ${name}</p><br><p style='text-align:center'>Email: ${email}</p><br>
        <p style='text-align:center'>Mensaje: ${body}</p><br>`
    })

}
