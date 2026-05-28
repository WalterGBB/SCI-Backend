const proyector = 'https://res.cloudinary.com/francode/image/upload/v1778545852/proyector_bpee4y.png'
const ecran = 'https://res.cloudinary.com/francode/image/upload/v1778545781/ecran_kwuwyj.png'
const control = 'https://res.cloudinary.com/francode/image/upload/v1778545767/control_h3wqop.png'
const pizarra = 'https://res.cloudinary.com/francode/image/upload/v1778545849/pizarra_pnquzb.png'
const cortinas = 'https://res.cloudinary.com/francode/image/upload/v1778545770/cortinas_sots8e.png'
const extintor = 'https://res.cloudinary.com/francode/image/upload/v1778545812/extintor_dpldql.png'
const puertas = 'https://res.cloudinary.com/francode/image/upload/v1778545855/puertas_nqu8pn.png'
const estantes = 'https://res.cloudinary.com/francode/image/upload/v1778545806/estantes_zs0m37.png'
const servidor = 'https://res.cloudinary.com/francode/image/upload/v1778545867/servidor_kvaxt0.png'
const pc_docente_1 = 'https://res.cloudinary.com/francode/image/upload/v1778543648/pc-docente_eoicao.png'
const pc_docente_2 = 'https://res.cloudinary.com/francode/image/upload/v1778546223/ed-pc_hzu6ql.png'
const pc_estudiante = 'https://res.cloudinary.com/francode/image/upload/v1778545333/pc-estudiante_nf7t1j.png'
const sillaDocente = 'https://res.cloudinary.com/francode/image/upload/v1779131285/silla-docente_aztkgb.png'
const sillaEstudiante = 'https://res.cloudinary.com/francode/image/upload/v1778545873/silla_ma5ktk.png'
const escritorio = 'https://res.cloudinary.com/francode/image/upload/v1778545803/escritorio_vitxph.png'
const carpetas = 'https://res.cloudinary.com/francode/image/upload/v1778545759/carpeta_f7aedt.png'
const mesas = 'https://res.cloudinary.com/francode/image/upload/v1778545836/mesa_jcgzr3.png'

const ACTIVOS = {
    // ========================================
    // EQUIPO DOCENTE
    // ========================================
    PC_DOCENTE: {
        code: 'PC_DOCENTE',
        nombre: 'PC Docente',
        categoria: 'EQUIPO DOCENTE',
        tiposAmbiente: ['Aula'],
        subtiposAula: ['normal', 'taller'],
        imagenes: [
            pc_docente_1,
            pc_docente_2
        ],
        configurable: false,
        activoPorDefecto: true
    },

    SILLA_DOCENTE: {
        code: 'SILLA_DOCENTE',
        nombre: 'Silla Docente',
        categoria: 'EQUIPO DOCENTE',
        tiposAmbiente: ['Aula'],
        subtiposAula: ['normal', 'taller'],
        imagenes: [sillaDocente],
        configurable: false,
        activoPorDefecto: true
    },

    ESCRITORIO: {
        code: 'ESCRITORIO',
        nombre: 'Escritorio',
        categoria: 'EQUIPO DOCENTE',
        tiposAmbiente: ['Aula'],
        subtiposAula: ['normal', 'taller'],
        imagenes: [escritorio],
        configurable: false,
        activoPorDefecto: true
    },

    // ========================================
    // PROYECCIÓN
    // ========================================

    PROYECTOR: {
        code: 'PROYECTOR',
        nombre: 'Proyector',
        categoria: 'PROYECCIÓN',
        tiposAmbiente: ['Laboratorio', 'Aula'],
        subtiposAula: ['normal', 'taller'],
        imagenes: [proyector],
        configurable: true,
        activoPorDefecto: true
    },

    ECRAN: {
        code: 'ECRAN',
        nombre: 'Ecran',
        categoria: 'PROYECCIÓN',
        tiposAmbiente: ['Laboratorio', 'Aula'],
        subtiposAula: ['normal', 'taller'],
        imagenes: [ecran],
        configurable: true,
        activoPorDefecto: true
    },

    CONTROL: {
        code: 'CONTROL',
        nombre: 'Control',
        categoria: 'PROYECCIÓN',
        tiposAmbiente: ['Laboratorio', 'Aula'],
        subtiposAula: ['normal', 'taller'],
        imagenes: [control],
        configurable: true,
        activoPorDefecto: true
    },

    PIZARRA: {
        code: 'PIZARRA',
        nombre: 'Pizarra',
        categoria: 'PROYECCIÓN',
        tiposAmbiente: ['Laboratorio', 'Aula'],
        subtiposAula: ['normal', 'taller'],
        imagenes: [pizarra],
        configurable: true,
        activoPorDefecto: true
    },

    // ========================================
    // MOBILIARIO
    // ========================================

    CARPETAS: {
        code: 'CARPETAS',
        nombre: 'Carpetas',
        categoria: 'MOBILIARIO',
        tiposAmbiente: ['Aula'],
        subtiposAula: ['normal'],
        imagenes: [carpetas],
        configurable: true,
        activoPorDefecto: true
    },

    SILLAS: {
        code: 'SILLAS',
        nombre: 'Sillas',
        categoria: 'MOBILIARIO',
        tiposAmbiente: ['Aula'],
        subtiposAula: ['taller'],
        imagenes: [sillaEstudiante],
        configurable: true,
        activoPorDefecto: true
    },

    MESAS: {
        code: 'MESAS',
        nombre: 'Mesas',
        categoria: 'MOBILIARIO',
        tiposAmbiente: ['Aula'],
        subtiposAula: ['taller'],
        imagenes: [mesas],
        configurable: true,
        activoPorDefecto: true
    },

    ESTANTES: {
        code: 'ESTANTES',
        nombre: 'Estantes',
        categoria: 'MOBILIARIO',
        tiposAmbiente: ['Laboratorio', 'Aula'],
        subtiposAula: ['normal', 'taller'],
        imagenes: [estantes],
        configurable: true,
        activoPorDefecto: true
    },

    // ========================================
    // EQUIPO ESTUDIANTE
    // ========================================

    PC_ESTUDIANTE: {
        code: 'PC_ESTUDIANTE',
        nombre: 'PC Estudiante',
        categoria: 'EQUIPO_ESTUDIANTE',
        tiposAmbiente: [],
        imagenes: [pc_estudiante],
        configurable: false,
        activoPorDefecto: true
    },

    // ========================================
    // OTROS
    // ========================================

    PUERTAS: {
        code: 'PUERTAS',
        nombre: 'Puertas',
        categoria: 'OTROS',
        tiposAmbiente: ['Laboratorio', 'Aula'],
        subtiposAula: ['normal', 'taller'],
        imagenes: [puertas],
        configurable: true,
        activoPorDefecto: true
    },

    CORTINAS: {
        code: 'CORTINAS',
        nombre: 'Cortinas',
        categoria: 'OTROS',
        tiposAmbiente: ['Laboratorio', 'Aula'],
        subtiposAula: ['normal', 'taller'],
        imagenes: [cortinas],
        configurable: true,
        activoPorDefecto: true
    },

    EXTINTOR: {
        code: 'EXTINTOR',
        nombre: 'Extintor',
        categoria: 'OTROS',
        tiposAmbiente: ['Laboratorio', 'Aula'],
        subtiposAula: ['normal', 'taller'],
        imagenes: [extintor],
        configurable: true,
        activoPorDefecto: false
    },

    SERVIDOR: {
        code: 'SERVIDOR',
        nombre: 'Servidor',
        categoria: 'OTROS',
        tiposAmbiente: ['Laboratorio'],
        imagenes: [servidor],
        configurable: true,
        activoPorDefecto: false
    }
}

// ============================================
// DEEP FREEZE
// ============================================

const deepFreeze = (obj) => {
    Object.keys(obj).forEach(key => {
        const value = obj[key]
        if (
            value &&
            typeof value === 'object'
        ) {
            deepFreeze(value)
        }
    })
    return Object.freeze(obj)
}

// ============================================
// EXPORT
// ============================================

module.exports = deepFreeze(ACTIVOS)