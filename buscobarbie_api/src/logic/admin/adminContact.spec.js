const { adminContact } = require('..')
const { connect, disconnect } = require('mongoose')
const { User, Ad } = require('../../models')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL

describe('Admin Contact', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(async () => {
        const users = await User.find().lean()
        if (users.length)
            for (const user of users) await fs.rm(`${folder}/${user._id.toString()}`, { recursive: true, force: true })

        await User.deleteMany()
        await Ad.deleteMany()
    })

    it('succeeds sending email to admin', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const option = 'problem'
        const message = 'Hola'

        try {
            const res = await adminContact(name, email, option, message)
            expect(res.accepted).toHaveLength(1)
            expect(res.accepted).toEqual([SUPPORT_EMAIL])
            expect(res.rejected).toHaveLength(0)
        } catch (error) {
            expect(error).toBeNull()
        }

    })

    afterAll(() => disconnect())
})