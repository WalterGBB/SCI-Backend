const authorizeRole = (...allowedRoles) => {
    return (request, response, next) => {
        const user = request.user

        if (!user) {
            return response.status(401).json({
                error: 'Usuario no autenticado'
            })
        }

        if (!allowedRoles.includes(user.rol)) {
            return response.status(403).json({
                error: 'No tienes permisos para realizar esta acción'
            })
        }

        next()
    }
}

module.exports = authorizeRole