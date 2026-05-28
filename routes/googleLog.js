const jwt = require('jsonwebtoken')
const User = require('../models/user')

const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
)

const googleLoginRouter = require('express').Router()

googleLoginRouter.post('/', async (request, response) => {
    const { code } = request.body

    try {
        // 1️⃣ Intercambiar code por tokens de Google
        const { tokens } = await client.getToken(code)
        client.setCredentials(tokens)

        // 2️⃣ Verificar ID TOKEN real
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()

        const {
            email,
            name,
            sub,      // googleId
            hd,       // dominio
            picture    // picture
        } = payload

        // (opcional pero recomendado)
        if (hd !== 'unc.edu.pe') {
            return response.status(403).json({ error: 'Dominio no permitido' })
        }

        // 3️⃣ Buscar / crear usuario
        let user = await User.findOne({ googleId: sub })

        if (!user) {
            user = new User({
                username: email,
                name,
                googleId: sub,
                rol: 'Docente',
                picture: picture,
                email: email
            })
            await user.save()
        }

        // 4️⃣ Crear JWT del sistema
        const userForToken = {
            username: user.username,
            id: user._id
        }

        const systemToken = jwt.sign(
            userForToken,
            process.env.SECRET,
            { expiresIn: '1h' }
        )

        response.status(200).json({
            token: systemToken,
            username: user.username,
            name: user.name,
            rol: user.rol,
            picture: user.picture,
            email: user.email
        })

    } catch (error) {
        console.error("DETALLE DEL ERROR DE GOOGLE:", error); // Esto te dirá si es "invalid_grant", "redirect_uri_mismatch", etc.
        response.status(401).json({
            error: 'Google authentication failed',
            details: error.message
        })
    }
})

module.exports = googleLoginRouter