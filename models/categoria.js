const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio.'],
        unique: true, // Evita duplicados como "Categoría 1" dos veces
        trim: true,   // Limpia espacios en blanco al inicio/final
        validate: {
            validator: function (v) {
                return v.length >= 3
            },
            message: props => `"${props.value}" es muy corto. Mínimo 3 caracteres.`,
        },
    },
    // NUEVO: Agregamos el arreglo de subcategorías como objetos
    subcategorias: [{
        nombre: {
            type: String,
            required: [true, 'El nombre de la subcategoría es obligatorio.'],
            trim: true
        }
    }]
})

categorySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        // Transformamos el ID de la categoría padre
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

        // Transformamos los IDs de las subcategorías hijas (si existen)
        if (returnedObject.subcategorias && returnedObject.subcategorias.length > 0) {
            returnedObject.subcategorias = returnedObject.subcategorias.map(sub => {
                return {
                    id: sub._id.toString(),
                    nombre: sub.nombre
                }
            })
        }
    }
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category