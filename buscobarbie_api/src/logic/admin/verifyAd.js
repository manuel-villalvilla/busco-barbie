const { Ad, User } = require('../../models')
const { validateObjectId } = require('../../utils')
const { CredentialsError, NotFoundError } = require('errors')
const nodemailer = require('nodemailer')
require('dotenv').config()
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD = process.env.SMTP_PASSWORD
const APP_URL = process.env.APP_URL
const NAS_IMAGES_URL = process.env.NAS_IMAGES_URL

module.exports = async function (userId, adId) {
    validateObjectId(adId)
    validateObjectId(userId)

    const user = await User.findById(userId).lean()
    if (!user) throw new NotFoundError('user not found')
    if (user.role !== 'admin') throw new CredentialsError('not authorized')

    const ad = await Ad.findById(adId).lean()
    if (!ad) throw new NotFoundError('ad not found')

    await Ad.findByIdAndUpdate(adId, { verified: true }).lean()

    const adUser = await User.findById(ad.user).lean()

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
    b>span {
        color: rgb(233, 96, 155);
    }
    .footer {
        font-size: 14px;
    }
    </style>
    </head>
    <body class='body'>
        <div class="textalign"><a href='${APP_URL}/${ad.location.country}' rel='noopener noreferrer'><img src='${NAS_IMAGES_URL}/logo4.png' alt='Logo de BuscoBarbie.com' /></a></div>
        <h3 class='textalign'>??Hola ${adUser.name}! Tu anuncio ha sido <span>verificado</span>.</h3>
        <p class='cabecera'><b>Ya es visible al <span>p??blico</span>, no obstante, ahora tienes la opci??n de <span>ocultarlo</span> si quisieras desde tu <span>panel de control</span>. Ten en cuenta que si decides editar el anuncio, volver?? a tener que pasar por <span>verificaci??n</span>.</b></p>
        <br>
        <p class='cabecera'><b>Aqu?? tienes una <span>copia</span>:</b></p>
        <div class='container'>
                <p class='nomargin'><b>Nombre:</b> ${adUser.name}</p>
                <p class='nomargin'><b>T??tulo:</b> ${ad.title}</p>
                <p class='nomargin overflow'><b>Descripci??n:</b> ${ad.body}</p>
                <p class='nomargin'><b>${ad.location.country !== 'MX' ? 'Provincia: ' : 'Estado: '}</b>${ad.location.province}</p>
                <p class='nomargin'><b>Zona:</b> ${ad.location.area ? ad.location.area : 'Sin especificar'}</p>
                <p class='nomargin'><b>Tel??fono:</b> ${ad.phone ? ad.phone : 'Sin especificar'}</p>
                <p class='nomargin'><b>Precio:</b> ${ad.price.number}</p>
                <p class='nomargin'><b>??Precio negociable?</b> ${ad.price.negotiable ? 'S??' : 'No'}</p>
                <p class='nomargin'><b>Categor??as:</b> ${ad.categories === 'soldmodels' ? 'Modelos en venta' : ad.categories === 'soldaccessories' ? 'Complementos en venta' : ad.categories === 'searchedmodels' ? 'Modelos en b??squeda' : ad.categories === 'searchedaccessories' ? 'Complementos en b??squeda' : ''}</p>
                <p class="nomargin"><b>D??cada:</b> ${ad.year ? ad.year : 'Opcional para categor??a "modelos"'}</p>
                <p class="nomargin overflow"><b>Etiquetas: </b>${ad.tags.length ? ad.tags.join(', ') : 'No especificadas'}</p> 
                <p class='nomargin'><b>N??mero de im??genes:</b> ${ad.image.length ? ad.image.length : '0'}</p>
        </div>
        <p class='textalign'><b>Por favor, no <span style='color:rgb(233,96,155);'>respondas</span> a este email.</b></p>
        <h3 class='textalign nomargin;'>??GRACIAS!</h3>
        <p class='footer textalign'>Seg??n lo dispuesto en el Reglamento Europeo en materia de Protecci??n de Datos, te informamos que los datos de car??cter personal que nos has proporcionado son gestionados por el responsable de BuscoBarbie.com tras habernos facilitado/cedido tus datos de manera voluntaria mediante el registro en la aplicaci??n.</p>
        <p class='footer textalign'>2022 BuscoBarbie.com</p>
    </body>
    </html>`

    return await transporter.sendMail({
        from: '"BuscoBarbie.com" <noresponder@buscobarbie.com>',
        to: adUser.email,
        subject: `Tu anuncio ha sido verificado`,
        html: emailBody
    })
}