const { NotFoundError, CredentialsError } = require('errors')
const { verifyAd } = require('..')
const { connect, disconnect } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL

describe('Admin verify ad', () => {
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

        const user = await User.create({ name, email, password, role: 'admin' })
        const userId = user.id

        const ad = await Ad.create({ user: user.id, title, body, price, categories, location })

        await User.findOneAndDelete({ email })

        try {
            await verifyAd(userId, ad.id)
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe('user not found')
        }
    })

    it('fails with not authorized user', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)
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
            await verifyAd(user.id, ad.id)
        } catch (error) {
            expect(error).toBeInstanceOf(CredentialsError)
            expect(error.message).toBe('not authorized')
        }
    })

    it('fails with not found ad', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)
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

        const user = await User.create({ name, email, password, role: 'admin' })

        const ad = await Ad.create({ user: user.id, title, body, price, categories, location })
        const adId = ad.id

        await Ad.findOneAndDelete({ user: user.id })

        try {
            await verifyAd(user.id, adId)
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe('ad not found')
        }
    })

    it('succeeds verifying user ad', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const user = await User.create({ name, email, password, role: 'admin' })

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

        const ad = await Ad.create({ user: user.id, location, title, body, price, categories })

        try {
            const info = await verifyAd(user.id, ad.id)
            expect(info).toBeInstanceOf(Object)
            expect(info.accepted).toHaveLength(1)
            expect(info.accepted).toEqual([email])
            const ad2 = await Ad.findById(ad.id)
            expect(ad2.verified).toBe(true)
        } catch (error) {
            expect(error).toBe(null)
        }
    })

    afterAll(() => disconnect())
})