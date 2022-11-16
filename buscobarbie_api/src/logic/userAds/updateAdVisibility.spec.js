const { NotFoundError, CredentialsError } = require('errors')
const { updateAdVisibility } = require('..')
const { connect, disconnect } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL


describe('Update Ad Visibility', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(async () => {
        const users = await User.find().lean()
        if (users.length)
            for (const user of users) await fs.rm(`${folder}/${user._id.toString()}`, { recursive: true, force: true })

        await User.deleteMany()
        await Ad.deleteMany()
    })

    it('fails with user not found', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)
        const visibility = 'private'

        const user = await User.create({ name, email, password })
        const userId = user.id

        await User.findByIdAndDelete(user.id)

        try {
            await updateAdVisibility(visibility, userId, userId)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe('user not found')
        }
    })

    it('fails with ad not found', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)
        const visibility = 'private'

        const user = await User.create({ name, email, password })

        try {
            await updateAdVisibility(visibility, user.id, user.id)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBe('ad not found')
        }
    })

    it('fails with ad not belonging to user', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const title = 'Hola'
        const body = 'Hola'
        const location = {
            country: 'ES',
            province: 'Madrid',
            area: ''
        }
        const visibility = 'private'
        const categories = 'soldmodels'
        const price = {
            number: 45,
            negotiable: true
        }

        const user = await User.create({ name, email, password })
        const user2 = await User.create({ name: 'Pepito Grillo', email: 'pepito@grillo.com', password: await bcrypt.hash('123123123', 10) })

        const ad = await Ad.create({ user: user2.id, title, body, location, categories, price })

        try {
            await updateAdVisibility(visibility, user.id, ad.id)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).toBeInstanceOf(CredentialsError)
            expect(error.message).toBe('ad does not belong to user')
        }
    })

    it('succeeds updating ad visibility', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = await bcrypt.hash('123123123', 10)

        const title = 'Hola'
        const body = 'Hola'
        const location = {
            country: 'ES',
            province: 'Madrid',
            area: 'Mi zona'
        }
        const categories = 'soldmodels'
        const price = {
            number: 50,
            negotiable: true
        }
        const visibility = 'private'

        const user = await User.create({ name, email, password })

        const ad = await Ad.create({ user: user.id, title, body, location, categories, price })

        try {
            const ads = await updateAdVisibility(visibility, user.id, ad.id)
            expect(ads).toHaveLength(1)
            expect(ads[0].title).toBe('Hola')
            expect(ads[0].body).toBe('Hola')
            expect(ads[0].location.country).toBe('ES')
            expect(ads[0].location.province).toBe('Madrid')
            expect(ads[0].location.area).toBe('Mi zona')
            expect(ads[0].phone).toBe('')
            expect(ads[0].price.number).toBe(50)
            expect(ads[0].price.negotiable).toBe(true)
            expect(ads[0].categories).toBe('soldmodels')
            expect(ads[0].year).toBe('')
            expect(ads[0].tags).toEqual([])
            expect(ads[0].image).toEqual([])
            expect(ads[0].visibility).toBe('private')
        } catch (error) {
            expect(error).toBeNull()
        }
    })

    afterAll(() => disconnect())
})