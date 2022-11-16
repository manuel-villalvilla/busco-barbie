const { reportAd } = require('..')
const { NotFoundError } = require('errors')
const { connect, disconnect } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL

describe('Report Ad', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(async () => {
        const users = await User.find().lean()
        if (users.length)
            for (const user of users) await fs.rm(`${folder}/${user._id.toString()}`, { recursive: true, force: true })

        await User.deleteMany()
        await Ad.deleteMany()
    })

    it('fails sending report due to ad not found', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)
        const select = 'falseAd'
        const message = 'Hola'

        const user = await User.create({ name, email, password })

        try {
            const res = await reportAd(select, message, user.id)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe('ad to report not found')
        }
    })

    it('succeeds sending report to admin', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)
        const select = 'falseAd'
        const message = 'Hola'
        const title = 'Hola'
        const body = 'Hola'
        const price = {
            number: 45,
            negotiable: true
        }
        const categories = 'soldaccessories'
        const location = {
            country: 'ES',
            province: 'Madrid',
            area: ''
        }

        const user = await User.create({ name, email, password })

        const ad = await Ad.create({ user: user.id, title, body, price, categories, location })

        try {
            const res = await reportAd(select, message, ad.id)
            expect(res.accepted).toHaveLength(1)
            expect(res.accepted).toEqual([SUPPORT_EMAIL])
            expect(res.rejected).toHaveLength(0)
        } catch (error) {
            expect(error).toBeNull()
        }

    })

    afterAll(() => disconnect())
})