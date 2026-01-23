const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
    try {
        const { username, password, name, rol } = request.body

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
            rol
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    } catch (error) {
        next(error)
    }
})

module.exports = usersRouter