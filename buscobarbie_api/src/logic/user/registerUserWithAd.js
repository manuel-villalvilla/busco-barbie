const { DuplicityError } = require('errors')
const {
    validateCountry,
    validateName,
    validatePassword,
    validateEmail,
    validateTitle,
    validateBody,
    validateProvince,
    validatePrice,
    validateCategories,
    validateFiles,
    validateArea,
    validatePhoneNumber,
    validateYear,
    validateTags
} = require('validators')
const { User, Ad } = require('../../models')
const fs = require('fs/promises')
const nodemailer = require('nodemailer')
const { join } = require('path')
const filesFolder = join(__dirname, '../../../files')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const JWT_SECRET = process.env.JWT_SECRET
const NAS_IMAGES_URL = process.env.NAS_IMAGES_URL
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD = process.env.SMTP_PASSWORD
const APP_URL = process.env.APP_URL

module.exports = async function (country_code, name, email, password, title, body, province, area, phone, price, categories, images, year, tags) {
    validateCountry(country_code)
    validateName(name)
    validatePassword(password)
    validateEmail(email)
    validateTitle(title)
    validateBody(body)
    validateProvince(province)
    validateArea(area)
    validatePhoneNumber(phone)
    validatePrice(price)
    validateCategories(categories)
    validateFiles(images)
    validateYear(year)
    let arr = []
    if (tags.length) {
        arr = tags.split(',')
        validateTags(arr)
    }

    const location = {
        country: country_code,
        province,
        area
    }

    const firstUser = await User.find({ email }).lean()
    if (firstUser.length > 0) throw new DuplicityError('user already exists')

    const hash = await bcrypt.hash(password, 10)

    const user = await User.create({ name, email, password: hash })

    await Ad.deleteMany({ user: user.id })

    const ad = await Ad.create({ user: user.id, title, body, location, phone, price, categories, year, tags: arr })

    /* Create user folder tree */
    await fs.mkdir(`${filesFolder}/${user.id.toString()}/${ad.id.toString()}`, { recursive: true })

    if (images.length > 0) {
        /* Upload images */
        const urls = []
        for (let i = 0; i < images.length; i++) {
            urls.push(`${NAS_IMAGES_URL}/${user.id.toString()}/${ad.id.toString()}/${images[i].name}`)
            await fs.writeFile(`${filesFolder}/${user.id.toString()}/${ad.id.toString()}/${images[i].name}`, images[i].data)
        }
        /* Update Ad with URLs */
        await Ad.updateOne({ _id: ad.id }, { $set: { image: urls } })
    }

    /* Send user verification email */

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: true,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD
        }
    })

    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '1h' })

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

    .verlink {
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
        <div class="textalign"><a href='${APP_URL}/${country_code}' rel='noopener noreferrer'><img src='${NAS_IMAGES_URL}/logo4.png' alt='Logo de BuscoBarbie.com' /></a></div>
        <h3 class='textalign'>??Hola ${user.name}! Te damos la bienvenida a <span>BuscoBarbie.com</span></h3>
        <p class='cabecera'><b>Aqu?? tienes una copia de tu anuncio y tu enlace de verificaci??n:</b></p>
        <div class='container'>
                <p class='nomargin'><b>Nombre:</b> ${user.name}</p>
                <p class='nomargin'><b>T??tulo:</b> ${ad.title}</p>
                <p class='nomargin overflow'><b>Descripci??n:</b> ${ad.body}</p>
                <p class='nomargin'><b>${country_code !== 'MX' ? 'Provincia: ' : 'Estado: '}</b>${ad.location.province}</p>
                <p class='nomargin'><b>Zona:</b> ${ad.location.area ? ad.location.area : 'Sin especificar'}</p>
                <p class='nomargin'><b>Tel??fono:</b> ${ad.phone ? ad.phone : 'Sin especificar'}</p>
                <p class='nomargin'><b>Precio:</b> ${ad.price.number}</p>
                <p class='nomargin'><b>??Precio negociable?</b> ${ad.price.negotiable ? 'S??' : 'No'}</p>
                <p class='nomargin'><b>Categor??as:</b> ${ad.categories === 'soldmodels' ? 'Modelos en venta' : ad.categories === 'soldaccessories' ? 'Complementos en venta' : ad.categories === 'searchedmodels' ? 'Modelos en b??squeda' : ad.categories === 'searchedaccessories' ? 'Complementos en b??squeda' : ''}</p>
                <p class="nomargin"><b>D??cada:</b> ${ad.year ? ad.year : 'Opcional para categor??a "modelos"'}</p>
                <p class="nomargin overflow"><b>Etiquetas: </b>${ad.tags.length ? ad.tags.join(', ') : 'No especificadas'}</p> 
                <p class='nomargin'><b>N??mero de im??genes:</b> ${images.length ? images.length : '0'}</p>
        </div>
        <p class='textalign'><b>Tu anuncio ser?? verificado en las pr??ximas horas si cumple con nuestras <a href='${APP_URL}/terms-and-conditions' rel='noopener noreferrer' class='verlink'>condiciones</a>.</b></p>
        <p class='textalign'><b><a href='${APP_URL}/verify?id=${user.id.toString()}&token=${token}' rel='noopener noreferrer' class='verlink'>Haz click aqu?? para verificar tu usuario en BuscoBarbie.com</a></b></p>
        <p class='textalign'><b>Por favor, no <span style='color:rgb(233,96,155);'>respondas</span> a este email.</b></p>
        <h3 class='textalign nomargin;'>??GRACIAS!</h3>
        <p class='footer textalign'>Seg??n lo dispuesto en el Reglamento Europeo en materia de Protecci??n de Datos, te informamos que los datos de car??cter personal que nos has proporcionado son gestionados por el responsable de BuscoBarbie.com tras habernos facilitado/cedido tus datos de manera voluntaria mediante el registro en la aplicaci??n.</p>
        <p class='footer textalign'>2022 BuscoBarbie.com</p>
    </body>
    </html>`

    const info = await transporter.sendMail({
        from: '"BuscoBarbie.com" <noresponder@buscobarbie.com>',
        to: user.email,
        subject: `Enlace de verificaci??n de BuscoBarbie.com`,
        html: emailBody
    })

    return info

}

// const NAS_API = process.env.NAS_API
// const NAS_USER = process.env.NAS_USER
// const NAS_PASSWORD = process.env.NAS_PASSWORD
// const NAS_FOLDER_PATH = process.env.NAS_FOLDER_PATH
// const axios = require('axios')
// const FormData = require('form-data')

/* NAS query for API version */
    // const { data: { data: { 'SYNO.API.Auth': { maxVersion, minVersion, path } } } } = await axios.get(`${NAS_API}/query.cgi?api=SYNO.API.Info&version=1&method=query&query=all`)

/* NAS login */
    // const { data: { data: { sid } } } = await axios.get(`${NAS_API}/${path}?api=SYNO.API.Auth&version=${maxVersion}&method=login&account=${NAS_USER}&passwd=${NAS_PASSWORD}&session=FileStation&format=sid`)

/* Create user folder tree */
    // await axios.get(`${NAS_API}/${path}?api=SYNO.FileStation.CreateFolder&version=2&method=create&folder_path=["${NAS_FOLDER_PATH}"]&name=["${user.id.toString()}/${ad.id.toString()}"]&_sid=${sid}`)

/* Upload images */
    // const form = new FormData()
    // form.append('api', 'SYNO.FileStation.Upload')
    // form.append('version', '2')
    // form.append('method', 'upload')
    // form.append('path', `${NAS_FOLDER_PATH}/${user.id.toString()}/${ad.id.toString()}`)
    // form.append('_sid', sid)
    // form.append('file', images[i].data, { 'filename': images[i].name })
    // await axios.post(`${NAS_API}/${path}/?_sid=${sid}`, form)

/* NAS logout */
    // await axios.get(`${NAS_API}/${path}?api=SYNO.API.Auth&version=${maxVersion}&method=logout&session=FileStation&_sid=${sid}`)