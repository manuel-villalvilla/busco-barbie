const { NotFoundError } = require('errors')
const { updateUser } = require('..')
const { connect, disconnect } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL

describe('Update user', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(async () => {
        const users = await User.find().lean()
        if (users.length)
            for (const user of users) await fs.rm(`${folder}/${user._id.toString()}`, { recursive: true, force: true })

        await User.deleteMany()
        await Ad.deleteMany()
    })

    it('succeeds updating user password and name', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const firstUser = await User.create({ name, email, password })

        try {
            const user = await updateUser(firstUser.id, 'Manu', '124124124') // returns updated user
            expect(typeof user.name).toBe('string')
            expect(user.name).toBe('Manu')
            const res = await bcrypt.compare('124124124', user.password)
            expect(res).toBe(true)
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    it('succeeds updating user name', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const firstUser = await User.create({ name, email, password })

        try {
            const user = await updateUser(firstUser.id, 'Manu', '') // returns updated user
            expect(typeof user.name).toBe('string')
            expect(user.name).toBe('Manu')
            const res = await bcrypt.compare('123123123', user.password)
            expect(res).toBe(true)
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    it('fails with user not found trying to update name and password', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const user = await User.create({ name, email, password })
        const userId = user.id

        await User.findOneAndDelete({ email })

        try {
            await updateUser(userId, 'Manu', '124124124')
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user not found`)
        }
    })

    it('fails with user not found trying to update name', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const user = await User.create({ name, email, password })
        const userId = user.id

        await User.findOneAndDelete({ email })

        try {
            await updateUser(userId, 'Manu', '')
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe(`user not found`)
        }
    })

    

    afterAll(() => disconnect())
})