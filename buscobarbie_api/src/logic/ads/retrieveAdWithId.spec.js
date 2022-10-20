const { retrieveAdWithId } = require('..')
const { connect, disconnect } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL

describe('Retrieve ad with id', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(async () => {
        const users = await User.find().lean()
        if (users.length)
            for (const user of users) await fs.rm(`${folder}/${user._id.toString()}`, { recursive: true, force: true })

        await User.deleteMany()
        await Ad.deleteMany()
    })

    it('succeeds retrieving ad with id', async () => {
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
        const price = 45
        const categories = 'modelos'

        const firstAd = await Ad.create({ user: user.id, location, title, body, price, categories, verified: true })

        try {
            const ad = await retrieveAdWithId(location.country, firstAd.id)
            expect(ad).toBeInstanceOf(Object)
            expect(ad.name).toBe(name)
            expect(ad.location.country).toBe(location.country)
            expect(ad._id.toString()).toBe(firstAd.id.toString())
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    it('returns empty object from not found ad', async () => {
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
        const price = 45
        const categories = 'modelos'

        const firstAd = await Ad.create({ user: user.id, location, title, body, price, categories })

        try {
            const ad = await retrieveAdWithId(location.country, firstAd.id)
            expect(ad).toBeInstanceOf(Object)
            expect(Object.keys(ad).length).toBe(0)
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    it('returns empty object from wrong country request', async () => {
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
        const price = 45
        const categories = 'modelos'

        const firstAd = await Ad.create({ user: user.id, location, title, body, price, categories, verified: true })

        try {
            const ad = await retrieveAdWithId('MX', firstAd.id)
            expect(ad).toBeInstanceOf(Object)
            expect(Object.keys(ad).length).toBe(0)
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    it('returns empty object from user not verified', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const user = await User.create({ name, email, password })

        const location = {
            country: 'ES',
            province: 'Madrid',
            area: 'Mi zona'
        }
        const title = 'Hola'
        const body = 'Hola'
        const price = 45
        const categories = 'modelos'

        const firstAd = await Ad.create({ user: user.id, location, title, body, price, categories, verified: true })

        try {
            const ad = await retrieveAdWithId(location.country, firstAd.id)
            expect(ad).toBeInstanceOf(Object)
            expect(Object.keys(ad).length).toBe(0)
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    afterAll(() => disconnect())
})