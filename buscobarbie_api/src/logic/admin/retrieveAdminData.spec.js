const { NotFoundError, CredentialsError } = require('errors')
const { retrieveAdminData } = require('..')
const { connect, disconnect } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL

describe('Retrieve admin data', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(async () => {
        const users = await User.find().lean()
        if (users.length)
            for (const user of users) await fs.rm(`${folder}/${user._id.toString()}`, { recursive: true, force: true })

        await User.deleteMany()
        await Ad.deleteMany()
    })

    it('fails with admin user not found', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const user = await User.create({ name, email, password, role: 'admin' })
        const userId = user.id

        await User.findOneAndDelete({ email })

        try {
            await retrieveAdminData(userId)
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe('user not found')
        }
    })

    it('fails with not authorized user', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const user = await User.create({ name, email, password })

        try {
            await retrieveAdminData(user.id)
        } catch (error) {
            expect(error).toBeInstanceOf(CredentialsError)
            expect(error.message).toBe('not authorized')
        }
    })

    it('succeeds retrieving admin data', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const name2 = 'Pepito Grillo'
        const email2 = 'pepito@grillo.com'
        const password2 = await bcrypt.hash('123123123', 10)

        const adminUser = await User.create({ name, email, password, role: 'admin', verified: true })

        const user = await User.create({ name: name2, email: email2, password: password2 })

        const location = {
            country: 'ES',
            province: 'Madrid',
            area: 'Mi zona'
        }
        const title = 'Hola'
        const body = 'Hola'
        const price = 45
        const categories = 'modelos'

        const ad = await Ad.create({ user: user.id, location, title, body, price, categories })

        try {
            const pack = await retrieveAdminData(adminUser.id)
            expect(pack).toBeInstanceOf(Object)
            expect(pack.uAdsCount).toBe(1)
            expect(pack.uAds).toHaveLength(1)
            expect(pack.uUsersCount).toBe(1)
            expect(pack.uUsers).toHaveLength(1)
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    afterAll(() => disconnect())
})