const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const User = require('../models/user')

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const googleLoginRouter = require('express').Router()

googleLoginRouter.post('/', async (request, response) => {
    const { token } = request.body

    try {
        // 1. Verificar token con Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()

        const {
            email,
            name,
            sub,          // ID único de Google
            picture
        } = payload

        // 2. Buscar usuario existente
        let user = await User.findOne({ googleId: sub })

        // 3. Si no existe, crearlo
        if (!user) {
            user = new User({
                username: email,
                name,
                googleId: sub,
                rol: 'docente' // o el rol por defecto
            })
            await user.save()
        }

        // 4. Crear TU JWT (igual que el login normal)
        const userForToken = {
            username: user.username,
            id: user._id
        }

        const systemToken = jwt.sign(
            userForToken,
            process.env.SECRET,
            { expiresIn: 60 * 60 }
        )

        response.status(200).json({
            token: systemToken,
            username: user.username,
            name: user.name,
            rol: user.rol
        })

    } catch (error) {
        console.error(error)
        response.status(401).json({ error: 'Google authentication failed' })
    }
})

module.exports = googleLoginRouter