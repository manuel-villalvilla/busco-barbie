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
const NAS_IMAGES_URL = process.env.NAS_IMAGES_URL

module.exports = async function (email) {
    validateEmail(email)

    const user = await User.findOne({ email }).lean()

    if (user && user.role === 'source') {
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

        const emailBody = `<html class='html'>
        <head>
        <style>
        .html {
            width: 100%;
        }

        .body {
            background-color: rgba(233, 96, 155, .1);
            height: fit-content;
            margin: 10px auto 10px auto;
            width: 100%;
            padding: 10px;
            border-radius: 20px;
            max-width: 500px;
        }

        .nomargin {
            margin: 0;
        }

        .container {
            margin: 0 auto 0 auto;
            padding: 10px;
            background-color: #fff;
            text-align: center;
        }

        .overflow {
            overflow-wrap: break-word;
        }

        .textalign {
            text-align: center;
        }

        .cabecera {
            margin: 0 0 10px 0;
            text-align: center;
        }

        h3>span {
            color: rgb(233, 96, 155);
        }

        .verlink {
            color: rgb(233, 96, 155);
        }

        .pink {
            color: rgb(233, 96, 155);
        }

        a {
            color: rgb(233, 96, 155);
        }
        .footer {
            font-size: 14px;
        }
        </style>
        </head>
        <body class='body'>
            <div class="textalign"><a href='${APP_URL}' rel='noopener noreferrer'><img src='${NAS_IMAGES_URL}/logo4.png' alt='Logo de BuscoBarbie.com' /></a></div>
            <h3 class='textalign'>¡Hola ${user.name}! Recupera tu contraseña de <span>BuscoBarbie.com</span></h3>
            <p class='cabecera'><b>Por favor, pulsa en el siguiente <span class='pink'>enlace</span> para cambiar tu contraseña:</b></p>
            <div class='container'>
                <a href='${APP_URL}/updatePassword?id=${user._id.toString()}&token=${token}'>Pulsa aquí para cambiar tu contraseña</a>
            </div>
            <p class='textalign'><b>Por favor, no <span style='color:rgb(233,96,155);'>respondas</span> a este email.</b></p>
            <h3 class='textalign nomargin;'>¡GRACIAS!</h3>
            <p class='footer'>Según lo dispuesto en el Reglamento Europeo en materia de Protección de Datos, te informamos que los datos de carácter personal que nos has proporcionado son gestionados por el responsable de BuscoBarbie.com tras habernos facilitado/cedido tus datos de manera voluntaria mediante el registro en la aplicación.</p>
            <p class='footer textalign'>2022 BuscoBarbie.com</p>
        </body>
        </html>`

        const info = await transporter.sendMail({
            from: '"BuscoBarbie.com" <noresponder@buscobarbie.com>',
            to: user.email,
            subject: `Recupera tu contraseña de BuscoBarbie.com`,
            html: emailBody
        })

        return info
    } else return 'no user'
}