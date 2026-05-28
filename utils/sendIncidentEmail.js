const {
    formatFechaCorta,
    formatSoloHora
} = require('./formatFecha')

const formatActivo = require('./formatActivo')

const nombreCorto = require('./nombreCorto')

const nodemailer = require('nodemailer')

const sendIncidentEmail = async (incident) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: `Nueva incidencia registrada - ${incident.procedencia}`,
        html: `
            <h2>Nueva incidencia registrada</h2>
            <p><strong>Fecha y hora:</strong> ${formatFechaCorta(incident.fechaRegistro)} - ${formatSoloHora(incident.fechaRegistro)}.</p>
            <p><strong>Curso:</strong> ${incident.curso}.</p>
            <p><strong>Docente:</strong> ${nombreCorto(incident.docente, false)}.</p>
            <p><strong>Categoría:</strong> ${incident.prioridad === 'Alta'
                ? 'Alta 🔴.'
                : incident.prioridad === 'Media'
                    ? 'Media 🟡.'
                    : incident.prioridad === 'Baja'
                        ? 'Baja 🟢.'
                        : 'Desconocida.'}</p>
            <p><strong>Prioridad:</strong> ${incident.prioridad}.</p>
            <p><strong>Subcategoría:</strong> ${incident.subcategoria}.</p>
            <p><strong>Procedencia:</strong> ${incident.procedencia}.</p>
            <p><strong>Responsable:</strong> ${incident.responsable || 'No asignado'}.</p>
            <p><strong>Activos reportados:</strong> ${incident.activosReportados?.length
                ? incident.activosReportados
                    .map(formatActivo)
                    .join(", ")
                : "-"}.
            </p>
            <p><strong>Observaciones:</strong> ${incident.observaciones}.</p>
            <p><strong>Evidencia fotográfica:</strong></p> 
            ${incident.imagen && incident.imagen.url
                ? `<img src="${incident.imagen.url}" alt="Evidencia fotográfica" />`
                : 'No hay imagen'}
        `
    })
}

module.exports = sendIncidentEmail