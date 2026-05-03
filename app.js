// ===================================
// GESTIÓN DE ESTADO Y PERSISTENCIA
// ===================================

let carreraActual = 'ingenieriaIndustrial';
const APP_STORAGE_KEY = 'ucr_planes_estudio_v3';

const APP_ESTADOS = {
    0: { etiqueta: 'Pendiente', clase: 'estado-0' },
    1: { etiqueta: 'Aprobado', clase: 'estado-1' },
    2: { etiqueta: 'Cursando', clase: 'estado-2' },
    3: { etiqueta: 'Próximo Semestre', clase: 'estado-3' },
    4: { etiqueta: 'Año +1', clase: 'estado-4' },
    5: { etiqueta: 'Año +2', clase: 'estado-5' },
    6: { etiqueta: 'Año +3', clase: 'estado-6' },
    7: { etiqueta: 'Meta Largo Plazo', clase: 'estado-7' }
};

// Función de navegación global simplificada
window.navigateTo = (target, pushToHistory = true) => {
    // 🔒 Control de Acceso: Redirigir a login si no hay sesión
    const isAuthenticated = window.supaAuth && window.supaAuth.getCurrentSession();
    if (!isAuthenticated && target !== 'login') {
        console.warn("Acceso denegado: redirigiendo a login.");
        target = 'login';
    }

    // Historial de navegación para botón "Atrás" en móviles
    if (pushToHistory && target !== 'login') {
        history.pushState({ page: target }, '', '#' + target);
    }

    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    const appNav = document.getElementById('app-nav');

    if (target === 'login') {
        document.getElementById('login-section')?.classList.remove('hidden');
        if (appNav) appNav.classList.add('hidden');
    } else if (target === 'plan') {
        document.getElementById('plan-section').classList.remove('hidden');
        document.getElementById('export-area').classList.remove('hidden');
        const planBtn = document.querySelector('[data-tab="plan"]');
        if (planBtn) planBtn.classList.add('active');
        document.querySelector('.controls-container').classList.remove('hidden');
        if (appNav) appNav.classList.remove('hidden');
        // Aplicar filtro de carreras del perfil del usuario
        const _perfil = window.supaAuth?.getCurrentProfile?.();
        if (_perfil?.selected_carreras?.length > 0) filtrarCarrerasPorPerfil(_perfil.selected_carreras);
    } else if (target === 'horario') {
        const hSection = document.getElementById('horarios-section');
        if (hSection) hSection.classList.remove('hidden');
        const horarioBtn = document.querySelector('[data-tab="horario"]');
        if (horarioBtn) horarioBtn.classList.add('active');
        document.querySelector('.controls-container').classList.add('hidden');
        if (appNav) appNav.classList.remove('hidden');
        if (typeof initScheduler === 'function') initScheduler();
    } else if (target === 'calculator') {
        const calcSection = document.getElementById('calculator-section');
        if (calcSection) calcSection.classList.remove('hidden');
        document.querySelector('.controls-container')?.classList.add('hidden');
        if (appNav) appNav.classList.add('hidden'); // Calculadora tiene su propia navegación
        if (typeof calcLoadAuto === 'function') {
            // Dar un pequeño tiempo por si los datos no han cargado aún
            setTimeout(() => {
                if (calcAutoCourses.length === 0) calcLoadAuto();
            }, 100);
        }
    } else {
        // HOME default para usuarios autenticados
        document.getElementById('home-section').classList.remove('hidden');
        if (appNav) appNav.classList.add('hidden'); // Home tiene su propio layout
    }

    if (window.lucide) lucide.createIcons();
};

/**
 * Guarda el estado actual en localStorage y en Supabase
 */
async function guardarEstado() {
    try {
        const session = window.supaAuth?.getCurrentSession();
        // Clave única por usuario — evita que los datos se mezclen entre cuentas
        const storageKey = session ? `ucr_estado_${session.user.id}` : APP_STORAGE_KEY;

        const estado = {
            ingenieriaIndustrial: CARRERAS.ingenieriaIndustrial.cursos.map(c => ({ codigo: c.codigo, estado: c.estado })),
            contaduriaPublica: CARRERAS.contaduriaPublica.cursos.map(c => ({ codigo: c.codigo, estado: c.estado })),
            direccionEmpresas: CARRERAS.direccionEmpresas.cursos.map(c => ({ codigo: c.codigo, estado: c.estado })),
            carreraActual: carreraActual,
            ultimaActualizacion: new Date().toISOString()
        };

        localStorage.setItem(storageKey, JSON.stringify(estado));

        // Sincronizar a Supabase si el usuario está autenticado
        if (session) {
            const user = session.user;
            const coursesToUpsert = [];
            ['ingenieriaIndustrial', 'contaduriaPublica', 'direccionEmpresas'].forEach(carreraId => {
                if (Array.isArray(estado[carreraId])) {
                    estado[carreraId].forEach(c => {
                        coursesToUpsert.push({
                            user_id: user.id,
                            carrera_id: carreraId,
                            course_id: c.codigo,
                            status: typeof c.estado === 'number' ? c.estado : parseInt(c.estado) || 0
                        });
                    });
                }
            });

            if (coursesToUpsert.length > 0) {
                const { error } = await window.supaAuth.supabase
                    .from('user_courses')
                    .upsert(coursesToUpsert, { onConflict: 'user_id,carrera_id,course_id' });
                if (error) console.error('Error Supabase al guardar:', error);
                else console.log(`✅ Progreso sincronizado: ${coursesToUpsert.length} cursos`);
            }
        }
    } catch (error) {
        console.error('Error al guardar estado:', error);
    }
}

/**
 * Mapa de retrocompatibilidad: códigos viejos → códigos nuevos.
 * Necesario porque renombramos REPO→RP-, MA-0001→MA0001, OPT-1→OPT-ING, OPT-S3→OPT-ING.
 */
const _COMPAT_CODIGOS = {
    'REPO': 'RP-',
    'MA-0001': 'MA0001',
    'OPT-1': 'OPT-ING',
    'OPT-S3': 'OPT-ING'
};

/**
 * Carga el estado local y asíncronamente desde Supabase si aplica.
 */
async function cargarEstado() {
    const session = window.supaAuth?.getCurrentSession();
    const storageKey = session ? `ucr_estado_${session.user.id}` : APP_STORAGE_KEY;

    // SIEMPRE resetear todos los cursos a 0 antes de cargar
    // Esto evita que el progreso de otro usuario quede visible
    Object.keys(CARRERAS).forEach(carreraId => {
        CARRERAS[carreraId].cursos.forEach(curso => { curso.estado = 0; });
    });

    // 1. Carga rápida desde localStorage del usuario actual
    const estadoGuardado = localStorage.getItem(storageKey);
    if (estadoGuardado) {
        try {
            const estado = JSON.parse(estadoGuardado);
            Object.keys(CARRERAS).forEach(carreraId => {
                const cursos = CARRERAS[carreraId].cursos;
                const estadoCarrera = estado[carreraId];
                if (estadoCarrera) {
                    cursos.forEach(curso => {
                        const guardado = estadoCarrera.find(c => c.codigo === curso.codigo || _COMPAT_CODIGOS[c.codigo] === curso.codigo);
                        if (guardado !== undefined) {
                            const val = guardado.estado;
                            curso.estado = typeof val === 'number' ? val : (val === 'aprobado' ? 1 : (val === 'cursando' ? 2 : 0));
                        }
                    });
                }
            });
            if (estado.carreraActual) carreraActual = estado.carreraActual;
        } catch (error) {
            console.error('Error al cargar estado local:', error);
            localStorage.removeItem(storageKey);
        }
    }

    // 2. Supabase SIEMPRE sobreescribe el estado local (fuente de verdad)
    if (session) {
        try {
            const { data, error } = await window.supaAuth.supabase
                .from('user_courses')
                .select('carrera_id, course_id, status')
                .eq('user_id', session.user.id);

            if (!error && data && data.length > 0) {
                const remoteMap = {};
                data.forEach(row => {
                    if (!remoteMap[row.carrera_id]) remoteMap[row.carrera_id] = {};
                    remoteMap[row.carrera_id][row.course_id] = parseInt(row.status);
                });

                // Resetear de nuevo y aplicar solo lo de Supabase
                Object.keys(CARRERAS).forEach(carreraId => {
                    const carreraMap = remoteMap[carreraId] || {};
                    CARRERAS[carreraId].cursos.forEach(curso => {
                        curso.estado = carreraMap[curso.codigo] ?? 0;
                    });
                });

                console.log('✅ Plan cargado desde Supabase');
                // Actualizar localStorage del usuario con los datos de Supabase
                localStorage.setItem(storageKey, JSON.stringify({
                    ingenieriaIndustrial: CARRERAS.ingenieriaIndustrial.cursos.map(c => ({ codigo: c.codigo, estado: c.estado })),
                    contaduriaPublica: CARRERAS.contaduriaPublica.cursos.map(c => ({ codigo: c.codigo, estado: c.estado })),
                    direccionEmpresas: CARRERAS.direccionEmpresas.cursos.map(c => ({ codigo: c.codigo, estado: c.estado })),
                    carreraActual
                }));

                if (typeof renderizarCarrera === 'function') renderizarCarrera();
            } else if (error) {
                console.error('Error al cargar desde Supabase:', error);
            }
        } catch(err) {
            console.error('Error al sincronizar con Supabase:', err);
        }
    }
}

// Escuchar cambios de autenticación para recargar el plan (Definido globalmente)
window.addEventListener('supabase_auth_changed', () => {
    cargarEstado();
});

/**
 * Resetea los datos únicamente de la carrera actual (con confirmación)
 */
function resetearDatos() {
    const nombreCarrera = getNombreCarrera(carreraActual);
    if (confirm(`¿Estás seguro de que querés borrar todo el progreso de ${nombreCarrera}? Esta acción no se puede deshacer.`)) {
        // Limpiamos solo los cursos de la carrera activa
        CARRERAS[carreraActual].cursos.forEach(curso => {
            curso.estado = 0;
        });

        guardarEstado();
        renderizarPlan();

        // Opcional: Notificación visual suave en lugar de recarga total
        console.log(`Plan de ${nombreCarrera} reseteado.`);
    }
}

// ===================================
// LÓGICA DE CAMBIO DE ESTADO
// ===================================

// Picker de estado activo
let pickerCerrandose = false;

/**
 * Al hacer clic en una tarjeta, muestra un picker para seleccionar el estado directamente.
 */
function clickCurso(event, carreraId, codigoCurso) {
    event.stopPropagation();

    const curso = getCursoByCodigo(carreraId, codigoCurso);
    if (!curso) return;

    // Cerrar picker existente
    cerrarPicker();

    // Crear picker
    const picker = document.createElement('div');
    picker.className = 'estado-picker';
    picker.id = 'estado-picker-activo';

    Object.entries(APP_ESTADOS).forEach(([num, info]) => {
        const numInt = parseInt(num);
        // Si el curso tiene requisitos pendientes, no mostrar estados > 0 como disponibles
        // (pero sí pueden volver a 0)
        const opcion = document.createElement('button');
        opcion.className = 'picker-opcion' + (curso.estado === numInt ? ' picker-activo' : '');
        opcion.style.setProperty('--opcion-color', `var(--color-estado-${num})`);
        opcion.innerHTML = `<span class="picker-dot"></span>${info.etiqueta}`;

        // Deshabilitar opciones de estado si no se cumplen los requisitos para ese estado específico
        const habilitado = puedeEstarEnEstado(carreraId, codigoCurso, numInt);
        if (!habilitado) {
            opcion.disabled = true;
            opcion.title = '🔒 Requiere cumplir requisitos en un semestre anterior';
        }

        opcion.addEventListener('click', (e) => {
            e.stopPropagation();
            curso.estado = numInt;
            // Propagar automáticamente a cursos equivalentes en otras carreras
            propagarEstadoCurso(carreraId, codigoCurso, numInt);
            guardarEstado();
            renderizarCarrera();

            // Si el panel de convalidaciones está abierto, refrescarlo
            const panel = document.getElementById('panel-convalidaciones');
            if (panel && panel.classList.contains('active')) {
                renderizarTablaConvalidaciones();
            }

            cerrarPicker();
        });
        picker.appendChild(opcion);
    });

    // Posicionar junto a la tarjeta usando coordenadas globales
    const card = document.querySelector(`.curso-card[data-codigo="${codigoCurso}"]`);
    if (card) {
        const rect = card.getBoundingClientRect();
        picker.style.position = 'fixed';
        picker.style.top = `${rect.bottom + 5}px`;
        picker.style.left = `${rect.left}px`;
        document.body.appendChild(picker);

        // Ajustar si se sale por abajo
        const pickerRect = picker.getBoundingClientRect();
        if (pickerRect.bottom > window.innerHeight) {
            picker.style.top = `${rect.top - pickerRect.height - 5}px`;
        }
    }

    // Cerrar al hacer clic fuera
    setTimeout(() => {
        document.addEventListener('click', function (e) {
            if (!picker.contains(e.target)) {
                cerrarPicker();
            }
        }, { once: true });
    }, 10);
}

function cerrarPicker() {
    const existente = document.getElementById('estado-picker-activo');
    if (existente) existente.remove();
}

// ===================================
// RENDERIZADO DE UI
// ===================================

/**
 * Renderiza la malla curricular de la carrera actual
 */
function renderizarCarrera() {
    const container = document.getElementById('malla-container');
    const carrera = CARRERAS[carreraActual];

    if (!carrera) {
        container.innerHTML = '<p>Carrera no encontrada</p>';
        return;
    }

    const niveles = getNiveles(carreraActual);

    let html = '';
    niveles.forEach((nivel, index) => {
        const cursos = getCursosPorNivel(carreraActual, nivel);
        const creditosTotalesNivel = cursos.reduce((sum, c) => sum + c.creditos, 0);
        const creditosAprobadosNivel = cursos.filter(c => c.estado === 1).reduce((sum, c) => sum + c.creditos, 0);
        const cursosAprobadosNivel = cursos.filter(c => c.estado === 1).length;
        const progresoNivel = Math.round((creditosAprobadosNivel / creditosTotalesNivel) * 100) || 0;

        // Conteos por estado (2-7)
        let proyeccionHtml = '';
        const estadosProyectados = [2, 3, 4, 5, 6, 7];
        estadosProyectados.forEach(e => {
            const count = cursos.filter(c => c.estado === e).length;
            if (count > 0) {
                proyeccionHtml += `
                    <div class="nivel-stat-proy-item state-${e}" title="${APP_ESTADOS[e].etiqueta}">
                        <div class="proy-dot"></div>
                        <span>${count}</span>
                    </div>
                `;
            }
        });

        html += `
      <div class="nivel-grupo" style="animation-delay: ${index * 0.1}s">
        <div class="nivel-header">
          <div class="nivel-header-main">
            <div class="nivel-header-left">
              <span>📅</span>
              <span class="nivel-titulo">Semestre ${nivel} <span class="nivel-año-badge">(Año ${Math.ceil(nivel / 2)})</span></span>
            </div>
            
            <div class="nivel-stats-horizontal">
                <div class="nivel-stat-item">
                    <span class="nivel-stat-label">Créditos:</span>
                    <span class="nivel-stat-value">${creditosAprobadosNivel}/${creditosTotalesNivel}</span>
                </div>
                <div class="nivel-stat-item">
                    <span class="nivel-stat-label">Cursos:</span>
                    <span class="nivel-stat-value">${cursosAprobadosNivel}/${cursos.length}</span>
                </div>
                
                <div class="nivel-stat-divider"></div>
                
                <div class="nivel-proyeccion-mini-grid">
                    ${proyeccionHtml || '<span class="sin-proy">Sin planificar</span>'}
                </div>

                <div class="nivel-stat-divider"></div>

                <div class="nivel-stat-progress-wrap">
                    <div class="nivel-stat-progress">
                        <div class="nivel-stat-progress-bar" style="width: ${progresoNivel}%"></div>
                    </div>
                    <span class="nivel-stat-progress-text">${progresoNivel}%</span>
                </div>
            </div>

            <div class="nivel-creditos-badge">${creditosTotalesNivel} CR</div>
          </div>
        </div>
        <div class="cursos-grid">
    `;

        cursos.forEach(curso => {
            const requisitosCumplidos = puedeSerCursado(carreraActual, curso.codigo);
            const estadoNum = curso.estado;
            const tieneRequisitos = curso.requisitos.length > 0;

            // Un curso se muestra bloqueado si su estado actual (si es > 0) no es válido según sus requisitos.
            // Si está en estado 0, mostramos bloqueado si ni siquiera puede ser "Cursado" (Estado 2).
            const estadoActualValido = estadoNum === 0 ? puedeSerCursado(carreraActual, curso.codigo) : puedeEstarEnEstado(carreraActual, curso.codigo, estadoNum);
            const esBloqueado = !estadoActualValido && tieneRequisitos;

            const infoEstado = APP_ESTADOS[estadoNum];
            const requisitosTexto = getNombresRequisitos(carreraActual, curso.requisitos);

            // Clase principal de la tarjeta: siempre incluimos infoEstado.clase para ver el color
            const claseCard = infoEstado.clase + (esBloqueado ? ' bloqueado' : '');

            // Tooltip de bloqueo
            const tooltipBloqueado = esBloqueado
                ? `title="🔒 Bloqueado para aprobación — Requisitos pendientes: ${requisitosTexto}"`
                : '';

            const compartido = typeof esCompartido === 'function' && esCompartido(carreraActual, curso.codigo);

            html += `
        <div class="curso-card ${claseCard}" 
             data-codigo="${curso.codigo}"
             ${tooltipBloqueado}
             onclick="clickCurso(event, '${carreraActual}', '${curso.codigo}')">
          <div class="curso-header">
            <div class="curso-codigo">${curso.codigo}</div>
            <div class="curso-creditos">${curso.creditos} CR${compartido ? ' <span class="badge-compartido" title="Curso compartido — el estado se sincroniza en todas las carreras">\uD83D\uDD17</span>' : ''}</div>
          </div>
          <div class="curso-nombre">${curso.nombre}</div>
          <div class="curso-requisitos">
            ${curso.requisitos.length > 0 ? '📋 ' + requisitosTexto : '✅ Sin requisitos'}
          </div>
          <div class="curso-estado-badge">
            ${esBloqueado ? '🔒 Bloqueado' : infoEstado.etiqueta}
          </div>
        </div>
      `;
        });

        html += `
        </div>
      </div>
    `;
    });

    container.innerHTML = html;
    actualizarProgreso();
}

/**
 * Actualiza los indicadores de progreso y la carga proyectada
 */
function actualizarProgreso() {
    const totalCreditos = getTotalCreditos(carreraActual);
    const creditosAprobados = getCreditosAprobados(carreraActual);
    const progreso = getProgreso(carreraActual);

    const cursos = getCursosCarrera(carreraActual);
    const cursosAprobados = cursos.filter(c => c.estado === 1).length;
    const cursosCursando = cursos.filter(c => c.estado === 2).length;

    document.getElementById('creditos-aprobados').textContent = creditosAprobados;
    document.getElementById('creditos-totales').textContent = totalCreditos;
    document.getElementById('cursos-aprobados').textContent = cursosAprobados;
    document.getElementById('cursos-totales').textContent = cursos.length;
    document.getElementById('cursos-cursando').textContent = cursosCursando;
    document.getElementById('progreso-porcentaje').textContent = `${progreso}%`;

    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${progreso}%`;

    if (!progressBar.style.width || progressBar.style.width === '0%') {
        progressBar.classList.add('progress-initial');
    } else {
        progressBar.classList.remove('progress-initial');
    }

    // Actualizar carga proyectada (estados 2-7)
    for (let e = 2; e <= 7; e++) {
        const creditosEl = document.getElementById(`carga-estado-${e}`);
        const cursosEl = document.getElementById(`carga-curso-count-${e}`);

        if (creditosEl && cursosEl) {
            const cursosEstado = cursos.filter(c => c.estado === e);
            const totalCreditosEstado = cursosEstado.reduce((sum, c) => sum + c.creditos, 0);

            creditosEl.textContent = totalCreditosEstado;
            cursosEl.textContent = cursosEstado.length;
        }
    }
}

/**
 * Cambia entre carreras
 */
function cambiarCarrera(carreraId) {
    carreraActual = carreraId;

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-carrera="${carreraId}"]`).classList.add('active');

    document.getElementById('nombre-carrera').textContent = getNombreCarrera(carreraId);

    // Actualizar visibilidad del botón de convalidaciones
    const btnContainer = document.getElementById('btn-convalidaciones-container');
    const panel = document.getElementById('panel-convalidaciones');
    
    // Solo mostrar si tiene AMBAS carreras seleccionadas en su perfil
    let activeCareers = window.supaAuth?.getCurrentProfile()?.selected_carreras || [];
    if (activeCareers.length === 0 && typeof CARRERAS !== 'undefined') activeCareers = Object.keys(CARRERAS); // Fallback dev
    
    const hasBothNegocios = activeCareers.includes('contaduriaPublica') && activeCareers.includes('direccionEmpresas');

    if (hasBothNegocios && (carreraId === 'contaduriaPublica' || carreraId === 'direccionEmpresas')) {
        btnContainer.classList.remove('hidden');
    } else {
        btnContainer.classList.add('hidden');
        if (panel) panel.classList.remove('active');
    }

    guardarEstado();
    renderizarCarrera();

    // Si el panel de convalidaciones está abierto, refrescarlo
    if (panel && panel.classList.contains('active')) {
        renderizarTablaConvalidaciones();
    }
}

// ===================================
// ANIMACIONES Y EFECTOS
// ===================================

// ===================================
// LÓGICA DE CONVALIDACIONES
// ===================================

/**
 * Abre o cierra el panel de convalidaciones
 */
function togglePanelConvalidaciones() {
    const panel = document.getElementById('panel-convalidaciones');
    if (!panel) return;

    if (panel.classList.contains('active')) {
        panel.classList.remove('active');
    } else {
        renderizarTablaConvalidaciones();
        panel.classList.add('active');
    }
}

/**
 * Renderiza la tabla de convalidaciones basada en la carrera actual
 */
function renderizarTablaConvalidaciones() {
    const content = document.getElementById('conv-content');
    if (!content || !TABLA_CONVALIDACIONES[carreraActual]) {
        content.innerHTML = '<p class="conv-nota">No hay convalidaciones específicas configuradas para esta carrera.</p>';
        return;
    }

    const convalidaciones = TABLA_CONVALIDACIONES[carreraActual];
    // Determinar carrera destino
    const carreraDestinoId = carreraActual === 'contaduriaPublica' ? 'direccionEmpresas' : 'contaduriaPublica';
    const nombreDestino = getNombreCarrera(carreraDestinoId);

    let html = `
        <table class="tabla-conv">
            <thead>
                <tr>
                    <th>Si ya aprobaste en ${nombreDestino}</th>
                    <th>Estado</th>
                    <th>Se te convalida en ${getNombreCarrera(carreraActual)}</th>
                </tr>
            </thead>
            <tbody>
    `;

    convalidaciones.forEach(conv => {
        // Normalizar origen para que siempre sea un array de objetos {codigo, nombre}
        const origenNormalizado = conv.origen.map(o => typeof o === 'string' ? { codigo: o, nombre: '' } : o);
        const destinoNormalizado = conv.destino.map(d => typeof d === 'string' ? { codigo: d, nombre: '' } : d);

        // Verificar estado de los cursos origen (Vienen de la carrera destino)
        const cursosOrigenInfo = origenNormalizado.map(o => {
            const cursoEnPlan = getCursoByCodigo(carreraDestinoId, o.codigo);
            return {
                codigo: o.codigo,
                nombre: cursoEnPlan ? cursoEnPlan.nombre : o.nombre,
                aprobado: cursoEnPlan ? cursoEnPlan.estado === 1 : false,
                enPlan: !!cursoEnPlan
            };
        });

        const todosAprobados = cursosOrigenInfo.every(c => c.aprobado);
        const algunoAprobado = cursosOrigenInfo.some(c => c.aprobado);

        // Determinar clase y texto de estado
        let statusClass = 'status-pending';
        let statusText = '❌ Pendiente';

        if (todosAprobados) {
            statusClass = 'status-ok';
            statusText = '✅ Listo para tramitar';
        } else if (algunoAprobado) {
            statusClass = 'status-pending'; // Usamos la misma base pero podrías crear una nueva
            statusText = '⚠️ Posible a completar';
        }

        html += `
            <tr>
                <td>
                    <div class="conv-course-group">
                        ${cursosOrigenInfo.map(c => {
            const extLabel = c.enPlan ? '' : ' <small style="opacity:0.6">(Fuera de plan actual)</small>';
            return `<div class="conv-course-item"><span class="conv-course-id">${c.codigo}</span> ${c.nombre}${extLabel}</div>`;
        }).join('')}
                    </div>
                </td>
                <td style="white-space: nowrap;">
                    <span class="conv-status-badge ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <div class="conv-course-group">
                        ${destinoNormalizado.map(d => {
            const cEnPlan = getCursoByCodigo(carreraActual, d.codigo);
            const nombreFinal = cEnPlan ? cEnPlan.nombre : d.nombre;
            const compartido = typeof esCompartido === 'function' && esCompartido(carreraActual, d.codigo);
            const extLabel = cEnPlan ? '' : ' <small style="opacity:0.6">(Fuera de plan actual)</small>';

            return `
                                <div class="conv-course-item">
                                    <span class="conv-course-id">${d.codigo}</span> 
                                    ${nombreFinal}${extLabel}
                                    ${compartido ? '<span class="badge-compartido" title="Este curso es compartido, se sincroniza solo">🔗</span>' : ''}
                                </div>`;
        }).join('')}
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        <p class="conv-nota" style="margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
            ⚠️ <strong>Importante:</strong> Las convalidaciones que no tienen el ícono 🔗 requieren trámite de convalidación manual en la UCR. 
            Esta tabla es informativa basada en la resolución EAN-269-2023.
        </p>
    `;

    content.innerHTML = html;
}

// ===================================
// INICIALIZACIÓN
// ===================================

function inicializar() {
    console.log('Inicializando aplicación v2 (7 estados)...');

    cargarEstado();

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => cambiarCarrera(btn.dataset.carrera));
    });

    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => navigateTo(tab.dataset.tab));
    });

    // Removido navigateTo('login') forzado para evitar parpadeos (FOUC).
    // auth.js se encarga de llamar a navigateTo('login') o navigateTo('home') según el estado de la sesión.

    document.querySelector(`[data-carrera="${carreraActual}"]`)?.classList.add('active');
    document.getElementById('nombre-carrera').textContent = getNombreCarrera(carreraActual);
    renderizarCarrera();
    console.log('Aplicación inicializada correctamente');
}

// Filtra las pestañas de carrera según lo que el usuario eligió en su perfil
function filtrarCarrerasPorPerfil(selectedCarreras) {
    if (!selectedCarreras || selectedCarreras.length === 0) return;

    document.querySelectorAll('.tab-btn[data-carrera]').forEach(btn => {
        if (selectedCarreras.includes(btn.dataset.carrera)) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    });

    // Si la carrera activa no está en la selección, cambiar a la primera disponible
    if (!selectedCarreras.includes(carreraActual)) {
        cambiarCarrera(selectedCarreras[0]);
    }
}


// ===================================
// EXPORTACIÓN A IMAGEN Y PDF
// ===================================

/**
 * Función auxiliar para unificar la preparación del área de captura
 */
async function capturarAreaComoCanvas(area) {
    return await html2canvas(area, {
        scale: 2, // Alta resolución
        backgroundColor: '#000000', // Fondo negro sólido
        logging: false,
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc) => {
            const clonedArea = clonedDoc.getElementById('export-area');
            if (clonedArea) {
                // Forzar que todo sea visible y sin animaciones
                clonedArea.style.height = 'auto';
                clonedArea.style.overflow = 'visible';
                clonedArea.style.padding = '30px';
                clonedArea.style.backgroundColor = '#000000'; // Asegurar el color oscuro

                // Eliminar animaciones y forzar opacidad en los grupos de niveles
                const niveles = clonedArea.querySelectorAll('.nivel-grupo');
                niveles.forEach(n => {
                    n.style.animation = 'none';
                    n.style.opacity = '1';
                    n.style.transform = 'none';
                    n.style.visibility = 'visible';
                });

                // Desactivar filtros backdrop-filter (no soportados por canvas)
                const elements = clonedArea.querySelectorAll('.progress-container, .nivel-header, .curso-card, .leyenda');
                elements.forEach(el => {
                    el.style.backdropFilter = 'none';
                    el.style.webkitBackdropFilter = 'none';
                    el.style.backgroundColor = 'rgba(30, 30, 33, 1)'; // Opaco
                });

                // Forzar opacidad total en todo el texto y tarjetas
                const allNodes = clonedArea.querySelectorAll('*');
                allNodes.forEach(node => {
                    const style = clonedDoc.defaultView.getComputedStyle(node);
                    if (style.opacity === '0') node.style.opacity = '1';
                });
            }
        }
    });
}

/**
 * Captura el área de planificación y la descarga como PNG
 */
async function descargarPlan() {
    const area = document.getElementById('export-area');
    if (!area) return;

    const btn = document.querySelector('.btn-success');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⌛ Generando...';
    btn.disabled = true;

    try {
        const carrera = getNombreCarrera(carreraActual).replace(/\s+/g, '_');
        const fecha = new Date().toISOString().split('T')[0];
        const nombreArchivo = `Plan_Estudios_UCR_${carrera}_${fecha}.png`;

        const canvas = await capturarAreaComoCanvas(area);

        const link = document.createElement('a');
        link.download = nombreArchivo;
        link.href = canvas.toDataURL('image/png');
        link.click();

    } catch (error) {
        console.error('Error al exportar imagen:', error);
        alert('Hubo un error al generar la imagen.');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// ===================================
// SISTEMA DE FEEDBACK
// ===================================
async function submitFeedback() {
    const messageEl = document.getElementById('feedback-message');
    const errorEl = document.getElementById('feedback-error');
    const successEl = document.getElementById('feedback-success');
    const btnSubmit = document.getElementById('btn-submit-feedback');
    
    if (!messageEl || !errorEl || !successEl || !btnSubmit) return;
    
    const message = messageEl.value.trim();
    
    // Ocultar mensajes previos
    errorEl.classList.add('hidden');
    successEl.classList.add('hidden');
    
    if (!message) {
        errorEl.textContent = 'Por favor escribe algo antes de enviar.';
        errorEl.classList.remove('hidden');
        return;
    }
    
    const session = window.supaAuth?.getCurrentSession();
    const userId = session ? session.user.id : null;
    
    // Preparar UI para envío
    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = 'Enviando...';
    btnSubmit.disabled = true;
    messageEl.disabled = true;
    
    try {
        if (!window.supaAuth?.supabase) {
            throw new Error("No hay conexión con la base de datos.");
        }
        
        const { error } = await window.supaAuth.supabase
            .from('user_feedback')
            .insert([
                { user_id: userId, message: message }
            ]);
            
        if (error) throw error;
        
        // Éxito
        successEl.classList.remove('hidden');
        messageEl.value = ''; // Limpiar textarea
        
        // Cerrar modal automáticamente después de 2 segundos
        setTimeout(() => {
            document.getElementById('feedback-modal').classList.add('hidden');
            successEl.classList.add('hidden'); // Resetear para la próxima vez
        }, 2000);
        
    } catch (err) {
        console.error('[Feedback] Error:', err);
        const errorMsg = err.message || JSON.stringify(err);
        errorEl.textContent = 'Error: ' + errorMsg;
        errorEl.classList.remove('hidden');
    } finally {
        btnSubmit.innerHTML = originalText;
        btnSubmit.disabled = false;
        messageEl.disabled = false;
    }
}

// ===================================
// PANEL DE ADMIN — TABS Y ESTADO
// ===================================
let _adminFeedbackAll = [];
let _adminCurrentTab = 'pending';

function esAdmin() {
    return window.supaAuth?.getStoredUsername()?.toUpperCase() === 'DENGO1106';
}

function initAdminBtn() {
    if (esAdmin()) {
        const adminBtn = document.getElementById('btn-admin-panel');
        if (adminBtn) adminBtn.classList.remove('hidden');
    }
}

async function openAdminPanel() {
    const session = window.supaAuth?.getCurrentSession();
    if (!session || !esAdmin() || !window.supaAuth?.supabase) return;

    document.getElementById('admin-modal').classList.remove('hidden');
    const listEl = document.getElementById('admin-feedback-list');
    listEl.innerHTML = '<div class="flex items-center justify-center py-12"><p class="text-gray-400 text-sm animate-pulse">Cargando feedback...</p></div>';

    try {
        const supabase = window.supaAuth.supabase;

        // 1. Obtener todos los feedbacks
        const { data: feedbacks, error: fbError } = await supabase
            .from('user_feedback')
            .select('id, user_id, message, status, created_at')
            .order('created_at', { ascending: false });

        if (fbError) throw fbError;

        // 2. Obtener perfiles de los usuarios únicos para mostrar nombres reales
        const userIds = [...new Set(feedbacks.filter(f => f.user_id).map(f => f.user_id))];
        let profilesMap = {};

        if (userIds.length > 0) {
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, full_name, student_id')
                .in('id', userIds);

            if (profiles) {
                profiles.forEach(p => { profilesMap[p.id] = p; });
            }
        }

        // 3. Combinar datos
        _adminFeedbackAll = feedbacks.map(f => ({
            ...f,
            profile: f.user_id ? (profilesMap[f.user_id] || null) : null
        }));

        // 4. Actualizar contadores en los tabs
        _actualizarContadoresAdmin();

        // 5. Renderizar la tab activa
        renderAdminFeedback(_adminCurrentTab);
        if (window.lucide) lucide.createIcons();

    } catch (err) {
        console.error("Error fetching feedback para admin:", err);
        listEl.innerHTML = `<p class="text-red-500 text-sm text-center py-4">Error cargando datos: ${err.message}</p>`;
    }
}

function _actualizarContadoresAdmin() {
    const pendingCount = _adminFeedbackAll.filter(f => f.status === 'pending').length;
    const reviewedCount = _adminFeedbackAll.filter(f => f.status !== 'pending').length;

    document.getElementById('admin-pending-count').textContent = pendingCount;
    document.getElementById('admin-reviewed-count').textContent = reviewedCount;
    document.getElementById('admin-feedback-count').textContent =
        `${_adminFeedbackAll.length} mensajes en total · ${pendingCount} sin revisar`;
}

function switchAdminTab(tab) {
    _adminCurrentTab = tab;

    const pendingBtn = document.getElementById('admin-tab-pending');
    const reviewedBtn = document.getElementById('admin-tab-reviewed');

    if (tab === 'pending') {
        pendingBtn.className = 'flex-1 py-2.5 text-sm font-bold text-white bg-yellow-500/20 rounded-xl border border-yellow-500/30 transition-all flex items-center justify-center gap-2';
        reviewedBtn.className = 'flex-1 py-2.5 text-sm font-bold text-gray-500 hover:text-white rounded-xl transition-all flex items-center justify-center gap-2';
    } else {
        reviewedBtn.className = 'flex-1 py-2.5 text-sm font-bold text-white bg-green-500/20 rounded-xl border border-green-500/30 transition-all flex items-center justify-center gap-2';
        pendingBtn.className = 'flex-1 py-2.5 text-sm font-bold text-gray-500 hover:text-white rounded-xl transition-all flex items-center justify-center gap-2';
    }

    renderAdminFeedback(tab);
}

function renderAdminFeedback(tab) {
    const listEl = document.getElementById('admin-feedback-list');

    const filtered = _adminFeedbackAll.filter(f =>
        tab === 'pending' ? f.status === 'pending' : f.status !== 'pending'
    );

    if (filtered.length === 0) {
        listEl.innerHTML = `
            <div class="flex flex-col items-center justify-center py-16 text-center">
                <div class="text-5xl mb-4">${tab === 'pending' ? '🎉' : '📭'}</div>
                <p class="text-white font-bold mb-1">${tab === 'pending' ? '¡Sin feedback pendiente!' : 'Sin mensajes revisados'}</p>
                <p class="text-gray-500 text-sm">${tab === 'pending' ? 'Todo al día, no hay nada nuevo por revisar.' : 'Cuando marques mensajes como vistos aparecerán aquí.'}</p>
            </div>
        `;
        return;
    }

    listEl.innerHTML = filtered.map(f => {
        const nombre = f.profile?.full_name || 'Usuario Anónimo';
        const inicial = nombre.charAt(0).toUpperCase();
        const carnet = f.profile?.student_id ? `· Carné: ${f.profile.student_id}` : '';
        const fecha = new Date(f.created_at).toLocaleString('es-CR', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        const isPending = f.status === 'pending';

        return `
            <div class="bg-black/40 border border-${isPending ? 'yellow-500/15' : 'white/5'} rounded-2xl p-5 transition-all" id="feedback-card-${f.id}">
                <!-- Cabecera: avatar + info usuario -->
                <div class="flex items-center justify-between gap-3 mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-zinc-700 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0 border border-white/10">
                            ${inicial}
                        </div>
                        <div>
                            <div class="text-sm font-bold text-white">${nombre}</div>
                            <div class="text-xs text-gray-500">${fecha} ${carnet}</div>
                        </div>
                    </div>
                    <span class="text-[10px] px-2.5 py-1 rounded-full font-bold flex-shrink-0 ${isPending ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25' : 'bg-green-500/15 text-green-400 border border-green-500/25'}">
                        ${isPending ? '⏳ Pendiente' : '✅ Revisado'}
                    </span>
                </div>

                <!-- Mensaje -->
                <div class="bg-black/30 rounded-xl p-4 mb-4 border border-white/5">
                    <p class="text-sm text-gray-200 leading-relaxed">${f.message}</p>
                </div>

                <!-- Acciones -->
                <div class="flex gap-2 justify-end">
                    ${isPending ? `
                    <button onclick="markFeedbackAsReviewed('${f.id}')"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-green-500/15 hover:bg-green-500/25 text-green-400 rounded-lg border border-green-500/25 transition-all">
                        <i data-lucide="check" class="w-3 h-3"></i> Marcar como Visto
                    </button>
                    ` : `
                    <button onclick="deleteFeedback('${f.id}')"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-red-500/15 hover:bg-red-500/25 text-red-400 rounded-lg border border-red-500/25 transition-all">
                        <i data-lucide="trash-2" class="w-3 h-3"></i> Eliminar
                    </button>
                    `}
                </div>
            </div>
        `;
    }).join('');

    if (window.lucide) lucide.createIcons();
}

async function markFeedbackAsReviewed(feedbackId) {
    const session = window.supaAuth?.getCurrentSession();
    if (!session || !esAdmin() || !window.supaAuth?.supabase) return;

    // Feedback visual inmediato: deshabilitar el botón
    const card = document.getElementById(`feedback-card-${feedbackId}`);
    if (card) {
        const btn = card.querySelector('button[onclick*="markFeedbackAsReviewed"]');
        if (btn) { btn.disabled = true; btn.innerHTML = 'Guardando...'; }
    }

    try {
        const { error } = await window.supaAuth.supabase
            .from('user_feedback')
            .update({ status: 'reviewed' })
            .eq('id', feedbackId);

        if (error) throw error;

        // Actualizar el dato local sin recargar todo
        const item = _adminFeedbackAll.find(f => f.id === feedbackId);
        if (item) item.status = 'reviewed';

        // Refrescar contadores y lista
        _actualizarContadoresAdmin();
        renderAdminFeedback(_adminCurrentTab);
        if (window.lucide) lucide.createIcons();

    } catch (err) {
        console.error("Error marking as reviewed:", err);
        alert("Error al actualizar: " + err.message);
        // Restaurar el botón si falló
        renderAdminFeedback(_adminCurrentTab);
    }
}

async function deleteFeedback(feedbackId) {
    const session = window.supaAuth?.getCurrentSession();
    if (!session || !esAdmin() || !window.supaAuth?.supabase) return;

    if (!confirm('¿Estás seguro de que querés eliminar este feedback permanentemente?')) return;

    // Feedback visual inmediato
    const card = document.getElementById(`feedback-card-${feedbackId}`);
    if (card) {
        card.style.opacity = '0.5';
        card.style.pointerEvents = 'none';
    }

    try {
        const { error } = await window.supaAuth.supabase
            .from('user_feedback')
            .delete()
            .eq('id', feedbackId);

        if (error) throw error;

        // Actualizar estado local
        _adminFeedbackAll = _adminFeedbackAll.filter(f => f.id !== feedbackId);
        _actualizarContadoresAdmin();
        renderAdminFeedback(_adminCurrentTab);

    } catch (err) {
        console.error("Error al eliminar feedback:", err);
        alert("Error al eliminar el feedback: " + err.message);
        // Restaurar si falló
        renderAdminFeedback(_adminCurrentTab);
    }
}

// ===================================
// GESTOS MÓVILES (SWIPE TO GO BACK)
// ===================================
let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;

document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
    touchstartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    touchendY = e.changedTouches[0].screenY;
    handleSwipeGesture();
}, { passive: true });

function handleSwipeGesture() {
    // Si no estamos en una subpantalla, no hacer nada
    const homeEl = document.getElementById('home-section');
    if (homeEl && !homeEl.classList.contains('hidden')) return;

    // Calcular diferencias
    const diffX = touchendX - touchstartX;
    const diffY = Math.abs(touchendY - touchstartY);

    // Si el swipe empezó muy cerca del borde izquierdo (ej: < 40px)
    // Y el swipe fue predominantemente horizontal hacia la derecha
    if (touchstartX < 40 && diffX > 60 && diffY < 50) {
        if (typeof navigateTo === 'function') {
            navigateTo('home');
        }
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}

// Manejar el botón "Atrás" del navegador/móvil
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
        window.navigateTo(e.state.page, false);
    } else {
        // Si no hay estado, asume que es home o sale
        const isAuthenticated = window.supaAuth && window.supaAuth.getCurrentSession();
        if (isAuthenticated) {
            window.navigateTo('home', false);
        } else {
            window.navigateTo('login', false);
        }
    }
});
