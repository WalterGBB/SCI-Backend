const mongoose = require('mongoose')

const ambienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del ambiente es obligatorio'],
        unique: true,
        trim: true,
        minlength: 3
    },
    tipo: {
        type: String,
        enum: ['Laboratorio', 'Aula'],
        required: true
    },
    subtipo: {
        // Solo aulas
        type: String,
        enum: ['normal', 'taller', null],
        default: null
    },

    // ========================================
    // CONFIGURACIÓN LABORATORIOS
    // ========================================
    configuracion: {

        nPcs: {
            type: Number,
            default: null,
            min: 1,
            max: 56
        },
        nColumnas: {
            type: Number,
            default: null,
            min: 1,
            max: 8
        },
        nColumnaPasadizo: {
            type: Number,
            default: null
        }
    },

    // ========================================
    // ACTIVOS ACTIVOS/HABILITADOS
    // ========================================
    activos: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})

// ============================================
// TRANSFORMACIÓN JSON
// ============================================
ambienteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Ambiente', ambienteSchema)