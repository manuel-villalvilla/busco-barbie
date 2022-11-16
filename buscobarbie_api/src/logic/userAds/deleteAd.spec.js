const { NotFoundError } = require('errors')
const { deleteAd } = require('..')
const { connect, disconnect } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL

describe('Delete Ad', () => {
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

        await User.findOneAndDelete({ email })

        try {
            await deleteAd(userId, userId)
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe('user not found')
        }
    })

    it('succeeds deletting user ad', async () => {
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
        const price = {
            number: 45,
            negotiable: true
        }
        const categories = 'soldmodels'

        const ad0 = await Ad.create({ user: user.id, location, title, body, price, categories })
        const ad1 = await Ad.create({ user: user.id, location, title, body, price, categories })

        try {
            const userAds = await deleteAd(user.id, ad0.id)
            const ad2 = await Ad.findById(ad0.id)
            expect(ad2).toBeNull()
            expect(userAds).toHaveLength(1)
            expect(userAds[0]._id.toString() !== ad0.id.toString()).toBe(true)
        } catch (error) {
            expect(error).toBe(null)
        }

        try {
            await fs.readdir(`${folder}/${user.id.toString()}/${ad0.id.toString()}`)
        } catch (error) {
            expect(error.errno).toBe(-2) // folder does not exist
        }
    })

    afterAll(() => disconnect())
})