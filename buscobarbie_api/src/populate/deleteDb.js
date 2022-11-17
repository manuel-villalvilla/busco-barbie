require('dotenv').config()
const { env: { MONGO_URL, ADMIN_EMAIL, ADMIN_PASSWORD, NAS_IMAGES_URL } } = process
const { tags: { modelos, complementos } } = require('data')
const { User, Ad, FirstConnection } = require('../models')
const { connect, disconnect } = require('mongoose')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path');

(async () => {
    await connect(MONGO_URL)

    await Promise.all([User.deleteMany(), Ad.deleteMany(), FirstConnection.deleteMany()])

    console.log('Db deleted')

    const folder = join(__dirname, '../../files')
    const populateFolder = join(__dirname, '/')

    await fs.rm(folder, { recursive: true, force: true })
    console.log('Deleted files and folders')

    await fs.mkdir(folder, { recursive: true })

    await fs.copyFile(`${populateFolder}logo4.png`, `${folder}/logo4.png`)
    console.log('Logo copied')

    /* Create admin user */

    const adminPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)

    const user = await User.create({ name: 'Manu', email: ADMIN_EMAIL, password: adminPassword, role: 'admin', verified: true })

    console.log('admin user created')

    /* Create example ads */

    const title = 'Anuncio de muestra'
    const body = 'Así es como se verán los anuncios publicados. Ésta es una aplicación de uso gratuito para vender o buscar artículos relacionados con el mundo Barbie™. Para publicar un nuevo anuncio, sólo tienes que pulsar en el botón PUBLICAR situado en la cabecera de la aplicación.'

    const savedModelosTags = []
    for (let t = 0; t < 3; t++) {
        (function getTags() {
            const tag = modelos[Math.floor(Math.random() * modelos.length)]
            if (savedModelosTags.includes(tag)) return getTags()
            else savedModelosTags.push(tag)
        }())
    }

    const savedComplementosTags = []
    for (let r = 0; r < 3; r++) {
        (function getTags() {
            const tag = complementos[Math.floor(Math.random() * complementos.length)]
            if (savedComplementosTags.includes(tag)) return getTags()
            else savedComplementosTags.push(tag)
        }())
    }

    const paths = [
        '88.jpg',
        '33.jpg',
        '22.jpg'
    ]

    let urls = []


    const ad1 = await Ad.create({ user: user.id, title, body, location: { country: 'ES', province: 'Madrid', area: 'Zona sur' }, verified: true, categories: 'searchedmodels', year: 1980, tags: savedModelosTags, price: { number: 40, negotiable: true } })

    await fs.mkdir(`${folder}/${user.id.toString()}/${ad1.id.toString()}`, { recursive: true })

    for (const path of paths) {
        urls.push(`${NAS_IMAGES_URL}/${user.id.toString()}/${ad1.id.toString()}/${path}`)
        fs.copyFile(`${populateFolder}${path}`, `${folder}/${user.id.toString()}/${ad1.id.toString()}/${path}`)
    }

    await Ad.updateOne({ _id: ad1.id }, { $set: { image: urls } })

    urls = []

    const ad2 = await Ad.create({ user: user.id, title, body, location: { country: 'MX', province: 'Aguascalientes', area: 'Zona norte' }, verified: true, categories: 'searchedaccessories', tags: savedComplementosTags, price: { number: 20, negotiable: true } })

    await fs.mkdir(`${folder}/${user.id.toString()}/${ad2.id.toString()}`, { recursive: true })

    for (const path of paths) {
        urls.push(`${NAS_IMAGES_URL}/${user.id.toString()}/${ad2.id.toString()}/${path}`)
        fs.copyFile(`${populateFolder}${path}`, `${folder}/${user.id.toString()}/${ad2.id.toString()}/${path}`)
    }

    await Ad.updateOne({ _id: ad2.id }, { $set: { image: urls } })

    urls = []

    const ad3 = await Ad.create({ user: user.id, title, body, location: { country: 'AR', province: 'Buenos Aires', area: 'Zona sur' }, verified: true, categories: 'soldmodels', year: 1960, tags: savedModelosTags, price: { number: 60, negotiable: false } })

    await fs.mkdir(`${folder}/${user.id.toString()}/${ad3.id.toString()}`, { recursive: true })

    for (const path of paths) {
        urls.push(`${NAS_IMAGES_URL}/${user.id.toString()}/${ad3.id.toString()}/${path}`)
        fs.copyFile(`${populateFolder}${path}`, `${folder}/${user.id.toString()}/${ad3.id.toString()}/${path}`)
    }

    await Ad.updateOne({ _id: ad3.id }, { $set: { image: urls } })

    console.log('3 ads created')

    await disconnect()
})()



