const { retrieveFilteredAds } = require('..')
const { connect, disconnect } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL

describe('Retrieve filtered ads', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(async () => {
        const users = await User.find().lean()
        if (users.length)
            for (const user of users) await fs.rm(`${folder}/${user._id.toString()}`, { recursive: true, force: true })

        await User.deleteMany()
        await Ad.deleteMany()
    })

    it('succeeds retrieving filtered ads', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const user = await User.create({ name, email, password, verified: true })

        const location = {
            country: 'ES',
            province: 'Madrid',
            area: 'Mi zona'
        }
        const title = 'Hola'
        const body = 'Hola'
        const price = {
            number: 45,
            negotiable: true
        }
        const categories = 'soldmodels'

        await Ad.create({ user: user.id, location, title, body, price, categories, verified: true })

        const page = 1
        const limit = 10
        const country = 'ES'
        const province = 'Madrid'
        const search = ''
        const year = ''
        const tags = []
        const sort = undefined

        try {
            const pack = await retrieveFilteredAds(page, limit, country, province, search, categories, year, tags, sort)
            expect(pack).toBeInstanceOf(Object)
            expect(pack.ads).toHaveLength(1)
            expect(pack.totalPages).toBe(1)
            expect(pack.currentPage).toBe(1)
            expect(pack.count).toBe(1)
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    it('succeeds retrieving filtered ads', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const user = await User.create({ name, email, password, verified: true })

        const location = {
            country: 'ES',
            province: 'Madrid',
            area: 'Mi zona'
        }
        const title = 'Hola'
        const body = 'Hola'
        const price = {
            number: 45,
            negotiable: true
        }
        const categories = 'soldaccessories'
        const adYear = '1980'
        const adTags = ['Casas','Coches']

        await Ad.create({ user: user.id, location, title, body, price, categories, year: adYear, tags: adTags, verified: true })

        const page = 1
        const limit = 10
        const country = 'ES'
        const province = ''
        const search = 'ho'
        const year = '1980'
        const tags = 'Casas,Coches'
        const sort = 'firstPublished'

        try {
            const pack = await retrieveFilteredAds(page, limit, country, province, search, categories, year, tags, sort)
            expect(pack).toBeInstanceOf(Object)
            expect(pack.ads).toHaveLength(1)
            expect(pack.totalPages).toBe(1)
            expect(pack.currentPage).toBe(1)
            expect(pack.count).toBe(1)
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    afterAll(() => disconnect())
})