const getTodayLocalISO = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

// 1. Solo para inputs de fecha (YYYY-MM-DD) o cuando solo quieres DD/MM/YYYY
const formatFechaCorta = (fechaISO) => {
    if (!fechaISO) return "-"

    return new Date(fechaISO).toLocaleDateString("es-PE", {
        timeZone: "America/Lima",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })
}

// 2. Para registros de la base de datos que incluyen hora
const formatFechaHora = (fechaISO) => {
    if (!fechaISO) return "-"

    return new Date(fechaISO).toLocaleString("es-PE", {
        timeZone: "America/Lima",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })
}

// 3. Para mostrar la fecha en formato largo (Ej: 15 de Agosto de 2024)
const formatFechaLarga = (fechaISO) => {
    if (!fechaISO) return "-"

    // Si viene ISO completo, solo tomamos fecha
    const soloFecha = fechaISO.split('T')[0]
    const [year, month, day] = soloFecha.split('-')

    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ]

    const diaFormateado = String(day).padStart(2, '0')
    const nombreMes = meses[Number(month) - 1]

    return `${diaFormateado} de ${nombreMes} del ${year}`
}

// 4° Para mostrar solo la hora del registro 
const formatSoloHora = (fechaISO) => {
    if (!fechaISO) return "-"

    return new Date(fechaISO).toLocaleTimeString("es-PE", {
        timeZone: "America/Lima",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })
}

module.exports = {
    getTodayLocalISO,
    formatFechaCorta,
    formatFechaHora,
    formatFechaLarga,
    formatSoloHora
}