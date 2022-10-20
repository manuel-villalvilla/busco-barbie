const { NotFoundError, LimitError } = require('errors')
const { newUserAd } = require('..')
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

describe('New User Ad', () => {
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
        const country_code = 'ES'
        const province = 'Madrid'
        const area = 'Mi zona'
        const phone = '678564544'
        const price = '45'
        const categories = 'modelos'
        const year = '1980'
        const images = []
        const tags = 'Fashionistas,Made to move'

        const user = await User.create({ name, email, password })
        const userId = user.id

        await User.findOneAndDelete({ email })

        try {
            await newUserAd(userId, country_code, title, body, province, area, phone, price, categories, images, year, tags)
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe('user not found')
        }
    })

    it('fails with limit error', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const title = 'Hola'
        const body = 'Hola'
        const location = {
            country: 'ES',
            province: 'Madrid',
            area: 'Mi zona'
        }
        const country_code = 'ES'
        const province = 'Madrid'
        const area = 'Mi zona'
        const phone = '678564544'
        const price = '45'
        const categories = 'complementos'
        const year = ''
        const images = []
        const tags = ''

        const user = await User.create({ name, email, password })

        await fs.mkdir(`${folder}/${user.id.toString()}`)
        
        for (let i = 0; i < 10; i++) await Ad.create({ user: user.id, title, body, location, categories, price })

        try {
            await newUserAd(user.id, country_code, title, body, province, area, phone, price, categories, images, year, tags)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).toBeInstanceOf(LimitError)
            expect(error.message).toBe('user reached the limit of 10 ads')
        }
    })

    it('succeeds creating user ad', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)
        
        const title = 'Hola'
        const body = 'Hola'
        const country_code = 'ES'
        const province = 'Madrid'
        const area = 'Mi zona'
        const phone = '678564544'
        const price = '45'
        const categories = 'modelos'
        const year = '1980'
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

        await fs.mkdir(`${folder}/${user.id.toString()}`)

        try {
            const userAds = await newUserAd(user.id, country_code, title, body, province, area, phone, price, categories, images, year, tags)
            expect(userAds).toHaveLength(1)
            expect(userAds[0].user.toString()).toBe(user.id.toString())
            
            const res = await fs.readdir(`${folder}/${user.id.toString()}/${userAds[0]._id.toString()}`)
            expect(res).toEqual(['1.jpg','2.jpg'])
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    it('succeeds creating user ad no images', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)
        
        const title = 'Hola'
        const body = 'Hola'
        const country_code = 'ES'
        const province = 'Madrid'
        const area = 'Mi zona'
        const phone = '678564544'
        const price = '45'
        const categories = 'modelos'
        const year = '1980'
        const images = []
        const tags = 'Fashionistas,Made to move'

        const user = await User.create({ name, email, password })

        await fs.mkdir(`${folder}/${user.id.toString()}`)

        try {
            const userAds = await newUserAd(user.id, country_code, title, body, province, area, phone, price, categories, images, year, tags)
            expect(userAds).toHaveLength(1)
            expect(userAds[0].user.toString()).toBe(user.id.toString())
            
            const res = await fs.readdir(`${folder}/${user.id.toString()}/${userAds[0]._id.toString()}`)
            expect(res).toEqual([])
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    afterAll(() => disconnect())
})