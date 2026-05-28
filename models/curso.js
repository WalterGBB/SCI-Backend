const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del curso es obligatorio.'],
        unique: true, // Evita duplicados como "Curso 1" dos veces
        trim: true,   // Limpia espacios en blanco al inicio/final
        validate: {
            validator: function (v) {
                return v.length >= 3
            },
            message: props => `"${props.value}" es muy corto. Mínimo 3 caracteres.`,
        },
    },
    active: {
        type: Boolean,
        default: true // Por defecto, los cursos creados están activos
    },
    // // Opcional: Relación inversa si quieres saber qué incidencias pertenecen a este curso
    // incidents: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Incident'
    //     }
    // ]
})

courseSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Course = mongoose.model('Course', courseSchema)

module.exports = Course