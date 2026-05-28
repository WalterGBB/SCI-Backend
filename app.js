const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')

const usersRouter = require('./routes/users')
const loginRouter = require('./routes/login')
const incidentsRouter = require('./routes/incidents')
const googleLoginRouter = require('./routes/googleLog')
const ambientesRouter = require('./routes/ambientes')
const cursosRouter = require('./routes/cursos')
const categoriasRouter = require('./routes/categorias')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/incidents', incidentsRouter)
app.use('/api/login/google', googleLoginRouter)
app.use('/api/ambientes', ambientesRouter)
app.use('/api/cursos', cursosRouter)
app.use('/api/categorias', categoriasRouter)
if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./routes/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app