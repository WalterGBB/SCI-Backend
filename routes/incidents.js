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
const upload = require('../utils/upload') // Middleware para manejar la subida de archivos a Cloudinary
const cloudinary = require('../utils/cloudinary')
const sendIncidentEmail = require('../utils/sendIncidentEmail') // Función para enviar correo al crear una incidencia

// Obtener todas las incidencias, incluyendo información básica del usuario que las creó
incidentsRouter.get('/', async (request, response) => {
    const incidents = await Incident.find({}).populate('user', { name: 1, rol: 1 }) // .populate() incluye los datos del usuario
    response.json(incidents) // Se envía el array de incidents como JSON
})

// Obtener un solo Incident por ID
incidentsRouter.get('/:id', async (request, response) => {
    const { id } = request.params // Extraemos el ID de los parámetros de la necesidad
    const incidentFound = await Incident.findById(id) // Buscamos el Incident por ID
    if (incidentFound) {
        response.json(incidentFound) // Si se encuentra, lo devolvemos
    } else {
        response.status(404).end() // Si no, devolvemos error 404
    }
})

// Crear un nuevo Incident (requiere autenticación)
incidentsRouter.post(
    '/',
    tokenExtractor,
    userExtractor,
    upload.single('imagen'),
    async (request, response, next) => {
        try {
            const {
                curso,
                docente,
                prioridad,
                categoria,
                subcategoria,
                procedencia,
                responsable,
                observaciones,
                activosReportados
            } = request.body

            const user = request.user

            const imagen = request.file
                ? {
                    url: request.file.path,
                    public_id: request.file.filename
                }
                : null

            const incident = new Incident({
                fechaRegistro: new Date(),
                fechaResolucion: null,
                curso,
                docente,
                prioridad,
                categoria,
                subcategoria,
                procedencia,
                observaciones,
                responsable,
                imagen,
                estado: 'Pendiente',
                activosReportados: Array.isArray(activosReportados)
                    ? activosReportados
                    : activosReportados
                        ? [activosReportados]
                        : [],
                user: user.id
            })

            const savedIncident = await incident.save()

            // Enviar correo notificando nueva incidencia
            sendIncidentEmail(savedIncident).catch(emailError => {
                console.error(
                    'Error enviando correo en segundo plano:',
                    emailError
                )
            })

            user.incidents = user.incidents.concat(savedIncident._id)

            await user.save()

            const returnedIncident = await savedIncident.populate(
                'user',
                { name: 1, rol: 1 }
            )

            response.status(201).json(returnedIncident)

        } catch (error) {
            next(error)
        }
    }
)

// Eliminar un Incident por ID (solo si el Incident fue creado por el usuario autenticado)
incidentsRouter.delete(
    '/:id',
    tokenExtractor,
    userExtractor,
    async (request, response, next) => {
        try {
            const { id } = request.params
            const incidentToDelete = await Incident.findById(id)
            const user = request.user

            if (!incidentToDelete) {
                return response.status(404).json({ error: 'Incident not found' })
            }

            // Verificar que el usuario sea el creador
            if (incidentToDelete.user.toString() !== user.id) {
                return response.status(403).json({
                    error:
                        'UNAUTHORIZED OPERATION: A Incident can be deleted only by the user who created it'
                })
            }

            // 🔥 ELIMINAR IMAGEN EN CLOUDINARY (si existe)
            if (incidentToDelete.imagen?.public_id) {
                await cloudinary.uploader.destroy(
                    incidentToDelete.imagen.public_id
                )
            }

            // Eliminar documento de Mongo
            await Incident.findByIdAndDelete(id)

            response.status(204).end()
        } catch (error) {
            next(error)
        }
    }
)

// Modificar el estado y fecha de resolución de la incidencia
incidentsRouter.put('/:id', async (request, response, next) => {
    try {
        const { id } = request.params
        const { solucion, estado } = request.body

        const incident = await Incident.findById(id)

        if (!incident) {
            return response.status(404).json({
                error: 'No se encontró la incidencia'
            })
        }

        // 🚫 No permitir modificar si está cerrada
        if (incident.estado === 'Cerrada') {
            return response.status(400).json({
                error: 'La incidencia está cerrada y no puede modificarse'
            })
        }

        if (!estado) {
            return response.status(400).json({
                error: 'Debe proporcionar el estado'
            })
        }

        // Si se quiere cerrar, solución obligatoria
        if (estado === 'Cerrada') {
            if (!solucion || !solucion.trim()) {
                return response.status(400).json({
                    error: 'Debe documentar la solución para cerrar la incidencia'
                })
            }

            incident.solucion = solucion.trim()
            incident.fechaResolucion = new Date()
        }

        incident.estado = estado

        const saved = await incident.save()

        const populated = await saved.populate('user', { name: 1, rol: 1 })

        response.status(200).json(populated)

    } catch (error) {
        next(error)
    }
})

// Put para modificar los datos del registro de la incidencia (sin cambiar estado ni solución)
incidentsRouter.put(
    '/:id/edit',
    tokenExtractor,
    userExtractor,
    upload.single('imagen'),
    async (request, response, next) => {
        // console.log("HEADERS:", request.headers.authorization)
        try {
            const { id } = request.params

            const incident = await Incident.findById(id)

            if (!incident) {
                return response.status(404).json({
                    error: 'No se encontró la incidencia'
                })
            }

            // 🚫 No permitir editar si está cerrada
            if (incident.estado === 'Cerrada') {
                return response.status(400).json({
                    error: 'No se puede editar una incidencia cerrada'
                })
            }

            const {
                curso,
                docente,
                prioridad,
                categoria,
                procedencia,
                responsable,
                observaciones,
                activosReportados,
                fechaRegistro
            } = request.body

            // 🔹 actualizar campos
            if (curso !== undefined) incident.curso = curso
            if (docente !== undefined) incident.docente = docente
            if (prioridad !== undefined) incident.prioridad = prioridad
            if (categoria !== undefined) incident.categoria = categoria
            if (procedencia !== undefined) incident.procedencia = procedencia
            if (responsable !== undefined) incident.responsable = responsable
            if (observaciones !== undefined) incident.observaciones = observaciones

            // 🔹 activos
            if (activosReportados !== undefined) {
                incident.activosReportados = Array.isArray(activosReportados)
                    ? activosReportados
                    : [activosReportados]
            }

            // 🔹 fecha (misma lógica que create)
            if (fechaRegistro) {
                const ahoraPeru = new Date(
                    new Date().toLocaleString("en-US", { timeZone: "America/Lima" })
                )

                const [year, month, day] = fechaRegistro.split("-").map(Number)

                const hoyPeru = new Date(
                    ahoraPeru.getFullYear(),
                    ahoraPeru.getMonth(),
                    ahoraPeru.getDate()
                )

                const fechaSeleccionada = new Date(year, month - 1, day)

                const esHoy =
                    fechaSeleccionada.getFullYear() === hoyPeru.getFullYear() &&
                    fechaSeleccionada.getMonth() === hoyPeru.getMonth() &&
                    fechaSeleccionada.getDate() === hoyPeru.getDate()

                incident.fechaRegistro = esHoy
                    ? ahoraPeru
                    : new Date(year, month - 1, day, 12, 0, 0)
            }

            // 🔥 imagen (reemplazo)
            if (request.file) {
                if (incident.imagen?.public_id) {
                    await cloudinary.uploader.destroy(incident.imagen.public_id)
                }

                incident.imagen = {
                    url: request.file.path,
                    public_id: request.file.filename
                }
            }

            const saved = await incident.save()

            const populated = await saved.populate('user', { name: 1, rol: 1 })

            response.json(populated)

        } catch (error) {
            next(error)
        }
    }
)

module.exports = incidentsRouter // Exportamos el router para usarlo en otros archivos (como app.js)
