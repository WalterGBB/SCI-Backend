/**
 * RESUMEN DEL ARCHIVO:
 * 
 * Este archivo define el **esquema y modelo de Mongoose** para los documentos de tipo `Incident`.
 * Cada Incident tiene una fecha de registro, fecha de resolución (opcional), autor, curso, procedencia,
 * prioridad, activos reportados, observaciones, estado y referencia al usuario que lo creó.
 * 
 * - `fechaRegistro`, `curso`, `docente`, `procedencia`, `prioridad`, `activosReportados`, `observaciones` son obligatorios.
 * - `fechaResolucion` es opcional (null hasta que se resuelva la incidencia).
 * - `estado` tiene un valor por defecto de false (pendiente).
 * - `user` es una referencia (relación) a un documento de tipo `User`.
 */

const mongoose = require('mongoose') // Importamos mongoose para definir el esquema

// Definición del esquema del Incident
const IncidentSchema = new mongoose.Schema({
    fechaRegistro: { type: Date, required: true }, // Fecha de registro de la incidencia 
    fechaResolucion: { type: Date, require: true }, // Fecha de resolución de la incidencia 
    curso: { type: String, required: true },       // Curso donde se registró la incidencia 
    docente: { type: String, required: true },     // Docente del curso en el que se registró la incidencia 
    procedencia: { type: String, required: true }, // Procedencia (Aulas, Laboratorios, etc.)
    prioridad: { type: String, required: true },   // Prioridad (Alta, Media, Baja)
    activosReportados: { type: Array, required: true }, // (PCs, server, etc.)
    observaciones: { type: String, required: true }, // Descripción (Detalles de la incidencia)
    estado: { type: Boolean, default: false },     // Estado (false=Pendiente, true=Resuelta)
    user: {                                        // Referencia al usuario que registró la incidencia
        type: mongoose.Schema.Types.ObjectId,      // ObjectId (referencia a otra colección)
        ref: 'User'                                // Referencia al modelo 'User'
    }
})

// Personalizamos la transformación de los documentos al convertirlos a JSON
IncidentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString() // Renombramos _id a id (más amigable)
        delete returnedObject._id // Eliminamos el campo técnico _id
        delete returnedObject.__v // Eliminamos el campo de versión __v de mongoose
    }
})

// Exportamos el modelo 'Incident', basado en el esquema definido
module.exports = mongoose.model('Incident', IncidentSchema)