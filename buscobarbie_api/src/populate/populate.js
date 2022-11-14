require('dotenv').config()
const { areas: { MX, ES, AR }, tags: { modelos, complementos }, years } = require('data')
MX.splice(0, 1)
ES.splice(0, 1)
AR.splice(0, 1)
const fs = require('fs/promises')
const { join } = require('path')
// const FormData = require('form-data')
const bcrypt = require('bcryptjs')
const { env: { MONGO_URL, NAS_IMAGES_URL, ADMIN_EMAIL, ADMIN_PASSWORD } } = process
// const axios = require('axios')
const { User, Ad, FirstConnection } = require('../models')
const { connect, disconnect } = require('mongoose');

(async () => {
    await connect(MONGO_URL)

    console.log('Deleting DB')
    await Promise.all([User.deleteMany(), Ad.deleteMany(), FirstConnection.deleteMany()])

    const folder = join(__dirname, '../../files')
    console.log('Deleting files and folders')
    await fs.rm(folder, { recursive: true, force: true })

    /* NAS query for API version */
    // const { data: { data: { 'SYNO.API.Auth': { maxVersion, minVersion, path } } } } = await axios.get(`${NAS_API}/query.cgi?api=SYNO.API.Info&version=1&method=query&query=all`)

    /* NAS login */
    // const { data: { data: { sid } } } = await axios.get(`${NAS_API}/${path}?api=SYNO.API.Auth&version=${maxVersion}&method=login&account=${NAS_USER}&passwd=${NAS_PASSWORD}&session=FileStation&format=sid`)

    /* NAS delete all folders */

    // TODO

    
    const password = '123123123'

    const paths = [
        '1.jpg',
        '2.jpg',
        '3.jpg',
        '4.jpeg',
        '5.jpg',
        '6.jpg',
        '7.jpg',
        '8.jpg',
        '9.jpg',
        '10.jpg',
    ]

    const bodies = [
        'Fusce dignissim neque eu elementum commodo. Donec rhoncus tortor neque, non placerat purus imperdiet a. Quisque quis laoreet ipsum. Ut et justo a felis congue auctor. Donec id augue gravida, maximus diam ut, pellentesque lorem. Suspendisse eu purus quam. Mauris varius magna molestie, posuere lectus quis, pulvinar turpis. Cras quis ullamcorper velit. Vestibulum varius sit amet arcu et hendrerit. Donec ultricies efficitur enim in condimentum.',
        'Donec faucibus mauris viverra finibus congue. Suspendisse condimentum imperdiet nunc, sed bibendum urna lobortis quis. Maecenas porttitor neque id justo vulputate, non accumsan risus molestie. Nunc vehicula urna non malesuada dictum. Nunc dui orci, tincidunt quis est eget, luctus volutpat ipsum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla scelerisque, arcu non suscipit ullamcorper, lorem risus placerat leo.',
        'Nam tempus fringilla arcu vitae semper. Suspendisse id risus aliquam, placerat libero id, tristique mi. Nulla ac tristique erat. Pellentesque eu risus quis tortor volutpat tempus nec eget sem. Aliquam fermentum hendrerit libero ac maximus. Integer tincidunt elit sed ultrices auctor. Vestibulum bibendum ac nulla vitae dictum. Morbi non aliquet dolor, sit amet scelerisque nisl. Pellentesque tempor tristique mi ac convallis.',
        'Donec ullamcorper eros at arcu aliquet, sollicitudin aliquet nisl sollicitudin. Etiam ultrices dui risus, vitae pulvinar enim pretium non. Cras fermentum lectus et nibh placerat, sit amet placerat neque venenatis. Ut eleifend diam nec pulvinar pretium. Aenean maximus volutpat sapien ut sagittis. Donec finibus lobortis risus, non finibus augue varius nec. Pellentesque non imperdiet enim. Sed et egestas dolor. Ut elementum.',
        'In elementum non tellus sed gravida. Cras vel sollicitudin eros. Cras eros lacus, accumsan at diam ac, rutrum tristique ex. Nam tincidunt gravida dui at viverra. Nunc a hendrerit risus, a porttitor orci. Nam tempor magna nec lectus sodales venenatis. Etiam et nunc a tellus efficitur interdum eu nec nisl.'
    ]

    const titles = [
        'Donec nec urna sed',
        'Ut urna nulla',
        'Fusce quis quam',
        'Fusce sodales orci',
        'Maecenas ut convallis'
    ]

    const verifiedOpts = [true, false]

    const testCategories = ['soldmodels', 'soldaccessories', 'searchedmodels', 'searchedaccessories']

    const visibilities = ['private', 'public']

    const populateFolder = join(__dirname, '/')

    /* Create admin user */

    const adminPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)

    await User.create({ name: 'admin', email: ADMIN_EMAIL, password: adminPassword, role: 'admin', verified: true })

    /* Create rest of users */

    for (let i = 0; i < 99; i++) {
        console.log(`Creating user ${i + 1} with ads:`)

        const name = 'manu'+i

        const email = `manu${i}@manu.com`

        const hash = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email, password: hash, verified: true })

        for (let z = 0; z < 5; z++) {
            const title = titles[Math.floor(Math.random() * 5)]

            const body = bodies[Math.floor(Math.random() * 5)]

            let country = ''
            let province = ''
            let phone = ''

            if (i < 33) {
                country += 'ES'
                province += ES[Math.floor(Math.random() * ES.length)]
                if (i >= 0 && i < 17) {
                    phone += '6'
                    for (let g = 0; g < 8; g++) {
                        phone += Math.floor(Math.random() * 10)
                    }
                }
            }

            else if (i >= 33 && i < 66) {
                country += 'AR'
                province += AR[Math.floor(Math.random() * AR.length)]
                if (i >= 33 && i < 50)
                    for (let f = 0; f < 8; f++) {
                        phone += Math.floor(Math.random() * 10)
                    }
            }

            else if (i >= 66) {
                country += 'MX'
                province += MX[Math.floor(Math.random() * MX.length)]
                if (i > 66 && i <= 82)
                    for (let d = 0; d < 10; d++) {
                        phone += Math.floor(Math.random() * 10)
                    }
            }

            const area = 'area ' + z

            const price = Math.floor(Math.random() * 100)

            const categories = testCategories[Math.floor(Math.random() * 4)]

            const visibility = visibilities[Math.floor(Math.random() * 2)]

            const verified = verifiedOpts[Math.floor(Math.random() * 2)]

            const randomDate = () => {
                const maxDate = Date.now()
                const minDate = 1640999886000 // desde el 1 de enero de 2022
                const timestamp = Math.floor(Math.random() * (maxDate - minDate + 1)) + minDate
                return new Date(timestamp)
            }

            const createdAt = randomDate()

            let ad

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

            if (categories === 'searchedmodels' || categories === 'soldmodels') {
                let year = years[Math.floor(Math.random() * years.length)]
                ad = await Ad.create({ user: user.id, title, body, location: { country, province, area }, phone, verified, categories, year, tags: savedModelosTags, visibility, price, createdAt })
            }
            else if (categories === 'searchedaccessories' || categories === 'soldaccessories') {
                ad = await Ad.create({ user: user.id, title, body, location: { country, province, area }, phone, verified, categories, tags: savedComplementosTags, visibility, price, createdAt })
            }

            /* Create folder tree */
            await fs.mkdir(`${folder}/${user.id.toString()}/${ad.id.toString()}`, { recursive: true })
            // await axios.get(`${NAS_API}/${path}?api=SYNO.FileStation.CreateFolder&version=2&method=create&folder_path=["${NAS_FOLDER_PATH}"]&name=["${user.id.toString()}/${ad.id.toString()}"]&_sid=${sid}`)

            const randomNofImgs = Math.floor(Math.random() * 4)

            let urls = []

            /* Upload images */
            if (randomNofImgs > 0) {

                const savedFileNames = []
                for (let h = 0; h < randomNofImgs; h++) {
                    const fileName = () => {
                        const name = paths[Math.floor(Math.random() * paths.length)]
                        if (savedFileNames.includes(name)) return fileName()
                        else savedFileNames.push(name)
                        return name
                    }

                    const name = fileName()

                    urls.push(`${NAS_IMAGES_URL}/${user.id.toString()}/${ad.id.toString()}/${name}`)

                    fs.copyFile(`${populateFolder}/${name}`, `${folder}/${user.id.toString()}/${ad.id.toString()}/${name}`)

                    // const form = new FormData()
                    // form.append('api', 'SYNO.FileStation.Upload')
                    // form.append('version', '2')
                    // form.append('method', 'upload')
                    // form.append('path', `${NAS_FOLDER_PATH}/${user.id.toString()}/${ad.id.toString()}`)
                    // form.append('_sid', sid)
                    // const newFile = await fs.readFile(`./src/populate/${name}`)
                    // form.append('file', newFile, { 'filename': name })
                    // const res = await axios.post(`${NAS_API}/${path}/?_sid=${sid}`, form)
                    // console.log(res.data)
                }
                await Ad.updateOne({ _id: ad.id }, { $set: { image: urls } })
            }
        }
    }

    await fs.copyFile(`${populateFolder}/logo4.png`, `${folder}/logo4.png`)

    /* NAS logout */
    // await axios.get(`${NAS_API}/${path}?api=SYNO.API.Auth&version=${maxVersion}&method=logout&session=FileStation&_sid=${sid}`)

    console.log('100 users created with 5 ads each')

    await disconnect()
})()



