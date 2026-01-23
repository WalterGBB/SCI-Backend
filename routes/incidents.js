/**
 * RESUMEN DEL ARCHIVO:
 * 
 * Este archivo define y exporta el router `incidentsRouter` que maneja las rutas relacionadas a las incidencias.
 * Se conecta con el modelo `Incident` y `User`, y utiliza middlewares para autenticar al usuario mediante tokens.
 * 
 * Funcionalidades:
 * - GET `/api/incidents`            → Obtener todos los incidents con información del usuario que lo creó.
 * - GET `/api/incidents/:id`        → Obtener un Incident específico por ID.
 * - POST `/api/incidents`           → Crear un nuevo Incident (requiere token y usuario).
 * - DELETE `/api/incidents/:id`     → Eliminar un Incident solo si pertenece al usuario autenticado.
 * - PUT `/api/incidents/:id`        → Incrementar los prioridad, procedencia, estado de un Incident.
 */

const incidentsRouter = require('express').Router() // Creamos un router de Express
const Incident = require('../models/incident') // Importamos el modelo de Incident (colección en MongoDB)
const { tokenExtractor, userExtractor } = require('../utils/middleware') // Middlewares para extraer el token y el usuario autenticado

// Obtener todas las incidencias, incluyendo información básica del usuario que las creó
incidentsRouter.get('/', async (request, response) => {
    const incidents = await Incident.find({}).populate('user', { name: 1, rol: 1 }) // .populate() incluye los datos del usuario
    response.json(incidents) // Se envía el array de incidents como JSON
})

// Obtener un solo Incident por ID
incidentsRouter.get('/:id', async (request, response) => {
    const { id } = request.params // Extraemos el ID de los parámetros de la necesidad
    const Incident = await Incident.findById(id) // Buscamos el Incident por ID
    if (Incident) {
        response.json(Incident) // Si se encuentra, lo devolvemos
    } else {
        response.status(404).end() // Si no, devolvemos error 404
    }
})

// Crear un nuevo Incident (requiere autenticación)
incidentsRouter.post('/', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const { curso, docente, procedencia, prioridad, activosReportados, observaciones } = request.body // Extraemos los campos del Incident del cuerpo del request
        const user = request.user // Obtenemos el usuario autenticado desde el middleware

        // Creamos una nueva instancia de Incident
        const incident = new Incident({
            fechaRegistro: Date.now(), // Fecha actual
            fechaResolucion: null, // Inicialmente null hasta que se resuelva
            curso,
            docente,
            procedencia,
            prioridad,
            activosReportados,
            observaciones,
            estado: false,
            user: user.id // Asociamos el Incident con el usuario
        })

        // Guardamos el Incident en la base de datos
        const savedIncident = await incident.save()

        // Agregamos el Incident a la lista de incidents del usuario
        user.incidents = user.incidents.concat(savedIncident._id)
        await user.save()

        // Devolvemos el Incident guardado con la info del usuario (solo name y rol)
        const returnedIncident = await savedIncident.populate('user', { name: 1, rol: 1 })
        response.status(201).json(returnedIncident) // 201 → creado exitosamente
    } catch (error) {
        next(error) // Pasamos el error al middleware de manejo de errores
    }
})

// Eliminar un Incident por ID (solo si el Incident fue creado por el usuario autenticado)
incidentsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const { id } = request.params
        const IncidentToDelete = await Incident.findById(id)
        const user = request.user

        if (!IncidentToDelete) {
            return response.status(404).json({ error: 'Incident not found' })
        }

        // Verificamos que el usuario actual sea el autor del Incident
        if (IncidentToDelete.user.toString() !== user.id) {
            return response.status(403).json({ error: 'UNAUTHORIZED OPERATION: `A Incident can be deleted only by the user who created it`' })
        }

        // Eliminamos el Incident
        await Incident.findByIdAndDelete(id)
        response.status(204).end() // 204 → No Content (eliminado exitosamente)
    } catch (error) {
        next(error)
    }
})

// Modificar el estado y fecha de resolución de la incidencia
incidentsRouter.put('/:id', async (request, response, next) => {
    try {
        const { id } = request.params
        const IncidentToUpdate = await Incident.findById(id)

        if (!IncidentToUpdate) {
            return response.status(404).json({ error: 'Incident not found' })
        }

        // Invertimos el estado del Incident
        IncidentToUpdate.estado = !IncidentToUpdate.estado
        // Si se resuelve, ponemos la fecha actual; si se marca como pendiente, la dejamos en null
        IncidentToUpdate.fechaResolucion = IncidentToUpdate.estado ? new Date().toISOString() : null

        // Guardamos los cambios
        await Incident.findByIdAndUpdate(id, IncidentToUpdate, { new: true, runValidators: true, context: 'query' })

        // Devolvemos el Incident actualizado con datos del usuario
        const updatedIncident = await IncidentToUpdate.populate('user', { name: 1, rol: 1 })
        response.status(200).json(updatedIncident)
    } catch (error) {
        next(error)
    }
})

module.exports = incidentsRouter // Exportamos el router para usarlo en otros archivos (como app.js)
