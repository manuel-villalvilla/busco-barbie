const { recoverPassword } = require('..')
const { connect, disconnect } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL

describe('Recover password', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(async () => {
        const users = await User.find().lean()
        if (users.length)
            for (const user of users) await fs.rm(`${folder}/${user._id.toString()}`, { recursive: true, force: true })

        await User.deleteMany()
        await Ad.deleteMany()
    })

    it('succeeds sending recover password email', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        await User.create({ name, email, password })

        try {
            const info = await recoverPassword(email)
            expect(info).toBeInstanceOf(Object)
            expect(info.accepted).toHaveLength(1)
            expect(info.accepted).toEqual([email])
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    it('fails sending recover password email due to user not found', async () => {
        const email = TEST_EMAIL

        try {
            const info = await recoverPassword(email)
            expect(typeof info).toBe('string')
            expect(info).toBe('no user')
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    afterAll(() => disconnect())
})