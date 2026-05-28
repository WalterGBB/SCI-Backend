const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { tokenExtractor, userExtractor } = require('../utils/middleware') // Middlewares para extraer el token y el usuario autenticado
const authorizeRole = require('../utils/authorizeRole')

usersRouter.get(
    '/',
    tokenExtractor, userExtractor,
    async (request, response) => {
        const users = await User.find({})
        response.json(users)
    })

usersRouter.post(
    '/',
    tokenExtractor, userExtractor, authorizeRole('Administrador'),
    async (request, response, next) => {

        try {
            const { username, password, name, rol, picture, email } = request.body

            if (!password) {
                const err = new Error('Password is required.')
                err.status = 400
                return next(err)
            }

            if (password.length < 3) {
                const err = new Error('Password must be at least 3 characters long.')
                err.status = 400
                return next(err)
            }

            const saltRounds = 10
            const passwordHash = await bcrypt.hash(password, saltRounds)

            const user = new User({
                username,
                passwordHash,
                name,
                rol,
                picture,
                email
            })

            const savedUser = await user.save()

            response.status(201).json(savedUser)
        } catch (error) {
            next(error)
        }
    })

usersRouter.delete(
    '/:id',
    tokenExtractor, userExtractor, authorizeRole('Administrador'),
    async (request, response, next) => {
        try {
            const { id } = request.params
            await User.findByIdAndDelete(id)
            response.status(204).end()
        } catch (error) {
            next(error)
        }
    })

usersRouter.put('/:id',
    tokenExtractor,
    userExtractor,
    authorizeRole('Administrador'),
    async (request, response, next) => {
        try {
            const { name, rol, adminPassword } = request.body
            const targetUser = await User.findById(request.params.id)
            const requester = request.user   // 👈 usuario autenticado

            if (!targetUser) {
                return response.status(404).json({ error: 'Usuario no encontrado' })
            }

            const requesterIsAdmin = requester.rol === 'Administrador'
            const targetIsAdmin = targetUser.rol === 'Administrador'
            const assigningAdmin = rol === 'Administrador'

            // 🔐 CASOS QUE REQUIEREN CONTRASEÑA DEL ADMIN
            const needsAdminPassword =
                targetIsAdmin || assigningAdmin

            if (needsAdminPassword) {
                if (!requesterIsAdmin) {
                    return response.status(403).json({
                        error: 'Solo un administrador puede realizar esta acción'
                    })
                }

                if (!adminPassword) {
                    return response.status(401).json({
                        error: 'Contraseña del administrador requerida'
                    })
                }

                const passwordCorrect = await bcrypt.compare(
                    adminPassword,
                    requester.passwordHash
                )

                if (!passwordCorrect) {
                    return response.status(401).json({
                        error: 'Contraseña de administrador incorrecta'
                    })
                }
            }

            // ✅ Actualizaciones permitidas
            if (name) {
                targetUser.name = name
            }

            if (rol) {
                targetUser.rol = rol
            }

            const savedUser = await targetUser.save()
            response.json(savedUser)

        } catch (error) {
            next(error)
        }
    }
)

module.exports = usersRouter