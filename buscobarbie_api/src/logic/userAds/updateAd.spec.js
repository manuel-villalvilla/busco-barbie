const { NotFoundError, CredentialsError } = require('errors')
const { updateAd } = require('..')
const { connect, disconnect } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
const imgsFolder = join(__dirname, '../../populate')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL
const NAS_IMAGES_URL = process.env.NAS_IMAGES_URL

describe('Update Ad', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(async () => {
        const users = await User.find().lean()
        if (users.length)
            for (const user of users) await fs.rm(`${folder}/${user._id.toString()}`, { recursive: true, force: true })

        await User.deleteMany()
        await Ad.deleteMany()
    })

    it('fails with user not found', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const title = 'Hola'
        const body = 'Hola'
        const province = 'Madrid'
        const area = ''
        const phone = ''
        const images = []
        const year = ''
        const tags = []
        const categories = 'modelos'
        const price = '45'

        const user = await User.create({ name, email, password })
        const userId = user.id

        await User.findByIdAndDelete(user.id)

        try {
            await updateAd(userId, userId, title, body, province, area, phone, price, categories, images, year, tags)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe('user not found')
        }
    })

    it('fails with ad not found', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const title = 'Hola'
        const body = 'Hola'
        const province = 'Madrid'
        const area = ''
        const phone = ''
        const images = []
        const year = ''
        const tags = []
        const categories = 'modelos'
        const price = '45'

        const user = await User.create({ name, email, password })

        try {
            await updateAd(user.id, user.id, title, body, province, area, phone, price, categories, images, year, tags)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe('ad not found')
        }
    })

    it('fails with ad not belonging to user', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const title = 'Hola'
        const body = 'Hola'
        const location = {
            country: 'ES',
            province: 'Madrid',
            area: ''
        }
        const province = 'Madrid'
        const area = ''
        const phone = ''
        const images = []
        const year = ''
        const tags = []
        const categories = 'modelos'
        const price = '45'

        const user = await User.create({ name, email, password })
        const user2 = await User.create({ name: 'Pepito Grillo', email: 'pepito@grillo.com', password: await bcrypt.hash('123123123', 10) })

        const ad = await Ad.create({ user: user2.id, title, body, location, categories, price })

        try {
            await updateAd(user.id, ad.id, title, body, province, area, phone, price, categories, images, year, tags)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).toBeInstanceOf(CredentialsError)
            expect(error.message).toBe('ad does not belong to user')
        }
    })

    it('succeeds updating ad with previous files', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const title = 'Hola'
        const title2 = 'Adiós'
        const body = 'Hola'
        const body2 = 'Adiós'
        const location = {
            country: 'ES',
            province: 'Madrid',
            area: 'Mi zona'
        }
        const province = 'Cuenca'
        const area = 'Mi zona'
        const phone = '654654654'
        const year = '1980'
        const categories = 'modelos'
        const categories2 = 'complementos'
        const price = '50'
        const price2 = '45'
        const data1 = await fs.readFile(`${imgsFolder}/1.jpg`)
        const data2 = await fs.readFile(`${imgsFolder}/2.jpg`)
        const file1Name = '1.jpg'
        const file2Name = '2.jpg'
        const images = []
        const tags = 'Fashionistas,Made to move'

        const user = await User.create({ name, email, password })

        const ad = await Ad.create({ user: user.id, title, body, location, categories, price })

        await fs.mkdir(`${folder}/${user.id.toString()}/${ad.id.toString()}`, { recursive: true })
        await fs.writeFile(`files/${user.id.toString()}/${ad.id.toString()}/${file1Name}`, data1)
        await fs.writeFile(`files/${user.id.toString()}/${ad.id.toString()}/${file2Name}`, data2)

        try {
            const ads = await updateAd(user.id, ad.id, title2, body2, province, area, phone, price2, categories2, images, year, tags)
            expect(ads).toHaveLength(1)
            expect(ads[0].title).toBe('Adiós')
            expect(ads[0].body).toBe('Adiós')
            expect(ads[0].location.country).toBe('ES')
            expect(ads[0].location.province).toBe('Cuenca')
            expect(ads[0].location.area).toBe('Mi zona')
            expect(ads[0].phone).toBe('654654654')
            expect(ads[0].price).toBe(45)
            expect(ads[0].categories).toBe('complementos')
            expect(ads[0].year).toBe('1980')
            expect(ads[0].tags).toEqual(['Fashionistas', 'Made to move'])
            const files = await fs.readdir(`${folder}/${user._id.toString()}/${ad._id.toString()}`)
            expect(files).toEqual([])
        } catch (error) {
            expect(error).toBeNull()
        }
    })

    it('succeeds updating ad without previous files', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const title = 'Hola'
        const title2 = 'Adiós'
        const body = 'Hola'
        const body2 = 'Adiós'
        const location = {
            country: 'ES',
            province: 'Madrid',
            area: 'Mi zona'
        }
        const province = 'Cuenca'
        const area = 'Mi zona'
        const phone = '654654654'
        const year = '1980'
        const categories = 'modelos'
        const categories2 = 'complementos'
        const price = '50'
        const price2 = '45'
        const data1 = await fs.readFile(`${imgsFolder}/1.jpg`)
        const data2 = await fs.readFile(`${imgsFolder}/2.jpg`)
        const file1Name = '1.jpg'
        const file2Name = '2.jpg'
        const images = [
            {
                name: file1Name,
                data: data1
            },
            {
                name: file2Name,
                data: data2
            }
        ]
        const tags = 'Fashionistas,Made to move'

        const user = await User.create({ name, email, password })

        const ad = await Ad.create({ user: user.id, title, body, location, categories, price })

        await fs.mkdir(`${folder}/${user.id.toString()}/${ad.id.toString()}`, { recursive: true })

        try {
            const ads = await updateAd(user.id, ad.id, title2, body2, province, area, phone, price2, categories2, images, year, tags)
            expect(ads).toHaveLength(1)
            expect(ads[0].title).toBe('Adiós')
            expect(ads[0].body).toBe('Adiós')
            expect(ads[0].location.country).toBe('ES')
            expect(ads[0].location.province).toBe('Cuenca')
            expect(ads[0].location.area).toBe('Mi zona')
            expect(ads[0].phone).toBe('654654654')
            expect(ads[0].price).toBe(45)
            expect(ads[0].categories).toBe('complementos')
            expect(ads[0].year).toBe('1980')
            expect(ads[0].tags).toEqual(['Fashionistas', 'Made to move'])
            expect(ads[0].image).toHaveLength(2)
            expect(ads[0].image[0]).toBe(`${NAS_IMAGES_URL}/${user.id.toString()}/${ad.id.toString()}/1.jpg`)
            expect(ads[0].image[1]).toBe(`${NAS_IMAGES_URL}/${user.id.toString()}/${ad.id.toString()}/2.jpg`)
            const files = await fs.readdir(`${folder}/${user._id.toString()}/${ad._id.toString()}`)
            expect(files[0]).toEqual('1.jpg')
            expect(files[1]).toEqual('2.jpg')
        } catch (error) {
            expect(error).toBeNull()
        }
    })

    afterAll(() => disconnect())
})