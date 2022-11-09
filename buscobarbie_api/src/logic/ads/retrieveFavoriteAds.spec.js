const { retrieveFavoriteAds } = require('..')
const { connect, disconnect } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL

describe('Retrieve favorite ads', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(async () => {
        const users = await User.find().lean()
        if (users.length)
            for (const user of users) await fs.rm(`${folder}/${user._id.toString()}`, { recursive: true, force: true })

        await User.deleteMany()
        await Ad.deleteMany()
    })

    it('succeeds retrieving favorite ads', async () => {
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
        const secondAd = await Ad.create({ user: user.id, location, title, body, price, categories, verified: true })

        const ids = [firstAd.id.toString(), secondAd.id.toString()]

        try {
            const ads = await retrieveFavoriteAds(ids)
            expect(ads).toBeInstanceOf(Object)
            expect(ads.length).toBe(2)
            expect(ads[0]._id.toString()).toBe(firstAd.id.toString())
            expect(ads[1]._id.toString()).toBe(secondAd.id.toString())
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    it('returns null from not found ad', async () => {
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

        const ids = [firstAd.id.toString(), user.id.toString()]

        try {
            const ads = await retrieveFavoriteAds(ids)
            expect(ads).toBeInstanceOf(Object)
            expect(ads.length).toBe(2)
            expect(ads[0]._id.toString()).toBe(firstAd.id.toString())
            expect(ads[1]).toBeNull()
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    afterAll(() => disconnect())
})