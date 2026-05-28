const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null
    }
    next()
}

const userExtractor = async (request, response, next) => {
    const token = request.token

    if (!token) {
        return response.status(401).json({ error: 'token missing' })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token does not contain an id' })
        }

        const user = await User.findById(decodedToken.id)
        if (!user) {
            return response.status(401).json({ error: 'user not found' })
        }

        request.user = user
        next()
    } catch (error) {
        next(error)
    }
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    // 1. Errores de Formato de ID (Mongoose)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'El ID proporcionado no tiene un formato válido.' });
    }

    // 2. Errores de Validación (Campos obligatorios, longitud, etc.)
    if (error.name === 'ValidationError') {
        // Mongoose devuelve un objeto con cada campo fallido. 
        // Aquí extraemos solo los mensajes específicos.
        const mensajes = Object.values(error.errors).map(e => e.message);
        return response.status(400).json({
            error: 'Error de validación',
            detalles: mensajes // Esto devolverá algo como ["El nombre es obligatorio"]
        });
    }

    // 3. Duplicados (MongoDB)
    if (error.name === 'MongoServerError' && error.code === 11000) {
        // Es más seguro usar error.code === 11000 que buscar el string
        return response.status(400).json({ error: 'El nombre de usuario ya está en uso. Debe ser único.' });
    }

    // 4. Errores de Autenticación (JWT)
    if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'Token inválido o malformado.' });
    }

    if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.' });
    }

    next(error);
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    tokenExtractor,
    userExtractor,
    errorHandler
}