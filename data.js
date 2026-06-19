// ===================================
// ESTRUCTURA DE DATOS - PLANES DE ESTUDIO
// ===================================

const CARRERAS = {
  // ── CARRERAS ORIGINALES ─────────────────────────────────────────────────────
  ingenieriaIndustrial: { nombre: 'Ingeniería Industrial', codigo: 'II', descripcion: 'Resolución VD-13491-2025 - Escuela de Ingeniería Industrial', facultad: 'Facultad de Ingeniería', cursos: [] },
  contaduriaPublica: { nombre: 'Contaduría Pública', codigo: 'CP', descripcion: 'Escuela de Administración - Universidad de Costa Rica', facultad: 'Facultad de Ciencias Económicas', cursos: [] },
  direccionEmpresas: { nombre: 'Dirección de Empresas', codigo: 'DN', descripcion: 'Escuela de Administración de Negocios - Universidad de Costa Rica', facultad: 'Facultad de Ciencias Económicas', cursos: [] },
  cienciasActuariales: { nombre: 'Ciencias Actuariales', codigo: 'CA', descripcion: 'Bach. y Lic. en Ciencias Actuariales — Plan 1999', facultad: 'Facultad de Ciencias Básicas', cursos: [] },
  farmacia: { nombre: 'Farmacia', codigo: 'FA', descripcion: 'Licenciatura en Farmacia — Plan 2016', facultad: 'Facultad de Farmacia', cursos: [] },
  ingenieriaQuimica: { nombre: 'Ingeniería Química', codigo: 'IQ', descripcion: 'Licenciatura en Ingeniería Química', facultad: 'Facultad de Ingeniería', cursos: [] },
  economia: { nombre: 'Economía', codigo: 'EC', descripcion: 'Bachillerato en Economía — Plan 2', facultad: 'Facultad de Ciencias Económicas', cursos: [] },
  medicina: { nombre: 'Medicina', codigo: 'ME', descripcion: 'Licenciatura en Medicina y Cirugía', facultad: 'Facultad de Medicina', cursos: [] },
  microbiologia: { nombre: 'Microbiología', codigo: 'MQ', descripcion: 'Licenciatura en Microbiología y Química Clínica', facultad: 'Facultad de Microbiología', cursos: [] },
  // ── NUEVAS CARRERAS (2026) ───────────────────────────────────────────────────
  ingenieriaCivil: { nombre: 'Ingeniería Civil', codigo: 'IC', descripcion: 'Licenciatura en Ingeniería Civil — Plan 3', facultad: 'Facultad de Ingeniería', cursos: [] },
  administracionPublica: { nombre: 'Administración Pública', codigo: 'AP', descripcion: 'Bachillerato y Licenciatura en Administración Pública — Plan 1', facultad: 'Facultad de Ciencias Económicas', cursos: [] },
  arquitectura: { nombre: 'Arquitectura', codigo: 'AQ', descripcion: 'Licenciatura en Arquitectura — Plan 2', facultad: 'Facultad de Ingeniería', cursos: [] },
  computadoras_redes: { nombre: 'Computadoras y Redes', codigo: 'CR', descripcion: 'Bach. Ingeniería Eléctrica - Computadoras y Redes — Plan 2026', facultad: 'Facultad de Ingeniería', cursos: [] },
  electronica_telecomunicaciones: { nombre: 'Electrónica y Telecomunicaciones', codigo: 'ET', descripcion: 'Bach. Ingeniería Eléctrica - Electrónica y Telecomunicaciones — Plan 2026', facultad: 'Facultad de Ingeniería', cursos: [] },
  sistemas_energia: { nombre: 'Sistemas de Energía', codigo: 'SE', descripcion: 'Bach. Ingeniería Eléctrica - Sistemas de Energía — Plan 2026', facultad: 'Facultad de Ingeniería', cursos: [] },
  licenciatura_electrica: { nombre: 'Licenciatura en Ingeniería Eléctrica', codigo: 'LE', descripcion: 'Licenciatura en Ingeniería Eléctrica — Plan 2026', facultad: 'Facultad de Ingeniería', cursos: [] },
  estadistica: { nombre: 'Estadística', codigo: 'ES', descripcion: 'Bachillerato en Estadística — Plan 1', facultad: 'Facultad de Ciencias Económicas', cursos: [] },
  geologia: { nombre: 'Geología', codigo: 'GE', descripcion: 'Bachillerato y Licenciatura en Geología — Plan 2', facultad: 'Facultad de Ciencias Básicas', cursos: [] },
  ingenieriaTopografica: { nombre: 'Ingeniería Topográfica', codigo: 'TP', descripcion: 'Bachillerato en Ingeniería en Topografía — Plan 2003', facultad: 'Facultad de Ingeniería', cursos: [] },
  odontologia: { nombre: 'Odontología', codigo: 'OD', descripcion: 'Bachillerato en Odontología — Plan 2', facultad: 'Facultad de Odontología', cursos: [] },
  odontologiaLic: { nombre: 'Odontología (Licenciatura)', codigo: 'OL', descripcion: 'Licenciatura en Odontología — Plan 2011-2017', facultad: 'Facultad de Odontología', cursos: [] },
  nutricion: { nombre: 'Nutrición', codigo: 'NU', descripcion: 'Bachillerato y Licenciatura en Nutrición — Plan 3', facultad: 'Facultad de Medicina', cursos: [] },
};

const DATA_ESTADOS = {
  0: { nombre: 'No cursado', etiqueta: 'No cursado', clase: 'estado-0' },
  1: { nombre: 'Aprobado', etiqueta: '✅ Aprobado', clase: 'estado-1' },
  2: { nombre: 'Cursando', etiqueta: '📘 Cursando', clase: 'estado-2' },
  3: { nombre: 'Semestre +1', etiqueta: '🌸 Sem +1', clase: 'estado-3' },
  4: { nombre: 'Semestre +2', etiqueta: '🔵 Sem +2', clase: 'estado-4' },
  5: { nombre: 'Semestre +3', etiqueta: '🟣 Sem +3', clase: 'estado-5' },
  6: { nombre: 'Semestre +4', etiqueta: '🩵 Sem +4', clase: 'estado-6' },
  7: { nombre: 'Semestre +5+', etiqueta: '🟠 Sem +5+', clase: 'estado-7' }
};

const TOTAL_ESTADOS = 8; // 0 a 7

const DATA_STORAGE_KEY = 'planes-estudio-ucr-v2';


// ===================================
// DATA FETCHING (Supabase)
// ===================================
let carrerasCargadas = false;
async function cargarCarrerasDeSupabase() {
    if (carrerasCargadas) return true;
    if (!window.supaAuth?.supabase) return false;

    try {
        const { data, error } = await window.supaAuth.supabase
            .from('careers_catalog')
            .select('*');

        if (error) {
            // Es posible que la tabla no exista todavía
            if (error.code === '42P01') {
                console.warn("La tabla careers_catalog aún no existe en Supabase.");
                return false;
            }
            throw error;
        }

        if (data && data.length > 0) {
            data.forEach(c => {
                if (!CARRERAS[c.id]) CARRERAS[c.id] = { cursos: [] };
                CARRERAS[c.id].nombre = c.nombre;
                CARRERAS[c.id].codigo = c.codigo;
                CARRERAS[c.id].descripcion = c.descripcion;
                CARRERAS[c.id].facultad = c.facultad;
            });
            carrerasCargadas = true;
            return true;
        }
    } catch (e) {
        console.error("Error cargando carreras desde Supabase:", e);
    }
    return false;
}

async function cargarCursosDeSupabase(carreraId) {
    if (CARRERAS[carreraId]?.cursos?.length > 0) return true; // Ya esta cargado
    if (!window.supaAuth?.supabase) return false;

    try {
        const { data, error } = await window.supaAuth.supabase
            .from('courses_catalog')
            .select('codigo, nombre, creditos, nivel, requisitos')
            .eq('carrera_id', carreraId);

        if (error) throw error;

        if (data && data.length > 0) {
            CARRERAS[carreraId].cursos = data.map(c => ({
                codigo: c.codigo,
                nombre: c.nombre,
                creditos: c.creditos,
                nivel: c.nivel,
                requisitos: c.requisitos || [],
                estado: 0
            }));
            CARRERAS[carreraId].cursos.sort((a, b) => a.nivel - b.nivel);
            return true;
        }
    } catch (e) {
        console.error("Error cargando cursos desde Supabase:", e);
    }
    return false;
}

// ===================================
// FUNCIONES DE UTILIDAD
// ===================================

/**
 * Obtiene el nombre de una carrera por su ID
 */
function getNombreCarrera(carreraId) {
  return CARRERAS[carreraId]?.nombre || '';
}

/**
 * Obtiene todos los cursos de una carrera
 */
function getCursosCarrera(carreraId) {
  return CARRERAS[carreraId]?.cursos || [];
}

/**
 * Obtiene un curso específico por código
 */
function getCursoByCodigo(carreraId, codigo) {
  const cursos = getCursosCarrera(carreraId);
  return cursos.find(c => c.codigo === codigo);
}

/**
 * Obtiene todos los niveles únicos de una carrera
 */
function getNiveles(carreraId) {
  const cursos = getCursosCarrera(carreraId);
  const niveles = [...new Set(cursos.map(c => c.nivel))];
  return niveles.sort((a, b) => a - b);
}

/**
 * Obtiene cursos de un nivel específico
 */
function getCursosPorNivel(carreraId, nivel) {
  const cursos = getCursosCarrera(carreraId);
  return cursos.filter(c => c.nivel === nivel);
}

/**
 * Calcula el total de créditos de una carrera
 */
function getTotalCreditos(carreraId) {
  const cursos = getCursosCarrera(carreraId);
  return cursos.reduce((sum, curso) => sum + curso.creditos, 0);
}

/**
 * Calcula créditos aprobados (solo estado 1 = Verde)
 */
function getCreditosAprobados(carreraId) {
  const cursos = getCursosCarrera(carreraId);
  return cursos
    .filter(c => c.estado === 1)
    .reduce((sum, curso) => sum + curso.creditos, 0);
}

/**
 * Calcula créditos para un estado específico (para carga proyectada)
 * @param {string} carreraId
 * @param {number} estadoNum - número de estado (2–7)
 */
function getCreditosPorEstado(carreraId, estadoNum) {
  const cursos = getCursosCarrera(carreraId);
  return cursos
    .filter(c => c.estado === estadoNum)
    .reduce((sum, curso) => sum + curso.creditos, 0);
}

/**
 * Calcula progreso porcentual (basado solo en aprobados = estado 1)
 */
function getProgreso(carreraId) {
  const total = getTotalCreditos(carreraId);
  const aprobados = getCreditosAprobados(carreraId);
  return total > 0 ? Math.round((aprobados / total) * 100) : 0;
}

/**
 * Verifica si un curso puede estar en un estado específico basado en sus requisitos.
 * @param {string} carreraId
 * @param {string} codigoCurso
 * @param {number} nuevoEstado - El estado al que se quiere mover (0-7)
 */
function puedeEstarEnEstado(carreraId, codigoCurso, nuevoEstado) {
  // Excepción histórica: este curso siempre puede ser aprobado/cursado manualmente
  if (codigoCurso === 'II1132') return true;

  const curso = getCursoByCodigo(carreraId, codigoCurso);
  if (!curso) return false;

  // Estado 0 siempre es válido
  if (nuevoEstado === 0) return true;

  // Sin requisitos: siempre válido
  if (!curso.requisitos || curso.requisitos.length === 0) return true;

  // REGLAS:
  // 1. Para APROBADO (1) o CURSANDO (2): Requisitos deben estar APROBADOS (1).
  // 2. Para PROYECCIÓN (3-7): Basta con que los requisitos tengan CUALQUIER estado > 0
  //    (no importa si están cursando, proyectados, etc. — es una planificación futura).

  return curso.requisitos.every(reqString => {
    // Soporte para requisitos OR usando ||
    const opciones = reqString.split('||').map(s => s.trim());

    return opciones.some(reqCodigo => {
      const reqCurso = getCursoByCodigo(carreraId, reqCodigo);
      if (!reqCurso) return true; // Si no existe el req, no bloqueamos

      const reqEstado = Number(reqCurso.estado) || 0;
      if (nuevoEstado === 1 || nuevoEstado === 2) {
        // Para aprobar/cursar: el requisito DEBE estar aprobado
        return reqEstado === 1;
      } else if (nuevoEstado >= 3) {
        // Para proyecciones: debe respetar orden cronológico
        if (reqEstado === 1) return true; // Si ya está aprobado, todo bien
        if (reqEstado === 0) return false; // Si no está planeado, no se puede
        
        // Si el requisito está planeado (estado >= 2), el dependiente debe ir DESPUÉS
        if (nuevoEstado > reqEstado || (nuevoEstado === 7 && reqEstado === 7)) {
            return true;
        }
        return false;
      }
      return false;
    });
  });
}

/**
 * Verifica si un curso puede avanzar de estado base (aprobación tradicional).
 * Mantenemos esto para compatibilidad con el renderizado visual del candado inicial.
 */
function puedeSerCursado(carreraId, codigoCurso) {
  return puedeEstarEnEstado(carreraId, codigoCurso, 2); // 2 = Cursando (requiere requisitos aprobados)
}

/**
 * Obtiene todos los cursos de una carrera que ya pueden ser matriculados (requisitos cumplidos).
 * Se consideran aquellos en estado 0 pero con puedeSerCursado=true, o aquellos ya marcados como Cursando/Proyectado.
 */
function getCursosDisponibles(carreraId) {
  const carrera = CARRERAS[carreraId];
  if (!carrera) return [];

  return carrera.cursos.filter(curso => {
    // Un curso es elegible SOLO si sus requisitos previos están APROBADOS (Estado 1)
    // O si no tiene requisitos del todo.
    // Además, no debe estar ya aprobado (Estado 1).
    const yaAprobado = Number(curso.estado) === 1;
    const requisitosListos = curso.requisitos.every(reqString => {
      const opciones = reqString.split('||').map(s => s.trim());
      return opciones.some(reqCodigo => {
        const reqCurso = getCursoByCodigo(carreraId, reqCodigo);
        return reqCurso && Number(reqCurso.estado) === 1;
      });
    });

    return !yaAprobado && requisitosListos;
  });
}

/**
 * Obtiene los nombres de los requisitos
 */
function getNombresRequisitos(carreraId, requisitos) {
  if (!requisitos || requisitos.length === 0) return 'Sin requisitos';

  return requisitos
    .map(reqString => {
      const opciones = reqString.split('||');
      return opciones.map(codigo => {
        const curso = getCursoByCodigo(carreraId, codigo);
        return curso ? `${curso.codigo}` : codigo;
      }).join(' O ');
    })
    .join(', ');
}

/**
 * Avanza el estado de un curso al siguiente en el ciclo.
 * Si está bloqueado (requisitos no cumplidos y estado actual = 0), no avanza.
 */
function siguienteEstado(estadoActual) {
  return (estadoActual + 1) % TOTAL_ESTADOS;
}

// ===================================
// CURSOS COMPARTIDOS ENTRE CARRERAS
// ===================================

/**
 * Normaliza un código de curso para comparaciones:
 * quita guiones interiores y pasa a minúsculas.
 * Ej: "MA-1004" => "ma1004", "EG-I" => "egi", "EG-1" => "eg1"
 * Nota: EG-I y EG-1 son distintos (I vs 1), se tratan por el mapa de equivalencias.
 */
function normalizarCodigo(codigo) {
  return (codigo || '').replace(/-/g, '').toLowerCase().trim();
}

/**
 * Mapa de equivalencias para cursos que son el mismo contenido
 * pero tienen códigos genuinamente distintos entre carreras.
 * Formato: cada grupo es un array de códigos equivalentes.
 * Se generó analizando la BD (40 grupos inconsistentes encontrados).
 */
const GRUPOS_EQUIVALENTES = [
  // Humanidades / Estudios Generales
  ['EG-I', 'EG-1'],
  ['EG-II', 'EG-2'],
  ['SR-I', 'SR-1'],
  ['SR-II', 'SR-2'],
  ['RP-', 'RP-1'],

  // Cálculo I — distintas escuelas usan distintos códigos
  ['MA1001', 'MA1210', 'MA-1101'],
  // Cálculo II
  ['MA1002', 'MA-1002'],
  // Cálculo III
  ['MA1003', 'MA-1003'],
  // Álgebra Lineal
  ['MA1004', 'MA-1004'],
  // Ecuaciones Diferenciales
  ['MA1005', 'MA-1005'],
  // Cálculo para Ciencias Económicas I
  ['MA-1021', 'MA1021'],

  // Física
  ['FS0210', 'FS-0210'],
  ['FS0211', 'FS-0211'],
  ['FS0310', 'FS-0310'],
  ['FS0311', 'FS-0311'],
  ['FS0410', 'FS-0410'],
  ['FS0411', 'FS-0411'],

  // Química
  ['QU0100', 'QU-0100'],
  ['QU0101', 'QU-0101'],

  // Informática / Computación
  ['CI0202', 'CI-0202', 'C10202'],

  // Gráfica
  ['IM0101', 'IM-0101'],

  // Responsabilidad Profesional
  ['IE0501', 'IE-0501'],

  // Introducción a la Economía
  ['XE-0156', 'XE0156', 'EC1100'],

  // Investigaciones Dirigidas
  ['II9500', 'IQ9500', 'XP9500', 'G9500', 'IT9500'],
  ['MA9500', 'FA9500', 'IC9500'],
  ['MA9501', 'FA9501', 'IC9501'],
  ['FA9502', 'IC9502'],
  ['XP9501', 'G9501', 'IT9501'],
  ['XP9502', 'G9502', 'IT9502'],

  // Prácticas Dirigidas
  ['FA9700', 'IQ9700', 'G9700', 'IT9700'],
  ['FA9701', 'G9701', 'IT9701'],
  ['G9702', 'FA9702', 'IT9702'],
  ['MA9700', 'XP9700'],

  // Proyectos / Seminarios de Graduación
  ['FA9800', 'IQ9800', 'G9800', 'IT9800'],
  ['FA9801', 'G9801', 'IT9801'],
  ['FA9802', 'G9802', 'IT9802'],
  ['MA9600', 'IC9600', 'XP9600'],
  ['IC9601', 'G9601', 'IT9601'],
  ['G9602', 'IT9602'],
  ['NU9601', 'XP9601'],

  // Biología
  ['B0106', 'B0103'],

  // Mecánica
  ['IQ0312', 'IM-0207'],
];

// Lookup precalculado: código -> array de todos sus equivalentes (incluyéndose)
const _equivalenciasLookup = (() => {
  const map = {};
  GRUPOS_EQUIVALENTES.forEach(grupo => {
    grupo.forEach(codigo => {
      map[codigo] = grupo;
    });
  });
  return map;
})();

/**
 * Obtiene todos los códigos equivalentes a un código dado (incluye al propio).
 */
function getCodigosEquivalentes(codigo) {
  // 1. Primero intentar match exacto en el mapa
  if (_equivalenciasLookup[codigo]) return _equivalenciasLookup[codigo];

  // 2. Buscar por código normalizado (para cubrir variaciones de guión no listadas)
  const norm = normalizarCodigo(codigo);
  for (const [clave, grupo] of Object.entries(_equivalenciasLookup)) {
    if (normalizarCodigo(clave) === norm) return grupo;
  }

  // 3. Sin equivalentes: devolver solo el propio
  return [codigo];
}

/**
 * Devuelve true si el curso pertenece a un grupo de sincronización
 * (mismo código en otra carrera, o equivalente conocido).
 */
function esCompartido(carreraId, codigo) {
  const equivalentes = getCodigosEquivalentes(codigo);
  let compartidos = 0;
  Object.keys(CARRERAS).forEach(cId => {
    const encontrado = equivalentes.some(eq => getCursoByCodigo(cId, eq));
    if (encontrado) compartidos++;
  });
  return compartidos > 1;
}

/**
 * Propaga el nuevo estado a todos los cursos hermanos en otras carreras.
 * Usa getCodigosEquivalentes para cubrir variaciones de código y
 * equivalencias definidas en GRUPOS_EQUIVALENTES.
 */
function propagarEstadoCurso(sourceCarreraId, codigoCurso, nuevoEstado) {
  const equivalentes = getCodigosEquivalentes(codigoCurso);

  Object.keys(CARRERAS).forEach(carreraId => {
    if (carreraId === sourceCarreraId) return; // Saltamos el origen

    // Buscar el curso usando cualquier código equivalente
    let cursoHermano = null;
    for (const eq of equivalentes) {
      cursoHermano = getCursoByCodigo(carreraId, eq);
      if (cursoHermano) break;
    }

    // También buscar por normalización de guiones
    if (!cursoHermano) {
      const normOrigen = normalizarCodigo(codigoCurso);
      cursoHermano = CARRERAS[carreraId].cursos?.find(
        c => normalizarCodigo(c.codigo) === normOrigen
      ) || null;
    }

    if (cursoHermano) {
      cursoHermano.estado = nuevoEstado;
    }
  });
}

// ===================================
// TABLA DE CONVALIDACIONES (EQUIVALENCIAS)
// ===================================

/**
 * Tabla basada en la resolución EAN-269-2023 de la Universidad de Costa Rica.
 * Formato: para cada carrera, listamos qué cursos de la OTRA carrera convalidan cursos en ESTA.
 * origen: Cursos que el estudiante YA TIENE aprobados (en la otra carrera).
 * destino: Cursos que se le RECONOCEN (en la carrera actual).
 */
const TABLA_CONVALIDACIONES = {
  'contaduriaPublica': [
    {
      origen: [
        { codigo: 'DN-0304', nombre: 'Liderazgo Gerencial' },
        { codigo: 'DN-0202', nombre: 'Principios de Gerencia' }
      ],
      destino: ['PC-0212'],
      nombre: 'Liderazgo y Gerencia (DN) → Gerencia y Liderazgo (CP)',
      nota: 'Se requieren ambos cursos de Dirección para convalidar Gerencia en Conta.'
    },
    {
      origen: [
        { codigo: 'DN-0380', nombre: 'Entorno Legal de las Empresas I' },
        { codigo: 'DN-0381', nombre: 'Entorno Legal de las Empresas II' }
      ],
      destino: ['DN-0104'],
      nombre: 'Entorno Legal I y II (DN) → Legis. Empresarial (CP)',
      nota: 'Se requieren ambos cursos de Dirección para convalidar Legislación en Conta.'
    },
    {
      origen: [
        { codigo: 'DN-0160', nombre: 'Principios de Contabilidad' },
        { codigo: 'DN-0261', nombre: 'Estructura de Contabilidad' }
      ],
      destino: ['PC-0200'],
      nombre: 'Principios y Estructura Conta (DN) → Conta Básica (CP)',
      nota: 'Se requieren ambos de Dirección para convalidar Conta Básica.'
    },
    {
      origen: [{ codigo: 'DN-0495', nombre: 'Métodos Cuantitativos para la Toma de Decisiones' }],
      destino: ['DN-0105'],
      nombre: 'Métodos Cuantitativos (DN) → Métodos Cuantitativos I (CP)',
      nota: 'Equivalencia de Métodos Cuantitativos.'
    },
    {
      origen: [{ codigo: 'DN-0424', nombre: 'Mercadeo Gerencial' }],
      destino: ['DN-0320'],
      nombre: 'Mercadeo Gerencial (DN) → Principios de Mercadeo (CP)',
      nota: 'Equivalencia de Mercadeo.'
    }
  ],
  'direccionEmpresas': [
    {
      origen: [
        { codigo: 'PC-0320', nombre: 'Auditoría Financiera I' },
        { codigo: 'PC-0321', nombre: 'Auditoría Financiera II' },
        { codigo: 'PC-0421', nombre: 'Auditoría Financiera III' }
      ],
      destino: ['DN-0109'],
      nombre: 'Auditorías Financieras I, II y III (CP) → Auditoría Financiera (DN)',
      nota: 'Requiere las tres auditorías de Conta para convalidar la de Dirección.'
    },
    {
      origen: [{ codigo: 'PC-0490', nombre: 'Investigación de Operaciones' }],
      destino: ['DN-0105'],
      nombre: 'Investigación de Operaciones (CP) → Métodos Cuantitativos I (DN)',
      nota: 'Equivalencia de Métodos Cuantitativos.'
    },
    {
      origen: [{ codigo: 'PC-0343', nombre: 'Análisis de las Finanzas y Presupuestos' }],
      destino: ['DN-0340'],
      nombre: 'Análisis de Finanzas (CP) → Adm. Financiera I (DN)',
      nota: 'Equivalencia de Finanzas.'
    },
    {
      origen: [{ codigo: 'PC-0250', nombre: 'Mercadeo Básico' }],
      destino: ['DN-0320'],
      nombre: 'Mercadeo Básico (CP) → Principios de Mercadeo (DN)',
      nota: 'Equivalencia de Mercadeo.'
    },
    {
      origen: [{ codigo: 'PC-0352', nombre: 'Instrumentos de Comercio Internacional' }],
      destino: ['DN-0107'],
      nombre: 'Instrumentos de Comercio (CP) → Economía Internacional (DN)',
      nota: 'Equivalencia de Comercio Internacional.'
    },
    {
      origen: [{ codigo: 'PC-0208', nombre: 'Costos Avanzados' }],
      destino: [{ codigo: 'DN-0124', nombre: 'Costeo Gerencial para Administradores' }],
      nombre: 'Costos Avanzados (CP) → Costeo Gerencial (DN)',
      nota: 'Equivalencia de Costos.'
    }
  ]
};

