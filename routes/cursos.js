/**
 * RESUMEN DEL ARCHIVO:
 * * Maneja las rutas para la gestión de cursos en el sistema.
 * * Funcionalidades:
 * - GET    /api/cursos        → Obtener la lista completa de cursos.
 * - POST   /api/cursos        → Registrar un nuevo curso (Requiere Token).
 * - DELETE /api/cursos/:id    → Eliminar un curso por su ID (Requiere Token).
 */

const cursosRouter = require('express').Router()
const Curso = require('../models/curso') // Asegúrate de que el modelo se llame 'curso'
const { tokenExtractor, userExtractor } = require('../utils/middleware')

// 1. Obtener todos los cursos
cursosRouter.get('/', async (request, response) => {
    const cursos = await Curso.find({})
    response.json(cursos)
})

// 2. Obtener un curso por ID
cursosRouter.get('/:id', async (request, response) => {
    try {
        const { id } = request.params
        const curso = await Curso.findById(id)

        if (!curso) {
            return response.status(404).json({ error: 'Curso no encontrado' })
        }
        response.json(curso)
    } catch (error) {
        response.status(400).json({ error: 'ID de curso inválido' })
    }
})

// 3. Crear un nuevo curso
cursosRouter.post('/', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const { nombre } = request.body

        if (!nombre) {
            return response.status(400).json({ error: 'El nombre del curso es obligatorio' })
        }

        const curso = new Curso({
            nombre: nombre.trim()
        })

        const cursoGuardado = await curso.save()
        response.status(201).json(cursoGuardado)
    } catch (error) {
        next(error)
    }
})

// 4. Eliminar un curso
cursosRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const { id } = request.params

        // Opcional: Podrías verificar aquí si el usuario es Admin 
        // if (request.user.rol !== 'Administrador') { ... }

        const cursoAEliminar = await Curso.findById(id)

        if (!cursoAEliminar) {
            return response.status(404).json({ error: 'El curso no existe' })
        }

        await Curso.findByIdAndDelete(id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

// 5. Actualizar el estado activo/inactivo de un curso
cursosRouter.put('/:id', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const { id } = request.params
        const { active } = request.body

        const curso = await Curso.findById(id)

        curso.active = active
        const saved = await curso.save()

        response.status(200).json(saved)

    } catch (error) {
        next(error)
    }
})

// 6. Actualizar el nombre de un curso
cursosRouter.put('/:id/edit', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const { id } = request.params
        const { newName } = request.body
        const curso = await Curso.findById(id)

        if (!curso) {
            return response.status(404).json({ error: 'El curso no existe' })
        }
        curso.nombre = newName
        const saved = await curso.save()
        response.status(200).json(saved)
    } catch (error) {
        next(error)
    }
})

module.exports = cursosRouter