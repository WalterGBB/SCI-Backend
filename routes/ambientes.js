const ambientesRouter = require('express').Router()
const Ambiente = require('../models/ambiente')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

// 1. Obtener todos los ambientes
ambientesRouter.get('/', async (request, response) => {
    const ambientes = await Ambiente.find({})
    response.json(ambientes)
})

// 2. Obtener un ambiente por ID
ambientesRouter.get('/:id', async (request, response) => {
    try {
        const { id } = request.params
        const ambiente = await Ambiente.findById(id)

        if (!ambiente) {
            return response.status(404).json({ error: 'Ambiente no encontrado' })
        }
        response.json(ambiente)
    } catch (error) {
        response.status(400).json({ error: 'ID de ambiente inválido' })
    }
})

// 3. Crear un nuevo ambiente
ambientesRouter.post(
    '/',
    tokenExtractor,
    userExtractor,
    async (request, response, next) => {

        try {

            const {
                nombre,
                tipo,
                subtipo,
                configuracion,
                activos
            } = request.body

            const ambiente = new Ambiente({

                nombre,

                tipo,

                subtipo: tipo === 'Aula'
                    ? subtipo
                    : null,

                configuracion:
                    tipo === 'Laboratorio'
                        ? configuracion
                        : {},

                activos
            })

            const saved = await ambiente.save()

            response.status(201).json(saved)

        } catch (error) {
            next(error)
        }
    }
)

// 4. Eliminar un ambiente
ambientesRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const { id } = request.params

        // Opcional: Podrías verificar aquí si el usuario es Admin 
        // if (request.user.rol !== 'Administrador') { ... }

        const ambienteAEliminar = await Ambiente.findById(id)

        if (!ambienteAEliminar) {
            return response.status(404).json({ error: 'El ambiente no existe' })
        }

        await Ambiente.findByIdAndDelete(id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

// 5. Actualizar un ambiente
ambientesRouter.put(
    '/:id/edit',
    tokenExtractor,
    userExtractor,
    async (request, response, next) => {
        try {
            const { id } = request.params
            const {
                nombre,
                subtipo,
                configuracion,
                activos
            } = request.body

            const ambiente = await Ambiente.findById(id)

            if (!ambiente) {
                return response.status(404).json({
                    error: 'El ambiente no existe'
                })
            }
            // =====================================
            // ACTUALIZAR
            // =====================================
            ambiente.nombre = nombre

            if (ambiente.tipo === 'Aula') {
                ambiente.subtipo = subtipo
            }

            if (ambiente.tipo === 'Laboratorio') {
                ambiente.configuracion = configuracion
            }

            ambiente.activos = activos

            // =====================================
            // GUARDAR
            // =====================================
            const saved = await ambiente.save()
            response.status(200).json(saved)
        } catch (error) {
            next(error)
        }
    }
)

module.exports = ambientesRouter