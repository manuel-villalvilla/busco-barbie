const { NotFoundError } = require('errors')
const { retrieveUserWithAds } = require('..')
const { connect, disconnect } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL

describe('Retrieve user with Ads', () => {
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

        const user = await User.create({ name, email, password })
        const userId = user.id

        await User.findByIdAndDelete(user.id)

        try {
            const pack = await retrieveUserWithAds(userId)
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe('user not found')
        }
    })

    it('succeeds retrieving user with ads', async () => {
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
        const categories = 'modelos'
        const price = '45'

        const user = await User.create({ name, email, password })

        for (let i = 0; i < 5; i++) await Ad.create({ user: user.id, title, body, location, categories, price })

        try {
            const pack = await retrieveUserWithAds(user.id)
            expect(pack).toBeInstanceOf(Object)
            expect(pack.count).toBe(5)
            expect(pack.user._id.toString()).toBe(user.id.toString())
            expect(pack.user.email).toBe(TEST_EMAIL)
            expect(pack.ads).toHaveLength(5)
        } catch (error) {
            expect(error).toBeNull()
        }
    })

    afterAll(() => disconnect())
})