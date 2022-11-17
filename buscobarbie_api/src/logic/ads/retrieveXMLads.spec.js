const { retrieveXMLads } = require('..')
const { connect, disconnect } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL

describe('Retrieve XML ads', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(async () => {
        const users = await User.find().lean()
        if (users.length)
            for (const user of users) await fs.rm(`${folder}/${user._id.toString()}`, { recursive: true, force: true })

        await User.deleteMany()
        await Ad.deleteMany()
    })

    it('succeeds retrieving ad ids from country', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const user = await User.create({ name, email, password, verified: true })

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

        const firstAd = await Ad.create({ user: user.id, location, title, body, price, categories, verified: true })

        try {
            const adIds = await retrieveXMLads(location.country)
            expect(adIds).toBeInstanceOf(Object)
            expect(adIds.length).toBe(1)
            expect(adIds[0]).toBe(firstAd.id.toString())
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    it('fails from providing wrong country', async () => {
        try {
            const ad = await retrieveXMLads('ER')
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).toBeInstanceOf(Error)
            expect(error.message).toBe('invalid country')
        }
    })

    afterAll(() => disconnect())
})