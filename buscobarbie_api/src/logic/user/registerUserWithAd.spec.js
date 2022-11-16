const { DuplicityError } = require('errors') // errores indexados en un index.js
const { registerUserWithAd } = require('..')
const { connect, disconnect, Types: { ObjectId } } = require('mongoose')
const { User, Ad } = require('../../models')
const bcrypt = require('bcryptjs')
const { join } = require('path')
const folder = join(__dirname, '../../../files')
const imgsFolder = join(__dirname, '../../populate')
const fs = require('fs/promises')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const NAS_IMAGES_URL = process.env.NAS_IMAGES_URL
const TEST_EMAIL = process.env.TEST_EMAIL

describe('Register User', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(async () => {
        const users = await User.find().lean()
        if (users.length)
            for (const user of users) await fs.rm(`${folder}/${user._id.toString()}`, { recursive: true, force: true })

        await User.deleteMany()
        await Ad.deleteMany()
    })

    it('succeeds registering a new user with ad', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = '123123123'
        const country_code = 'ES'
        const title = 'Hola'
        const body = 'Hola'
        const province = 'Madrid'
        const area = 'Mi zona'
        const phone = '678564544'
        const price = {
            number: 45,
            negotiable: true
        }
        const categories = 'soldmodels'
        const year = '1980'
        const data1 = await fs.readFile(`${imgsFolder}/1.jpg`)
        const data2 = await fs.readFile(`${imgsFolder}/2.jpg`)
        const file1Name = '1.jpg'
        const file2Name = '2.jpg'
        const images = [
            {
                name: file1Name,
                data: data1
            },
            {
                name: file2Name,
                data: data2
            }
        ]
        const tags = 'Fashionistas,Made to move'

        return registerUserWithAd(country_code, name, email, password, title, body, province, area, phone, price, categories, images, year, tags)
            .then(info => {
                expect(info).toBeInstanceOf(Object)
                expect(info.accepted).toHaveLength(1)
                expect(info.accepted).toEqual([email])
                return User.find({ email }).lean()
                    .then(([user]) => {
                        expect(user._id).toBeInstanceOf(ObjectId)
                        expect(user.name).toBe(name)
                        expect(user.email).toBe(email)
                        expect(user.verified).toBe(false)
                        expect(user.role).toBe('source')
                        return bcrypt.compare(password, user.password)
                            .then(status => {
                                expect(status).toBe(true)
                                return Ad.find({ user: user._id }).lean()
                                    .then(([ad]) => {
                                        expect(ad._id).toBeInstanceOf(ObjectId)
                                        expect(ad.user).toBeInstanceOf(ObjectId)
                                        expect(ad.user.toString()).toBe(user._id.toString())
                                        expect(typeof ad.title).toBe('string')
                                        expect(ad.title).toBe('Hola')
                                        expect(typeof ad.body).toBe('string')
                                        expect(ad.body).toBe('Hola')
                                        expect(ad.location).toBeInstanceOf(Object)
                                        expect(typeof ad.location.country).toBe('string')
                                        expect(ad.location.country).toBe('ES')
                                        expect(typeof ad.location.province).toBe('string')
                                        expect(ad.location.province).toBe('Madrid')
                                        expect(typeof ad.location.area).toBe('string')
                                        expect(ad.location.area).toBe('Mi zona')
                                        expect(typeof ad.phone).toBe('string')
                                        expect(ad.phone).toBe('678564544')
                                        expect(ad.image).toBeInstanceOf(Array)
                                        expect(ad.image[0]).toBe(`${NAS_IMAGES_URL}/${user._id.toString()}/${ad._id.toString()}/${images[0].name}`)
                                        expect(ad.image[1]).toBe(`${NAS_IMAGES_URL}/${user._id.toString()}/${ad._id.toString()}/${images[1].name}`)
                                        expect(typeof ad.categories).toBe('string')
                                        expect(ad.categories).toBe('soldmodels')
                                        expect(typeof ad.year).toBe('string')
                                        expect(ad.year).toBe('1980')
                                        expect(ad.tags).toBeInstanceOf(Array)
                                        expect(ad.tags).toEqual(['Fashionistas', 'Made to move'])
                                        expect(ad.price).toBeInstanceOf(Object)
                                        expect(typeof ad.price.number).toBe('number')
                                        expect(ad.price.number).toBe(45)
                                        expect(ad.price.negotiable).toBe(true)
                                        expect(typeof ad.visibility).toBe('string')
                                        expect(ad.visibility).toBe('public')
                                        expect(typeof ad.verified).toBe('boolean')
                                        expect(ad.verified).toBe(false)
                                        return fs.readdir(`${folder}/${user._id.toString()}/${ad._id.toString()}`)
                                            .then(files => {
                                                expect(files[0]).toEqual('1.jpg')
                                                expect(files[1]).toEqual('2.jpg')
                                            })
                                            .catch(error => expect(error).toBe(null))
                                    })
                            })
                    })
            })
    })

    it('succeeds registering a new user with ad', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = '123123123'
        const country_code = 'MX'
        const title = 'Hola'
        const body = 'Hola'
        const province = 'Aguascalientes'
        const area = ''
        const price = {
            number: 45,
            negotiable: true
        }
        const categories = 'soldaccessories'
        const phone = ''
        const images = []
        const year = ''
        const tags = []

        return registerUserWithAd(country_code, name, email, password, title, body, province, area, phone, price, categories, images, year, tags)
            .then(info => {
                expect(info).toBeInstanceOf(Object)
                expect(info.accepted).toHaveLength(1)
                expect(info.accepted).toEqual([email])
                return User.find({ email }).lean()
                    .then(([user]) => {
                        expect(user._id).toBeInstanceOf(ObjectId)
                        expect(user.name).toBe(name)
                        expect(user.email).toBe(email)
                        expect(user.verified).toBe(false)
                        expect(user.role).toBe('source')
                        return bcrypt.compare(password, user.password)
                            .then(status => {
                                expect(status).toBe(true)
                                return Ad.find({ user: user._id }).lean()
                                    .then(([ad]) => {
                                        expect(ad._id).toBeInstanceOf(ObjectId)
                                        expect(ad.user).toBeInstanceOf(ObjectId)
                                        expect(ad.user.toString()).toBe(user._id.toString())
                                        expect(typeof ad.title).toBe('string')
                                        expect(ad.title).toBe('Hola')
                                        expect(typeof ad.body).toBe('string')
                                        expect(ad.body).toBe('Hola')
                                        expect(ad.location).toBeInstanceOf(Object)
                                        expect(typeof ad.location.country).toBe('string')
                                        expect(ad.location.country).toBe('MX')
                                        expect(typeof ad.location.province).toBe('string')
                                        expect(ad.location.province).toBe('Aguascalientes')
                                        expect(typeof ad.location.area).toBe('string')
                                        expect(ad.location.area).toBe('')
                                        expect(typeof ad.phone).toBe('string')
                                        expect(ad.phone).toBe('')
                                        expect(ad.image).toBeInstanceOf(Array)
                                        expect(ad.image).toHaveLength(0)
                                        expect(typeof ad.categories).toBe('string')
                                        expect(ad.categories).toBe('soldaccessories')
                                        expect(typeof ad.year).toBe('string')
                                        expect(ad.year).toBe('')
                                        expect(ad.tags).toBeInstanceOf(Array)
                                        expect(ad.tags).toHaveLength(0)
                                        expect(typeof ad.price.number).toBe('number')
                                        expect(ad.price.number).toBe(45)
                                        expect(ad.price.negotiable).toBe(true)
                                        expect(typeof ad.visibility).toBe('string')
                                        expect(ad.visibility).toBe('public')
                                        expect(typeof ad.verified).toBe('boolean')
                                        expect(ad.verified).toBe(false)
                                        return fs.readdir(`${folder}/${user._id.toString()}/${ad._id.toString()}`)
                                            .then(files => {
                                                expect(files).toHaveLength(0)
                                            })
                                            .catch(error => expect(error).toBe(null))
                                    })
                            })
                    })
            })
    })

    it('fails with existing user', async () => {
        const name = 'Manuel Villalvilla'
        const email = TEST_EMAIL
        const password = '123123123'
        const country_code = 'ES'
        const title = 'Hola'
        const body = 'Hola'
        const province = 'Madrid'
        const area = 'Mi zona'
        const phone = '678987654'
        const price = {
            number: 45,
            negotiable: true
        }
        const categories = 'soldmodels'
        const year = '1980'
        const images = []
        const tags = []

        await User.create({ name, email, password })

        return registerUserWithAd(country_code, name, email, password, title, body, province, area, phone, price, categories, images, year, tags)
            .then(() => {
                // throws error if registerUserWithAd succeeds
                throw new Error('should not reach this point')
            })
            .catch(error => {
                expect(error).toBeInstanceOf(DuplicityError)
                expect(error.message).toBe('user already exists')
            })
    })

    afterAll(() => disconnect())
})