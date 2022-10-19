const { authenticateGoogleUser } = require('..')
const { connect, disconnect, Types: { ObjectId } } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL

describe('Authenticate Google user', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(async () => {
        const users = await User.find().lean()
        if (users.length)
            for (const user of users) await fs.rm(`${folder}/${user._id.toString()}`, { recursive: true, force: true })

        await User.deleteMany()
        await Ad.deleteMany()
    })

    it('succeeds authenticating google user', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const user = await User.create({ name, email, password, verified: true, role: 'google' })

        const res = await authenticateGoogleUser(name, email)

        expect(res).toBeInstanceOf(ObjectId)
        expect(res.toString()).toBe(user.id.toString())
    })

    it('creating google user when google authentication', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL

        try {
            const res = await authenticateGoogleUser(name, email)
            expect(typeof res).toBe('string')
        } catch (error) {
            expect(error).toBe(null)
        }

    })

    afterAll(() => disconnect())
})