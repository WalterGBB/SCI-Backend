const categoriasRouter = require('express').Router()
const Categoria = require('../models/categoria')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

// 1. Obtener todas las categorías
categoriasRouter.get('/', async (request, response) => {
    const categorias = await Categoria.find({})
    response.json(categorias)
})

// 2. Crear una nueva categoría
categoriasRouter.post('/', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const { nombre } = request.body

        if (!nombre) {
            return response.status(400).json({ error: 'El nombre de la categoría es obligatorio' })
        }

        const categoria = new Categoria({
            nombre: nombre.trim()
        })

        const categoriaGuardada = await categoria.save()
        response.status(201).json(categoriaGuardada)
    } catch (error) {
        next(error)
    }
})

// 3. Eliminar una categoría
categoriasRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const { id } = request.params

        const categoriaAEliminar = await Categoria.findById(id)

        if (!categoriaAEliminar) {
            return response.status(404).json({ error: 'La categoría no existe' })
        }

        await Categoria.findByIdAndDelete(id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

// 4. Actualizar el nombre de una categoría
categoriasRouter.put('/:id/edit', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const { id } = request.params
        const { newName } = request.body
        const categoria = await Categoria.findById(id)

        if (!categoria) {
            return response.status(404).json({ error: 'La categoría no existe' })
        }

        categoria.nombre = newName
        const saved = await categoria.save()
        response.status(200).json(saved)
    } catch (error) {
        next(error)
    }
})

/* RUTAS PARA SUBCATEGORÍAS */

// 5. Añadir una subcategoría a una categoría
categoriasRouter.post('/:id/subcategorias', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const { id } = request.params
        const { nombre } = request.body

        if (!nombre) {
            return response.status(400).json({ error: 'El nombre de la subcategoría es obligatorio' })
        }

        const categoria = await Categoria.findById(id)
        if (!categoria) {
            return response.status(404).json({ error: 'La categoría no existe' })
        }

        // Agregamos la subcategoría al final del arreglo
        categoria.subcategorias.push({ nombre: nombre.trim() })

        // Al guardar la categoría padre, se guarda automáticamente la subcategoría
        const categoriaActualizada = await categoria.save()
        response.status(201).json(categoriaActualizada)
    } catch (error) {
        next(error)
    }
})

// 6. Actualizar el nombre de una subcategoría
categoriasRouter.put('/:id/subcategorias/:subId', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const { id, subId } = request.params
        const { newName } = request.body // Recibimos newName desde el frontend

        if (!newName) {
            return response.status(400).json({ error: 'El nuevo nombre es obligatorio' })
        }

        const categoria = await Categoria.findById(id)
        if (!categoria) {
            return response.status(404).json({ error: 'La categoría no existe' })
        }

        // Mongoose permite buscar dentro de un arreglo de subdocumentos usando .id()
        const subcategoria = categoria.subcategorias.id(subId)
        if (!subcategoria) {
            return response.status(404).json({ error: 'La subcategoría no existe' })
        }

        // Actualizamos el nombre
        subcategoria.nombre = newName.trim()

        const categoriaActualizada = await categoria.save()
        response.status(200).json(categoriaActualizada)
    } catch (error) {
        next(error)
    }
})

// 7. Eliminar una subcategoría
categoriasRouter.delete('/:id/subcategorias/:subId', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const { id, subId } = request.params

        const categoria = await Categoria.findById(id)
        if (!categoria) {
            return response.status(404).json({ error: 'La categoría no existe' })
        }

        // Utilizamos .pull() para remover fácilmente el elemento del arreglo usando su ID
        categoria.subcategorias.pull(subId)

        const categoriaActualizada = await categoria.save()

        // Devolvemos status 200 y la categoría actualizada para que el frontend la sincronice
        response.status(200).json(categoriaActualizada)
    } catch (error) {
        next(error)
    }
})

module.exports = categoriasRouter