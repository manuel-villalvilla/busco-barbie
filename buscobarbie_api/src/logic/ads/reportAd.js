const { validateBody, validateReportSelect } = require('validators')
const { validateObjectId } = require('../../utils')
const { NotFoundError } = require('errors')
const nodemailer = require('nodemailer')
const { Ad } = require('../../models')
require('dotenv').config()
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD = process.env.SMTP_PASSWORD
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL

module.exports = async function (select, body, adId) {
    validateReportSelect(select)
    validateBody(body)
    validateObjectId(adId)

    const ad = await Ad.findById(adId)
    if (!ad) throw new NotFoundError('ad to report not found')

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

    .cabecera {
        margin: 0 0 10px 0;
        text-align: center;
    }

    </style>
    </head>
    <body class='body'>
        <p class='cabecera'><b>Reporte:</b></p>
        <div class='container'>
                <p class='nomargin'><b>ID del anuncio:</b> ${adId}</p>
                <p class='nomargin'><b>Razón:</b> ${select}</p>
                <p class='nomargin overflow'><b>Mensaje:</b> ${body}</p>
        </div>
    </body>
    </html>`

    return await transporter.sendMail({
        from: SMTP_USER,
        to: SUPPORT_EMAIL,
        subject: 'Reporte de anuncio a través de la aplicación',
        html: emailBody
    })
}