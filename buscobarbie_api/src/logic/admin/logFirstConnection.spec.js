const { logFirstConnection } = require('..')
const { connect, disconnect } = require('mongoose')
const { FirstConnection } = require('../../models')
require('dotenv').config()
const MONGO_URL_TEST = process.env.MONGO_URL_TEST
const TEST_EMAIL = process.env.TEST_EMAIL

describe('Log First Connection', () => {
    beforeAll(() => connect(MONGO_URL_TEST))

    beforeEach(async () => {
        await FirstConnection.deleteMany()
    })

    it('succeeds loggin new first connection ip', async () => {
        const ip = '84.56.128.34'
        const locale = 'es-ES,es;q=0.9'
        const country = 'ES'

        try {
            const res = await logFirstConnection(ip, locale, country)
            expect(res).toBe(true)
        } catch (error) {
            expect(error).toBeNull()
        }
    })

    it('doesnt log new connection due to ip already existing', async () => {
        const ip = '84.56.128.34'
        const locale = 'es-ES,es;q=0.9'
        const country = 'ES'

        await FirstConnection.create({ ip, locale, country })

        try {
            const res = await logFirstConnection(ip, locale, country)
            expect(res).toBe(false)
        } catch (error) {
            expect(error).toBeNull()
        }
    })

    afterAll(() => disconnect())
})