require('dotenv').config()
const { env: { MONGO_URL, PORT, APP_URL } } = process
const { connect, disconnect } = require('mongoose')
const { logger } = require('./utils')
const cors = require('cors')
const { adsRouter, usersRouter, utilsRouter, adminRouter } = require('./routes')
const { name, version } = require('../package.json')

connect(MONGO_URL)
    .then(() => {
        logger.info('mongodb connected')

        const express = require('express')

        const api = express()

        api.use(cors())

        api.get('/', (req, res) => {
            logger.info(`User get host ${req.headers.host} with IP ${req.headers['x-real-ip']} forwarded for ${req.headers['x-forwarded-for']} proto ${req.headers['x-forwarded-proto']} user-agent ${req.headers['user-agent']}`)
            res.redirect(308, APP_URL)
        })

        api.use('/api', adsRouter, usersRouter, utilsRouter, adminRouter)

        api.use('/files', express.static('files'))
        
        api.listen(PORT, () => logger.info(`${name} v${version} started`))

        process.on('SIGINT', async () => { // similar a eventListener pero de node. SIGINT = CTRL+C
            await disconnect()

            logger.info('db disconnected')

            logger.info('api stopped')

            process.exit(0) // para q pare el server, porque ahora yo he tomado el control de CTRL+C
        })
    })
    .catch(error => console.log(error.message))