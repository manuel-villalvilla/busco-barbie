const { DuplicityError } = require('errors') // errores indexados en un index.js
const { registerUser } = require('..')
const { connect, disconnect } = require('mongoose')
const { User } = require('../../models')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST

describe('Register User', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(() => User.deleteMany())

    it('succeeds registering a new user', async () => { // happy path
        const name = 'Pepito Grillo'
        const email = 'pepito@grillo.com'
        const password = '123123123'

        return registerUser(name, email, password)
            .then(() => User.find({ email }))
            .then(([user]) => {
                expect(user.name).toBe(name)
                expect(user.email).toBe(email)
                expect(user.password).toBe(password)
            })
    })

    it('fails with existing user', async () => { // unhappy path
        const name = 'Pepito Grillo'
        const email = 'pepito@grillo.com'
        const password = '123123123'

        await User.create({ name, email, password })

        return registerUser(name, email, password)
            .then(() => {
                throw new Error('should not reach this point') // tiro un error si sigue por aqui
            })
            .catch(error => {
                expect(error).toBeInstanceOf(DuplicityError)
                expect(error.message).toBe(`user with email ${email} already exists`)
            })
    })

    afterAll(() => disconnect('mongodb://localhost:27017/test'))
})