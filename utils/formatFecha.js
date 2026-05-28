const getTodayLocalISO = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

// 1. Solo para inputs de fecha (YYYY-MM-DD) o cuando solo quieres DD/MM/YYYY
const formatFechaCorta = (fechaISO) => {
    const dateObj = new Date(fechaISO)
    return !isNaN(dateObj)
        ? dateObj.toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
        : "-"
}

// 2. Para registros de la base de datos que incluyen hora
const formatFechaHora = (fechaISO) => {
    if (!fechaISO) return "-"

    // REUTILIZAMOS la lógica de fecha corta
    const fechaParte = formatFechaCorta(fechaISO)

    // Procesamos la hora usando el objeto Date
    const date = new Date(fechaISO)
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'

    hours = hours % 12
    hours = hours ? hours : 12
    const strHours = String(hours).padStart(2, '0')

    return `${fechaParte} ${strHours}:${minutes} ${ampm}`
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

// 4° Para mostrar solo la hora del registro (Ej: 14:30)
const formatSoloHora = (fechaISO) => {
    if (!fechaISO) return "-"
    const date = new Date(fechaISO)
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'

    hours = hours % 12
    hours = hours ? hours : 12
    const strHours = String(hours).padStart(2, '0')

    return `${strHours}:${minutes} ${ampm}`
}

module.exports = {
    getTodayLocalISO,
    formatFechaCorta,
    formatFechaHora,
    formatFechaLarga,
    formatSoloHora
}