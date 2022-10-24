const { NotFoundError } = require('errors')
const { User } = require('../../models')
const nodemailer = require('nodemailer')
require('dotenv').config()
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD = process.env.SMTP_PASSWORD
const APP_URL = process.env.APP_URL

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

    a {
        color: rgb(233, 96, 155);
    }
    .footer {
        font-size: 14px;
    }
    </style>
    </head>
    <body class='body'>
        <div class="textalign"><a href='${APP_URL}' rel='noopener noreferrer'><img src='https://bbapi.serranillos.net/files/logo4.png' alt='Logo de BuscoBarbie.com' /></a></div>
        <h3 class='textalign'>¡Hola ${user.name}! Alguien quiere ponerse en <span>contacto</span> contigo.</h3>
        <p class='cabecera'><b>Aquí tienes una copia del <span style='color:rgb(233,96,155);'>mensaje</span>:</b></p>
        <div class='container'>
                <p class='nomargin'><b>Nombre:</b> ${name}</p>
                <p class='nomargin'><b>Email:</b> ${email}</p>
                <p class='nomargin overflow'><b>Mensaje:</b> ${body}</p>
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
        subject: `¡Hola ${user.name}! Un usuario de BuscoBarbie.com quiere ponerse en contacto contigo.`,
        html: emailBody
    })

}
