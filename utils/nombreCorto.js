const nombreCorto = (fullName, menuName) => {
    if (!fullName) return ''

    // Normalizar
    const partes = fullName
        .toLowerCase()
        .split(' ')
        .filter(Boolean)

    if (partes.length === 0) return ''
    if (partes.length === 1) return fullName

    const capitalizar = (txt) =>
        txt.charAt(0).toUpperCase() + txt.slice(1)

    if (menuName === true) {
        const nombre = capitalizar(partes[2])
        const apellido = partes[1] ? capitalizar(partes[0]) : ''
        return `${nombre} ${apellido}`.trim()
    } else {
        const nombres = `${capitalizar(partes[2])} ${capitalizar(partes[3])}`
        const apellidos = `${capitalizar(partes[0])} ${capitalizar(partes[1])}`
        return `${apellidos}, ${nombres}`.trim()
    }
}

module.exports = nombreCorto
