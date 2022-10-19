const { NotFoundError } = require('errors')
const { contactUser } = require('..')
const { connect, disconnect } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL

describe('Contact user', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(async () => {
        const users = await User.find().lean()
        if (users.length)
            for (const user of users) await fs.rm(`${folder}/${user._id.toString()}`, { recursive: true, force: true })

        await User.deleteMany()
        await Ad.deleteMany()
    })

    it('succeeds contacting user', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const user = await User.create({ name, email, password, verified: true })
        const userId = user.id

        const userName = 'Pepito Grillo'
        const userEmail = 'pepito@grillo.com'
        const body = 'hola'

        try {
            await contactUser(userName, userEmail, body, userId)
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    it('fails with user not found', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const user = await User.create({ name, email, password, verified: true })
        const userId = user.id

        await User.findOneAndDelete({ email })

        const userName = 'Pepito Grillo'
        const userEmail = 'pepito@grillo.com'
        const body = 'hola'

        try {
            await contactUser(userName, userEmail, body, userId)
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe('user not found')
        }
    })

    afterAll(() => disconnect())
})