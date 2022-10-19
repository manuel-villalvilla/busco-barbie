const { VerificationError, NotFoundError, CredentialsError, GoogleError } = require('errors') // errores indexados en un index.js
const { authenticateUser } = require('..')
const { connect, disconnect } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL

describe('Authenticate User', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(async () => {
        const users = await User.find().lean()
        if (users.length)
            for (const user of users) await fs.rm(`${folder}/${user._id.toString()}`, { recursive: true, force: true })

        await User.deleteMany()
        await Ad.deleteMany()
    })

    it('succeeds authenticating user when verified', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const user = await User.create({ name, email, password, verified: true })

        const res = await authenticateUser(email, '123123123')

        expect(res).toBeInstanceOf(Object)
        expect(res.id).toBe(user.id.toString())
        expect(res.role).toBe('source')
    })

    it('fails authenticating non verified user', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = '123123123'

        const user = await User.create({ name, email, password })

        try {
            const res = await authenticateUser(email, '123123123')
        } catch (error) {
            expect(error).toBeInstanceOf(VerificationError)
            expect(error.message).toBe('unverified user')
        }

    })

    it('fails authenticating not found user', async () => {
        const email = TEST_EMAIL
        const password = '123123123'

        try {
            const res = await authenticateUser(email, '123123123')
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe('user not found')
        }

    })

    it('fails authenticating google user', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = '123123123'

        const user = await User.create({ name, email, password, role: 'google', verified: true })

        try {
            const res = await authenticateUser(email, '123123123')
        } catch (error) {
            expect(error).toBeInstanceOf(GoogleError)
            expect(error.message).toBe('unauthorized google account sign in')
        }

    })

    it('fails authenticating user with wrong credentials', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = '123123123'

        const user = await User.create({ name, email, password, verified: true })

        try {
            const res = await authenticateUser(email, '1231231234')
        } catch (error) {
            expect(error).toBeInstanceOf(CredentialsError)
            expect(error.message).toBe('email or password incorrect')
        }

    })

    afterAll(() => disconnect())
})