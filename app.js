// ===================================
// GESTIÃ“N DE ESTADO Y PERSISTENCIA
// ===================================

let carreraActual = 'ingenieriaIndustrial';
const APP_STORAGE_KEY = 'ucr_planes_estudio_v3';

const APP_ESTADOS = {
    0: { etiqueta: 'Pendiente', clase: 'estado-0' },
    1: { etiqueta: 'Aprobado', clase: 'estado-1' },
    2: { etiqueta: 'Cursando', clase: 'estado-2' },
    3: { etiqueta: 'PrÃ³ximo Semestre', clase: 'estado-3' },
    4: { etiqueta: 'AÃ±o +1', clase: 'estado-4' },
    5: { etiqueta: 'AÃ±o +2', clase: 'estado-5' },
    6: { etiqueta: 'AÃ±o +3', clase: 'estado-6' },
    7: { etiqueta: 'Meta Largo Plazo', clase: 'estado-7' }
};

// Clave de localStorage para recordar la Ãºltima pÃ¡gina visitada
const UCR_LAST_PAGE_KEY = 'ucr_last_page';

// FunciÃ³n de navegaciÃ³n global simplificada
window.navigateTo = (target, pushToHistory = true) => {
    // ðŸ”’ Control de Acceso: Redirigir a login si no hay sesiÃ³n
    const isAuthenticated = window.supaAuth && window.supaAuth.getCurrentSession();
    if (!isAuthenticated && target !== 'login') {
        console.warn("Acceso denegado: redirigiendo a login.");
        target = 'login';
    }

    // Guardar la pÃ¡gina actual en localStorage (excepto login)
    if (target !== 'login') {
        localStorage.setItem(UCR_LAST_PAGE_KEY, target);
    }

    // Historial de navegaciÃ³n para botÃ³n "AtrÃ¡s" en mÃ³viles
    if (pushToHistory && target !== 'login') {
        try {
            history.pushState({ page: target }, '', '#' + target);
        } catch (e) {
            console.warn("history.pushState no soportado en este entorno (posible file://)", e);
        }
    }

    // Asegurar que al cambiar de secciÃ³n, volvemos arriba (Ãºtil en mÃ³viles)
    window.scrollTo({ top: 0, behavior: 'instant' });

    document.documentElement.removeAttribute('data-initial-page');
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    if (typeof cerrarPicker === 'function') cerrarPicker();

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
        if (_perfil?.selected_carreras?.length > 0) {
            filtrarCarrerasPorPerfil(_perfil.selected_carreras);
            // Asegurar que la UI de la carrera activa se renderice inmediatamente
            cambiarCarrera(carreraActual);
        }
    } else if (target === 'horario') {
        const hSection = document.getElementById('horarios-section');
        if (hSection) hSection.classList.remove('hidden');
        const horarioBtn = document.querySelector('[data-tab="horario"]');
        if (horarioBtn) horarioBtn.classList.add('active');
        document.querySelector('.controls-container').classList.add('hidden');
        if (appNav) appNav.classList.remove('hidden');
        if (typeof initScheduler === 'function') initScheduler();
        // Generar horario automÃ¡ticamente al entrar a la secciÃ³n
        if (typeof generateSchedule === 'function') setTimeout(generateSchedule, 50);
    } else if (target === 'calculator') {
        const calcSection = document.getElementById('calculator-section');
        if (calcSection) calcSection.classList.remove('hidden');
        document.querySelector('.controls-container')?.classList.add('hidden');
        if (appNav) appNav.classList.add('hidden'); // Calculadora tiene su propia navegaciÃ³n
        if (typeof calcLoadAuto === 'function') {
            // Dar un pequeÃ±o tiempo por si los datos no han cargado aÃºn
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

// DelegaciÃ³n global de eventos para navegaciÃ³n
document.addEventListener('click', (e) => {
    const navBtn = e.target.closest('[data-navigate]');
    if (navBtn) {
        e.preventDefault();
        window.navigateTo(navBtn.dataset.navigate);
    }
});

/**
 * Guarda el estado actual en localStorage y en Supabase
 */
async function guardarEstado() {
    try {
        const session = window.supaAuth?.getCurrentSession();
        // Clave Ãºnica por usuario â€” evita que los datos se mezclen entre cuentas
        const storageKey = session ? `ucr_estado_${session.user.id}` : APP_STORAGE_KEY;

        const estado = {
            carreraActual: carreraActual,
            ultimaActualizacion: new Date().toISOString()
        };
        Object.keys(CARRERAS).forEach(carreraId => {
            estado[carreraId] = CARRERAS[carreraId].cursos.map(c => ({ codigo: c.codigo, estado: c.estado }));
        });

        localStorage.setItem(storageKey, JSON.stringify(estado));

        // Sincronizar a Supabase si el usuario estÃ¡ autenticado
        if (session) {
            const user = session.user;
            const coursesToUpsert = [];
            Object.keys(CARRERAS).forEach(carreraId => {
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
                else console.log(`âœ… Progreso sincronizado: ${coursesToUpsert.length} cursos`);
            }
        }
    } catch (error) {
        console.error('Error al guardar estado:', error);
    }
}

function openNoticiasModal() {
    // Ensure noticias are loaded into the modal
    if (typeof loadNoticias === 'function') loadNoticias();
    const modal = document.getElementById('noticias-modal');
    if (modal) modal.classList.remove('hidden');
}

/**
 * Mapa de retrocompatibilidad: cÃ³digos viejos â†’ cÃ³digos nuevos.
 * Necesario porque renombramos REPOâ†’RP-, MA-0001â†’MA0001, OPT-1â†’OPT-ING, OPT-S3â†’OPT-ING.
 */
const _COMPAT_CODIGOS = {
    'REPO': 'RP-',
    'MA-0001': 'MA0001',
    'OPT-1': 'OPT-ING',
    'OPT-S3': 'OPT-ING'
};

/**
 * Carga el estado local y asÃ­ncronamente desde Supabase si aplica.
 */
async function cargarEstado() {
    const session = window.supaAuth?.getCurrentSession();
    const storageKey = session ? `ucr_estado_${session.user.id}` : APP_STORAGE_KEY;

    // 1. Determinar carrera activa del usuario (del perfil de Supabase o localStorage)
    const estadoGuardado = localStorage.getItem(storageKey);
    if (estadoGuardado) {
        try {
            const estado = JSON.parse(estadoGuardado);
            if (estado.carreraActual) carreraActual = estado.carreraActual;
            
            // Cargar estados de los cursos desde localStorage
            Object.keys(CARRERAS).forEach(cId => {
                if (estado[cId]) {
                    estado[cId].forEach(savedCurso => {
                        const curso = CARRERAS[cId].cursos.find(c => c.codigo === savedCurso.codigo);
                        if (curso) {
                            curso.estado = Number(savedCurso.estado);
                        }
                    });
                }
            });
        } catch (e) { /* Ignorar error de parseo */ }
    }

    // 2. Obtener carreras activas del perfil para precargar las necesarias
    let activeCareers = window.supaAuth?.getCurrentProfile()?.selected_carreras || [];
    if (activeCareers.length === 0) activeCareers = [carreraActual];

    // 3. Cargar cursos de Supabase para todas las carreras activas del usuario (paralelo)
    if (session && window.supaAuth?.supabase) {
        await Promise.all(activeCareers.map(cId => {
            if (CARRERAS[cId]) return cargarCursosDeSupabase(cId);
        }));
    }

    // 4. Resetear estados a 0 (eliminado: se gestiona mediante la lÃ³gica de precarga)

    // 5. Supabase como fuente de verdad: carga estados del usuario
    if (session && window.supaAuth?.supabase) {
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

                Object.keys(CARRERAS).forEach(carreraId => {
                    const carreraMap = remoteMap[carreraId] || {};
                    CARRERAS[carreraId].cursos.forEach(curso => {
                        curso.estado = carreraMap[curso.codigo] ?? curso.estado;
                    });
                });

                console.log('âœ… Plan cargado desde Supabase');
                const newLocalState = { carreraActual };
                Object.keys(CARRERAS).forEach(carreraId => {
                    newLocalState[carreraId] = CARRERAS[carreraId].cursos.map(c => ({ codigo: c.codigo, estado: c.estado }));
                });
                localStorage.setItem(storageKey, JSON.stringify(newLocalState));
            } else if (error) {
                console.error('Error al cargar desde Supabase:', error);
            }
        } catch(err) {
            console.error('Error al sincronizar con Supabase:', err);
        }
    }

    if (typeof renderizarCarrera === 'function') renderizarCarrera();
    if (typeof cargarHorarios === 'function') cargarHorarios();

    // Iniciar realtime y tutorial al finalizar carga
    setupRealtimeSubscription();
    iniciarTutorial();
}

// Escuchar cambios de autenticaciÃ³n para recargar el plan (Definido globalmente)
window.addEventListener('supabase_auth_changed', async () => {
    await cargarCarrerasDeSupabase();
    cargarEstado();

    // Generar UI dinÃ¡micamente desde CARRERAS
    const selectionList = document.getElementById('career-selection-list');
    const tabsContainer = document.getElementById('carrera-tabs-container');
    if (selectionList) selectionList.innerHTML = '';
    if (tabsContainer) tabsContainer.innerHTML = '';

    // AgrupaciÃ³n por facultades y colores aleatorios
    const colorPalettes = [
        { accent: 'accent-red-600', border: 'hover:border-red-500/40 has-[:checked]:border-red-500/60', bg: 'has-[:checked]:bg-red-950/20' },
        { accent: 'accent-blue-500', border: 'hover:border-blue-500/40 has-[:checked]:border-blue-500/60', bg: 'has-[:checked]:bg-blue-950/20' },
        { accent: 'accent-emerald-500', border: 'hover:border-emerald-500/40 has-[:checked]:border-emerald-500/60', bg: 'has-[:checked]:bg-emerald-950/20' },
        { accent: 'accent-purple-500', border: 'hover:border-purple-500/40 has-[:checked]:border-purple-500/60', bg: 'has-[:checked]:bg-purple-950/20' },
        { accent: 'accent-amber-500', border: 'hover:border-amber-500/40 has-[:checked]:border-amber-500/60', bg: 'has-[:checked]:bg-amber-950/20' },
        { accent: 'accent-cyan-500', border: 'hover:border-cyan-500/40 has-[:checked]:border-cyan-500/60', bg: 'has-[:checked]:bg-cyan-950/20' },
        { accent: 'accent-rose-500', border: 'hover:border-rose-500/40 has-[:checked]:border-rose-500/60', bg: 'has-[:checked]:bg-rose-950/20' },
        { accent: 'accent-fuchsia-500', border: 'hover:border-fuchsia-500/40 has-[:checked]:border-fuchsia-500/60', bg: 'has-[:checked]:bg-fuchsia-950/20' }
    ];

    const facultiesMap = {};
    let colorIndex = 0;

    Object.keys(CARRERAS).forEach(cId => {
        const c = CARRERAS[cId];
        const fac = c.facultad || 'Otras Disciplinas';
        if (!facultiesMap[fac]) facultiesMap[fac] = [];
        facultiesMap[fac].push(cId);
        
        // 2. Tabs en la vista de plan (igual que antes)
        if (tabsContainer) {
            const btn = document.createElement('button');
            btn.className = "tab-btn hidden";
            btn.dataset.carrera = cId;
            btn.textContent = c.nombre;
            btn.addEventListener('click', () => cambiarCarrera(cId));
            tabsContainer.appendChild(btn);
        }
    });

    // 1. Checkboxes en el modal (agrupados)
    if (selectionList) {
        Object.keys(facultiesMap).forEach(facName => {
            // Contenedor de Facultad
            const facDiv = document.createElement('div');
            facDiv.className = "mb-6";
            
            // TÃ­tulo de Facultad
            const facTitle = document.createElement('h3');
            facTitle.className = "text-emerald-400 font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2";
            facTitle.innerHTML = `<i data-lucide="building" class="w-4 h-4"></i> ${facName}`;
            facDiv.appendChild(facTitle);
            
            // Grid de carreras de esta facultad
            const gridDiv = document.createElement('div');
            gridDiv.className = "space-y-3";
            
            facultiesMap[facName].forEach(cId => {
                const c = CARRERAS[cId];
                const color = colorPalettes[colorIndex % colorPalettes.length];
                colorIndex++;
                
                const lbl = document.createElement('label');
                lbl.className = `flex items-center gap-4 p-5 bg-zinc-900 border border-white/10 rounded-2xl cursor-pointer transition-all ${color.border} ${color.bg}`;
                lbl.innerHTML = `
                  <input type="checkbox" value="${cId}" class="carrera-check w-5 h-5 ${color.accent}">
                  <div class="text-left">
                    <div class="text-white font-bold">${c.nombre}</div>
                    <div class="text-gray-500 text-xs mt-0.5">${c.descripcion}</div>
                  </div>
                `;
                gridDiv.appendChild(lbl);
            });
            facDiv.appendChild(gridDiv);
            selectionList.appendChild(facDiv);
        });
        
        // Instanciar iconos si existe lucide (para el building icon)
        if (window.lucide) lucide.createIcons();
    }

});

/**
 * Resetea los datos Ãºnicamente de la carrera actual (con confirmaciÃ³n)
 */
function resetearDatos() {
    const nombreCarrera = getNombreCarrera(carreraActual);
    if (confirm(`Â¿EstÃ¡s seguro de que querÃ©s borrar todo el progreso de ${nombreCarrera}? Esta acciÃ³n no se puede deshacer.`)) {
        // Limpiamos solo los cursos de la carrera activa
        CARRERAS[carreraActual].cursos.forEach(curso => {
            curso.estado = 0;
        });

        guardarEstado();
        // Recargar la pÃ¡gina para que la UI quede completamente limpia
        location.reload();
    }
}

// ===================================
// LÃ“GICA DE CAMBIO DE ESTADO
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
        // (pero sÃ­ pueden volver a 0)
        const opcion = document.createElement('button');
        opcion.className = 'picker-opcion' + (curso.estado === numInt ? ' picker-activo' : '');
        opcion.style.setProperty('--opcion-color', `var(--color-estado-${num})`);
        opcion.innerHTML = `<span class="picker-dot"></span>${info.etiqueta}`;

        // Deshabilitar opciones de estado si no se cumplen los requisitos para ese estado especÃ­fico
        const habilitado = puedeEstarEnEstado(carreraId, codigoCurso, numInt);
        if (!habilitado) {
            opcion.disabled = true;
            opcion.title = 'ðŸ”’ Requiere cumplir requisitos en un semestre anterior';
        }

        opcion.addEventListener('click', (e) => {
            e.stopPropagation();
            curso.estado = numInt;
            // Propagar automÃ¡ticamente a cursos equivalentes en otras carreras
            propagarEstadoCurso(carreraId, codigoCurso, numInt);
            guardarEstado();
            renderizarCarrera();

            // Si el panel de convalidaciones estÃ¡ abierto, refrescarlo
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

    // Cerrar al hacer clic fuera (mejorado para no consumirse si se hace clic dentro del picker)
    setTimeout(() => {
        const outsideClickListener = (e) => {
            if (!picker.contains(e.target)) {
                cerrarPicker();
                document.removeEventListener('click', outsideClickListener);
            }
        };
        document.addEventListener('click', outsideClickListener);
        
        // Guardar referencia para poder removerlo si se cierra por otro medio
        picker._outsideClickListener = outsideClickListener;
    }, 10);
}

function cerrarPicker() {
    const existente = document.getElementById('estado-picker-activo');
    if (existente) {
        if (existente._outsideClickListener) {
            document.removeEventListener('click', existente._outsideClickListener);
        }
        existente.remove();
    }
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
        container.innerHTML = '<p class="text-center text-red-500 py-10 font-bold">Carrera no encontrada</p>';
        return;
    }

    if (!carrera.cursos || carrera.cursos.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
                <div class="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6 border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                    <i data-lucide="hard-hat" class="w-10 h-10 text-yellow-400"></i>
                </div>
                <h3 class="text-3xl font-black text-white mb-3">Plan en ConstrucciÃ³n</h3>
                <p class="text-gray-400 max-w-md mx-auto text-sm leading-relaxed mb-6">
                    Estamos trabajando arduamente en la recolecciÃ³n y validaciÃ³n de todos los cursos y requisitos para <strong class="text-white">${carrera.nombre}</strong>.
                </p>
                <div class="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg text-xs font-bold border border-blue-500/20">
                    <i data-lucide="clock" class="w-4 h-4"></i> EstarÃ¡ disponible en la prÃ³xima actualizaciÃ³n
                </div>
            </div>
        `;
        actualizarProgreso(); // DejarÃ¡ todo en 0%
        if (window.lucide) lucide.createIcons();
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
              <span>ðŸ“…</span>
              <span class="nivel-titulo">Semestre ${nivel} <span class="nivel-aÃ±o-badge">(AÃ±o ${Math.ceil(nivel / 2)})</span></span>
            </div>
            
            <div class="nivel-stats-horizontal">
                <div class="nivel-stat-item">
                    <span class="nivel-stat-label">CrÃ©ditos:</span>
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

            // Un curso se muestra bloqueado si su estado actual (si es > 0) no es vÃ¡lido segÃºn sus requisitos.
            // Si estÃ¡ en estado 0, mostramos bloqueado si ni siquiera puede ser "Cursado" (Estado 2).
            const estadoActualValido = estadoNum === 0 ? puedeSerCursado(carreraActual, curso.codigo) : puedeEstarEnEstado(carreraActual, curso.codigo, estadoNum);
            const esBloqueado = !estadoActualValido && tieneRequisitos;

            const infoEstado = APP_ESTADOS[estadoNum];
            const requisitosTexto = getNombresRequisitos(carreraActual, curso.requisitos);

            // Clase principal de la tarjeta: siempre incluimos infoEstado.clase para ver el color
            const claseCard = infoEstado.clase + (esBloqueado ? ' bloqueado' : '');

            // Tooltip de bloqueo
            const tooltipBloqueado = esBloqueado
                ? `title="ðŸ”’ Bloqueado para aprobaciÃ³n â€” Requisitos pendientes: ${requisitosTexto}"`
                : '';

            const compartido = typeof esCompartido === 'function' && esCompartido(carreraActual, curso.codigo);

            html += `
        <div class="curso-card ${claseCard}" 
             data-codigo="${curso.codigo}"
             ${tooltipBloqueado}
             onclick="clickCurso(event, '${carreraActual}', '${curso.codigo}')">
          <div class="curso-header">
            <div class="curso-codigo">${curso.codigo}</div>
            <div class="curso-creditos">${curso.creditos} CR${compartido ? ' <span class="badge-compartido" title="Curso compartido â€” el estado se sincroniza en todas las carreras">\uD83D\uDD17</span>' : ''}</div>
          </div>
          <div class="curso-nombre">${curso.nombre}</div>
          <div class="curso-requisitos">
            ${curso.requisitos.length > 0 ? 'ðŸ“‹ ' + requisitosTexto : 'âœ… Sin requisitos'}
          </div>
          <div class="curso-estado-badge">
            ${esBloqueado ? 'ðŸ”’ Bloqueado' : infoEstado.etiqueta}
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
 * Cambia entre carreras (ahora async: descarga cursos de Supabase si aÃºn no estÃ¡n en memoria)
 */
async function cambiarCarrera(carreraId) {
    if (!carreraId || !CARRERAS[carreraId]) {
        console.warn(`[App] Intento de cambiar a carrera invÃ¡lida: ${carreraId}`);
        return;
    }
    carreraActual = carreraId;

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const targetBtn = document.querySelector(`[data-carrera="${carreraId}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }

    const titleEl = document.getElementById('nombre-carrera');
    if (titleEl) titleEl.textContent = getNombreCarrera(carreraId);

    // Actualizar visibilidad del botÃ³n de convalidaciones
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

    // === DESCARGA LAZY DE CURSOS DESDE SUPABASE ===
    if (CARRERAS[carreraId].cursos.length === 0) {
        const planEl = document.getElementById('plan-container') || document.getElementById('cursos-container');
        if (planEl) planEl.innerHTML = `
            <div class="flex flex-col items-center justify-center py-16 gap-4">
                <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p class="text-gray-400 text-sm animate-pulse">Cargando plan de estudios...</p>
            </div>`;
        
        const ok = await cargarCursosDeSupabase(carreraId);
        if (ok) {
            // Aplicar estados guardados en Supabase para esta carrera
            const session = window.supaAuth?.getCurrentSession();
            if (session && window.supaAuth?.supabase) {
                const { data } = await window.supaAuth.supabase
                    .from('user_courses')
                    .select('course_id, status')
                    .eq('user_id', session.user.id)
                    .eq('carrera_id', carreraId);
                if (data && data.length > 0) {
                    const map = {};
                    data.forEach(r => { map[r.course_id] = parseInt(r.status); });
                    CARRERAS[carreraId].cursos.forEach(c => { c.estado = map[c.codigo] ?? 0; });
                }
            }
        }
    }

    guardarEstado();
    renderizarCarrera();

    // Si el panel de convalidaciones estÃ¡ abierto, refrescarlo
    if (panel && panel.classList.contains('active')) {
        renderizarTablaConvalidaciones();
    }
}


// ===================================
// ANIMACIONES Y EFECTOS
// ===================================

// ===================================
// LÃ“GICA DE CONVALIDACIONES
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
        content.innerHTML = '<p class="conv-nota">No hay convalidaciones especÃ­ficas configuradas para esta carrera.</p>';
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
        let statusText = 'âŒ Pendiente';

        if (todosAprobados) {
            statusClass = 'status-ok';
            statusText = 'âœ… Listo para tramitar';
        } else if (algunoAprobado) {
            statusClass = 'status-pending'; // Usamos la misma base pero podrÃ­as crear una nueva
            statusText = 'âš ï¸ Posible a completar';
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
                                    ${compartido ? '<span class="badge-compartido" title="Este curso es compartido, se sincroniza solo">ðŸ”—</span>' : ''}
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
            âš ï¸ <strong>Importante:</strong> Las convalidaciones que no tienen el Ã­cono ðŸ”— requieren trÃ¡mite de convalidaciÃ³n manual en la UCR. 
            Esta tabla es informativa basada en la resoluciÃ³n EAN-269-2023.
        </p>
    `;

    content.innerHTML = html;
}

// ===================================
// INICIALIZACIÃ“N
// ===================================

function inicializar() {
    console.log('Inicializando aplicaciÃ³n v2 (7 estados)...');

    cargarEstado();
    if (typeof loadNoticias === 'function') loadNoticias();

    // Generar UI dinÃ¡micamente desde CARRERAS
    const selectionList = document.getElementById('career-selection-list');
    const tabsContainer = document.getElementById('carrera-tabs-container');
    if (selectionList) selectionList.innerHTML = '';
    if (tabsContainer) tabsContainer.innerHTML = '';

    // AgrupaciÃ³n por facultades y colores aleatorios
    const colorPalettes = [
        { accent: 'accent-red-600', border: 'hover:border-red-500/40 has-[:checked]:border-red-500/60', bg: 'has-[:checked]:bg-red-950/20' },
        { accent: 'accent-blue-500', border: 'hover:border-blue-500/40 has-[:checked]:border-blue-500/60', bg: 'has-[:checked]:bg-blue-950/20' },
        { accent: 'accent-emerald-500', border: 'hover:border-emerald-500/40 has-[:checked]:border-emerald-500/60', bg: 'has-[:checked]:bg-emerald-950/20' },
        { accent: 'accent-purple-500', border: 'hover:border-purple-500/40 has-[:checked]:border-purple-500/60', bg: 'has-[:checked]:bg-purple-950/20' },
        { accent: 'accent-amber-500', border: 'hover:border-amber-500/40 has-[:checked]:border-amber-500/60', bg: 'has-[:checked]:bg-amber-950/20' },
        { accent: 'accent-cyan-500', border: 'hover:border-cyan-500/40 has-[:checked]:border-cyan-500/60', bg: 'has-[:checked]:bg-cyan-950/20' },
        { accent: 'accent-rose-500', border: 'hover:border-rose-500/40 has-[:checked]:border-rose-500/60', bg: 'has-[:checked]:bg-rose-950/20' },
        { accent: 'accent-fuchsia-500', border: 'hover:border-fuchsia-500/40 has-[:checked]:border-fuchsia-500/60', bg: 'has-[:checked]:bg-fuchsia-950/20' }
    ];

    const facultiesMap = {};
    let colorIndex = 0;

    Object.keys(CARRERAS).forEach(cId => {
        const c = CARRERAS[cId];
        const fac = c.facultad || 'Otras Disciplinas';
        if (!facultiesMap[fac]) facultiesMap[fac] = [];
        facultiesMap[fac].push(cId);
        
        // 2. Tabs en la vista de plan (igual que antes)
        if (tabsContainer) {
            const btn = document.createElement('button');
            btn.className = "tab-btn hidden";
            btn.dataset.carrera = cId;
            btn.textContent = c.nombre;
            btn.addEventListener('click', () => cambiarCarrera(cId));
            tabsContainer.appendChild(btn);
        }
    });

    // 1. Checkboxes en el modal (agrupados)
    if (selectionList) {
        Object.keys(facultiesMap).forEach(facName => {
            // Contenedor de Facultad
            const facDiv = document.createElement('div');
            facDiv.className = "mb-6";
            
            // TÃ­tulo de Facultad
            const facTitle = document.createElement('h3');
            facTitle.className = "text-emerald-400 font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2";
            facTitle.innerHTML = `<i data-lucide="building" class="w-4 h-4"></i> ${facName}`;
            facDiv.appendChild(facTitle);
            
            // Grid de carreras de esta facultad
            const gridDiv = document.createElement('div');
            gridDiv.className = "space-y-3";
            
            facultiesMap[facName].forEach(cId => {
                const c = CARRERAS[cId];
                const color = colorPalettes[colorIndex % colorPalettes.length];
                colorIndex++;
                
                const lbl = document.createElement('label');
                lbl.className = `flex items-center gap-4 p-5 bg-zinc-900 border border-white/10 rounded-2xl cursor-pointer transition-all ${color.border} ${color.bg}`;
                lbl.innerHTML = `
                  <input type="checkbox" value="${cId}" class="carrera-check w-5 h-5 ${color.accent}">
                  <div class="text-left">
                    <div class="text-white font-bold">${c.nombre}</div>
                    <div class="text-gray-500 text-xs mt-0.5">${c.descripcion}</div>
                  </div>
                `;
                gridDiv.appendChild(lbl);
            });
            facDiv.appendChild(gridDiv);
            selectionList.appendChild(facDiv);
        });
        
        // Instanciar iconos si existe lucide (para el building icon)
        if (window.lucide) lucide.createIcons();
    }


    // Event listeners for tab-btn are now attached dynamically

    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => navigateTo(tab.dataset.tab));
    });

    // Removido navigateTo('login') forzado para evitar parpadeos (FOUC).
    // auth.js se encarga de llamar a navigateTo('login') o navigateTo('home') segÃºn el estado de la sesiÃ³n.

    document.querySelector(`[data-carrera="${carreraActual}"]`)?.classList.add('active');
    document.getElementById('nombre-carrera').textContent = getNombreCarrera(carreraActual);
    renderizarCarrera();
    
    // Mostrar mensaje de soporte amigable (una vez por usuario)
    setTimeout(mostrarMensajeSoporte, 2000);

    console.log('AplicaciÃ³n inicializada correctamente');
}

// ===================================
// DETECCIÃ“N DE ADBLOCKER (POR CAMBIO DE ESTADO)
// ===================================

const SUPPORT_MSG_KEY = 'ucr_support_msg_shown';

function mostrarMensajeSoporte() {
    // Solo mostrar este mensaje una vez por dispositivo/navegador
    if (!localStorage.getItem(SUPPORT_MSG_KEY)) {
        mostrarToastNotificacion(
            "ðŸ‘‹ Hola, la plataforma funciona perfectamente con o sin adblocker. Sin embargo, no usamos anuncios molestos y tu apoyo desactivÃ¡ndolo o no usÃ¡ndolo nos ayudarÃ­a muchÃ­simo a mantener este proyecto vivo. Â¡Gracias y disfrutÃ¡ la app!",
            "info"
        );
        localStorage.setItem(SUPPORT_MSG_KEY, 'true');
    }
}

function mostrarToastNotificacion(mensaje, tipo) {
    const container = document.getElementById('adblock-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const clasesBase = "p-4 rounded-2xl border shadow-2xl flex items-start gap-3 w-full max-w-[320px] sm:max-w-sm backdrop-blur-xl transition-all relative overflow-hidden";

    let iconoHtml = "";
    if (tipo === "warning") {
        toast.className = clasesBase + " bg-yellow-950/60 border-yellow-500/30 text-yellow-50";
        iconoHtml = `<div class="flex-shrink-0 p-2 bg-yellow-500/20 rounded-xl text-yellow-500 border border-yellow-500/20 mt-0.5"><i data-lucide="shield-alert" class="w-5 h-5"></i></div>`;
    } else if (tipo === "info") {
        toast.className = clasesBase + " bg-blue-950/60 border-blue-500/30 text-blue-50";
        iconoHtml = `<div class="flex-shrink-0 p-2 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-500/20 mt-0.5"><i data-lucide="info" class="w-5 h-5"></i></div>`;
    } else {
        toast.className = clasesBase + " bg-emerald-950/60 border-emerald-500/30 text-emerald-50";
        iconoHtml = `<div class="flex-shrink-0 p-2 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/20 mt-0.5"><i data-lucide="shield-check" class="w-5 h-5"></i></div>`;
    }

    // Entrada animada
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';

    toast.innerHTML = `
        ${iconoHtml}
        <div class="flex-1 min-w-0 pr-6">
            <p class="text-xs font-medium leading-relaxed">${mensaje}</p>
        </div>
        <button class="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors" onclick="this.parentElement.remove()">
            <i data-lucide="x" class="w-4 h-4"></i>
        </button>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    // Animar entrada
    requestAnimationFrame(() => {
        setTimeout(() => {
            toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 30);
    });

    // Auto-eliminar despuÃ©s de 12 segundos con animaciÃ³n de salida
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 400);
        }
    }, 12000);
}

window.showAdminToast = function(message, type = 'success') {
    if (typeof window.mostrarToastNotificacion === 'function') {
        window.mostrarToastNotificacion(message, type);
        return;
    }
    alert(message);
};


// Filtra las pestaÃ±as de carrera segÃºn lo que el usuario eligiÃ³ en su perfil
function filtrarCarrerasPorPerfil(selectedCarreras) {
    if (!selectedCarreras || selectedCarreras.length === 0) return;

    document.querySelectorAll('.tab-btn[data-carrera]').forEach(btn => {
        if (selectedCarreras.includes(btn.dataset.carrera)) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    });

    // Si la carrera activa no estÃ¡ en la selecciÃ³n, cambiar a la primera disponible
    if (!selectedCarreras.includes(carreraActual)) {
        cambiarCarrera(selectedCarreras[0]);
    }
}


// ===================================
// EXPORTACIÃ“N A IMAGEN Y PDF
// ===================================

/**
 * FunciÃ³n auxiliar para unificar la preparaciÃ³n del Ã¡rea de captura
 */
async function capturarAreaComoCanvas(area) {
    return await html2canvas(area, {
        scale: 2, // Alta resoluciÃ³n
        backgroundColor: '#000000', // Fondo negro sÃ³lido
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
 * Captura el Ã¡rea de planificaciÃ³n y la descarga como PNG
 */
async function descargarPlan() {
    const area = document.getElementById('export-area');
    if (!area) return;

    const btn = document.querySelector('.btn-success');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'âŒ› Generando...';
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
    
    // Preparar UI para envÃ­o
    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = 'Enviando...';
    btnSubmit.disabled = true;
    messageEl.disabled = true;
    
    try {
        if (!window.supaAuth?.supabase) {
            throw new Error("No hay conexiÃ³n con la base de datos.");
        }
        
        const { error } = await window.supaAuth.supabase
            .from('user_feedback')
            .insert([
                { user_id: userId, message: message }
            ]);
            
        if (error) throw error;
        
        // Ã‰xito
        successEl.classList.remove('hidden');
        messageEl.value = ''; // Limpiar textarea
        
        // Cerrar modal y limpiar
        setTimeout(() => {
            document.getElementById('feedback-modal').classList.add('hidden');
            successEl.classList.add('hidden'); // Resetear para la prÃ³xima vez
            // Si mandÃ³ una idea, recargar sus mensajes por si abre la pestaÃ±a
            loadUserMessages();
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

function switchFeedbackTab(tab) {
    const tabNew = document.getElementById('fb-tab-new');
    const tabMsgs = document.getElementById('fb-tab-messages');
    const contentNew = document.getElementById('fb-content-new');
    const contentMsgs = document.getElementById('fb-content-messages');
    
    if (tab === 'new') {
        tabNew.className = 'flex-1 py-2 text-sm font-bold bg-zinc-800 text-white rounded-lg transition-all';
        tabMsgs.className = 'flex-1 py-2 text-sm font-bold bg-transparent text-gray-400 hover:text-white rounded-lg transition-all relative';
        contentNew.classList.remove('hidden');
        contentMsgs.classList.add('hidden');
        contentMsgs.classList.remove('flex');
    } else {
        tabMsgs.className = 'flex-1 py-2 text-sm font-bold bg-zinc-800 text-white rounded-lg transition-all relative';
        tabNew.className = 'flex-1 py-2 text-sm font-bold bg-transparent text-gray-400 hover:text-white rounded-lg transition-all';
        contentNew.classList.add('hidden');
        contentMsgs.classList.remove('hidden');
        contentMsgs.classList.add('flex');
        
        loadUserMessages();
    }
}

async function loadUserMessages() {
    const listEl = document.getElementById('user-messages-list');
    const session = window.supaAuth?.getCurrentSession();
    if (!session || !window.supaAuth?.supabase) {
        listEl.innerHTML = '<p class="text-gray-500 text-sm text-center py-8">Inicia sesiÃ³n para ver tus mensajes.</p>';
        return;
    }

    try {
        listEl.innerHTML = '<p class="text-gray-500 text-sm text-center py-8 animate-pulse">Cargando...</p>';
        
        const { data: feedbacks, error } = await window.supaAuth.supabase
            .from('user_feedback')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        if (!feedbacks || feedbacks.length === 0) {
            listEl.innerHTML = '<p class="text-gray-500 text-sm text-center py-8">No has enviado ninguna idea aÃºn.</p>';
            return;
        }

        // Marcar mensajes como leÃ­dos si tienen notificaciÃ³n
        const unreadIds = feedbacks.filter(f => f.has_unread_reply).map(f => f.id);
        if (unreadIds.length > 0) {
            await window.supaAuth.supabase.from('user_feedback').update({ has_unread_reply: false }).in('id', unreadIds);
            document.getElementById('fb-unread-badge')?.classList.add('hidden');
        }
        
        listEl.innerHTML = '';
        feedbacks.forEach(f => {
            const hasReplies = f.conversation && f.conversation.length > 0;
            const statusColor = f.status === 'reviewed' ? 'text-blue-400' : (f.status === 'implemented' ? 'text-green-400' : 'text-yellow-400');
            const statusText = f.status === 'reviewed' ? 'Revisado' : (f.status === 'implemented' ? 'Implementado' : 'Pendiente');
            
            const item = document.createElement('div');
            item.className = 'bg-black/40 border border-white/5 p-4 rounded-xl cursor-pointer hover:border-white/20 transition-all';
            item.onclick = () => openUserFeedbackChat(f);
            
            item.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-bold ${statusColor}">${statusText}</span>
                    <span class="text-[10px] text-gray-500">${new Date(f.created_at).toLocaleDateString()}</span>
                </div>
                <p class="text-sm text-white line-clamp-2">${f.message}</p>
                ${hasReplies ? `<div class="mt-3 flex items-center gap-2 text-xs text-emerald-400"><i data-lucide="message-circle" class="w-3 h-3"></i> Tienes ${f.conversation.length} respuesta(s)</div>` : ''}
            `;
            listEl.appendChild(item);
        });
        if (window.lucide) lucide.createIcons();
    } catch (err) {
        console.error("Error loading user messages:", err);
        listEl.innerHTML = '<p class="text-red-500 text-sm text-center py-8">Error cargando mensajes.</p>';
    }
}

function openUserFeedbackChat(feedback) {
    const listEl = document.getElementById('user-messages-list');
    
    let chatHtml = `
        <div class="flex items-center gap-2 mb-4">
            <button onclick="switchFeedbackTab('messages')" class="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
            </button>
            <h4 class="font-bold text-sm text-white">ConversaciÃ³n</h4>
        </div>
        <div class="flex-1 overflow-y-auto space-y-3 mb-4 pr-2" id="user-chat-messages">
            <div class="bg-white/5 p-3 rounded-tr-xl rounded-b-xl max-w-[85%] self-start">
                <p class="text-xs text-gray-400 font-bold mb-1">TÃº</p>
                <p class="text-sm text-white">${feedback.message}</p>
            </div>
    `;
    
    if (feedback.conversation && feedback.conversation.length > 0) {
        feedback.conversation.forEach(msg => {
            const isMe = msg.sender === 'user';
            chatHtml += `
                <div class="${isMe ? 'bg-emerald-500/20 ml-auto rounded-tl-xl' : 'bg-blue-500/20 mr-auto rounded-tr-xl'} p-3 rounded-b-xl max-w-[85%]">
                    <p class="text-xs ${isMe ? 'text-emerald-400 text-right' : 'text-blue-400'} font-bold mb-1">${isMe ? 'TÃº' : 'Admin'}</p>
                    <p class="text-sm text-white">${msg.msg}</p>
                </div>
            `;
        });
    }
    
    chatHtml += `
        </div>
        <div class="flex gap-2">
            <input type="text" id="user-chat-input-${feedback.id}" class="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500/50 outline-none" placeholder="Escribe una respuesta...">
            <button onclick="sendUserChatReply('${feedback.id}')" class="bg-emerald-500 hover:bg-emerald-600 text-black p-2 rounded-xl transition-colors">
                <i data-lucide="send" class="w-4 h-4"></i>
            </button>
        </div>
    `;
    
    listEl.innerHTML = chatHtml;
    if (window.lucide) lucide.createIcons();
    
    // Auto-scroll
    const chatContainer = document.getElementById('user-chat-messages');
    if(chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendUserChatReply(feedbackId) {
    const input = document.getElementById(`user-chat-input-${feedbackId}`);
    if (!input) return;
    const msg = input.value.trim();
    if (!msg) return;

    try {
        const { data: fb, error: errFb } = await window.supaAuth.supabase
            .from('user_feedback')
            .select('conversation, message')
            .eq('id', feedbackId)
            .single();

        if (errFb) throw errFb;

        let conv = fb.conversation || [];
        conv.push({ sender: 'user', msg: msg, date: new Date().toISOString() });

        const { error } = await window.supaAuth.supabase
            .from('user_feedback')
            .update({ conversation: conv })
            .eq('id', feedbackId);

        if (error) throw error;

        input.value = '';
        // Recargar mensajes para ver la conversaciÃ³n actualizada
        loadUserMessages();
    } catch (err) {
        console.error("Error sending reply", err);
        alert('Error al enviar mensaje');
    }
}

// ===================================
// PANEL DE ADMIN â€” TABS Y ESTADO
// ===================================
let _adminFeedbackAll = [];
let _adminCurrentTab = 'pending';

function esAdmin() {
    const perfil = window.supaAuth?.getCurrentProfile?.();
    return perfil && perfil.is_admin === true;
}

function initAdminBtn() {
    if (esAdmin()) {
        const adminBtn = document.getElementById('btn-admin-panel');
        if (adminBtn) adminBtn.classList.remove('hidden');
    }
}

async function loadNoticias() {
    if (!window.supaAuth?.supabase) return;
    
    try {
        const { data, error } = await window.supaAuth.supabase
            .from('noticias')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) {
            // Ignorar el error si la tabla aÃºn no existe (42P01)
            if(error.code !== '42P01') console.error('Error cargando noticias:', error);
            return;
        }

        const homeList = document.getElementById('home-noticias-list');
        const fullList = document.getElementById('noticias-full-list');

        if (!data || data.length === 0) {
            if (homeList) homeList.innerHTML = '<div class="text-center text-gray-600 text-sm py-4 col-span-2">No hay noticias recientes.</div>';
            if (fullList) fullList.innerHTML = '<div class="text-center text-gray-500 py-16">No hay noticias publicadas.</div>';
            return;
        }

        const getCatBadge = (cat) => {
            const map = {
                general: { icon: 'ðŸ“¢', color: 'purple' },
                matricula: { icon: 'ðŸ“…', color: 'blue' },
                actualizacion: { icon: 'ðŸ”„', color: 'emerald' },
                aviso: { icon: 'âš ï¸', color: 'red' },
                nuevo: { icon: 'ðŸ†•', color: 'yellow' }
            };
            const m = map[cat || 'general'];
            return `<span class="text-[10px] uppercase font-black tracking-wider text-${m.color}-400 bg-${m.color}-500/10 px-2 py-1 rounded-md border border-${m.color}-500/20">${m.icon} ${cat || 'general'}</span>`;
        };

        // Render Home (max 2)
                if (homeList) {
            homeList.innerHTML = data.slice(0, 2).map(n => `
                <div class="bg-zinc-900 border border-white/5 p-4 rounded-2xl hover:border-purple-500/30 transition-colors cursor-pointer" onclick="openNoticiasModal()">
                    <div class="flex items-center gap-2 mb-2">
                        ${getCatBadge(n.categoria)}
                        <span class="text-xs text-gray-500">${new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                    <h4 class="text-white font-bold text-sm mb-1 line-clamp-1">${n.titulo}</h4>
                    <p class="text-gray-400 text-xs line-clamp-2">${n.contenido}</p>
                </div>
            `).join('');
        }

        // Render Full List
        if (fullList) {
            fullList.innerHTML = data.map(n => `
                <div class="bg-zinc-900 border border-white/10 p-6 rounded-3xl">
                    <div class="flex items-center gap-3 mb-4">
                        ${getCatBadge(n.categoria)}
                        <span class="text-sm text-gray-500">${new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">${n.titulo}</h3>
                    <p class="text-gray-400 text-sm whitespace-pre-wrap leading-relaxed">${n.contenido}</p>
                    ${n.imagen_url ? `<img src="${n.imagen_url}" alt="${n.titulo}" class="mt-4 rounded-xl border border-white/10 max-h-64 object-cover w-full">` : ''}
                    ${n.enlace_url ? `<a href="${n.enlace_url}" target="_blank" class="inline-flex items-center gap-2 mt-4 text-purple-400 hover:text-purple-300 text-sm font-bold transition-colors">Leer mÃ¡s <i data-lucide="external-link" class="w-4 h-4"></i></a>` : ''}
                </div>
            `).join('');
            lucide.createIcons();
            // Also populate the noticias modal if present
            const modalList = document.getElementById('noticias-modal-list');
            if (modalList) modalList.innerHTML = fullList.innerHTML;
        }
    } catch (e) {
        console.error('ExcepciÃ³n al cargar noticias:', e);
    }
}

async function loadAdminFeedbackData() {
    const session = window.supaAuth?.getCurrentSession();
    if (!session || !esAdmin() || !window.supaAuth?.supabase) return;

    // modal is already open via admin.js
    const listEl = document.getElementById('admin-feedback-list');
    listEl.innerHTML = '<div class="flex items-center justify-center py-12"><p class="text-gray-400 text-sm animate-pulse">Cargando feedback...</p></div>';

    try {
        const supabase = window.supaAuth.supabase;

        // 1. Obtener todos los feedbacks
        const { data: feedbacks, error: fbError } = await supabase
            .from('user_feedback')
            .select('id, user_id, message, status, created_at, archived_at, conversation, has_unread_reply')
            .order('created_at', { ascending: false });

        if (fbError) throw fbError;

        // 2. Obtener perfiles de los usuarios Ãºnicos para mostrar nombres reales
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
    const archivedCount = _adminFeedbackAll.filter(f => f.status === 'archived').length;
    const reviewedCount = _adminFeedbackAll.filter(f => f.status !== 'pending' && f.status !== 'archived').length;

    document.getElementById('admin-pending-count').textContent = pendingCount;
    document.getElementById('admin-reviewed-count').textContent = reviewedCount;
    const archivedEl = document.getElementById('admin-archived-count');
    if (archivedEl) archivedEl.textContent = archivedCount;
    document.getElementById('admin-feedback-count').textContent =
        `${_adminFeedbackAll.length} mensajes en total · ${pendingCount} sin revisar`;
}

function switchAdminTab(tab) {
    _adminCurrentTab = tab;

    const pendingBtn = document.getElementById('admin-tab-pending');
    const reviewedBtn = document.getElementById('admin-tab-reviewed');
    const archivedBtn = document.getElementById('admin-tab-archived');

    // Reset classes
    [pendingBtn, reviewedBtn, archivedBtn].forEach(b => { if(b) b.className = 'flex-1 py-2.5 text-sm font-bold text-gray-500 hover:text-white rounded-xl transition-all flex items-center justify-center gap-2'; });

    if (tab === 'pending') {
        if(pendingBtn) pendingBtn.className = 'flex-1 py-2.5 text-sm font-bold text-white bg-yellow-500/20 rounded-xl border border-yellow-500/30 transition-all flex items-center justify-center gap-2';
    } else if (tab === 'reviewed') {
        if(reviewedBtn) reviewedBtn.className = 'flex-1 py-2.5 text-sm font-bold text-white bg-green-500/20 rounded-xl border border-green-500/30 transition-all flex items-center justify-center gap-2';
    } else if (tab === 'archived') {
        if(archivedBtn) archivedBtn.className = 'flex-1 py-2.5 text-sm font-bold text-white bg-gray-700/20 rounded-xl border border-gray-500/20 transition-all flex items-center justify-center gap-2';
    }

    renderAdminFeedback(tab);
}

function renderAdminFeedback(tab) {
    const listEl = document.getElementById('admin-feedback-list');
    if (!listEl) return;

    const filtered = _adminFeedbackAll.filter(f => {
        if (tab === 'pending') return f.status === 'pending';
        if (tab === 'reviewed') return f.status !== 'pending' && f.status !== 'archived';
        if (tab === 'archived') return f.status === 'archived';
        return true;
    });

    if (filtered.length === 0) {
        const toolbar = document.getElementById('admin-feedback-toolbar');
        if (toolbar) toolbar.classList.add('hidden');
        listEl.innerHTML = `
            <div class="flex flex-col items-center justify-center py-16 text-center">
                <div class="text-5xl mb-4">${tab === 'pending' ? '🎉' : '📭'}</div>
                <p class="text-white font-bold mb-1">${tab === 'pending' ? '¡Sin feedback pendiente!' : 'Sin mensajes revisados'}</p>
                <p class="text-gray-500 text-sm">${tab === 'pending' ? 'Todo al día, no hay nada nuevo por revisar.' : 'Cuando marques mensajes como vistos aparecerán aquí.'}</p>
            </div>
        `;
        return;
    }

    // Show toolbar when there are items
    const toolbar = document.getElementById('admin-feedback-toolbar');
    if (toolbar) toolbar.classList.remove('hidden');

    listEl.innerHTML = filtered.map(f => {
        const nombre = f.profile?.full_name || 'Usuario Anónimo';
        const inicial = nombre.charAt(0).toUpperCase();
        const carnet = f.profile?.student_id ? ` · Carné: ${f.profile.student_id}` : '';
        const fecha = new Date(f.created_at).toLocaleString('es-CR', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        const isPending = f.status === 'pending';

        let statusBadge = '';
        let borderColor = 'white/5';
        if (f.status === 'pending') {
            statusBadge = 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25';
            borderColor = 'yellow-500/15';
        } else if (f.status === 'important') {
            statusBadge = 'bg-red-500/15 text-red-400 border-red-500/25';
            borderColor = 'red-500/15';
        } else if (f.status === 'implemented') {
            statusBadge = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25';
            borderColor = 'emerald-500/15';
        } else if (f.status === 'archived') {
            statusBadge = 'bg-black/15 text-gray-400 border-gray-500/20';
            borderColor = 'gray-500/20';
        } else {
            statusBadge = 'bg-blue-500/15 text-blue-400 border-blue-500/25';
            borderColor = 'blue-500/15';
        }

        const statusLabels = { pending: '⏳ Pendiente', important: '⭐ Importante', implemented: '🚀 Resuelto', reviewed: '✅ Visto' };
        const labelStr = statusLabels[f.status] || 'Visto';

        // Mostrar fecha de archivado si existe
        const archivedInfo = f.archived_at ? `<div class="text-[11px] text-gray-400 mt-2">Archivado: ${new Date(f.archived_at).toLocaleString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })}</div>` : '';

        return `
            <div class="bg-black/40 border border-${borderColor} rounded-2xl p-5 transition-all" id="feedback-card-${f.id}">
                <div class="flex items-center justify-between gap-3 mb-4">
                    <div class="flex items-center gap-3">
                            <label class="inline-flex items-center mr-2">
                                <input type="checkbox" class="admin-feedback-checkbox" data-id="${f.id}" onchange="setAdminBulkState()">
                            </label>
                        <div class="w-10 h-10 bg-zinc-700 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0 border border-white/10">
                            ${inicial}
                        </div>
                        <div>
                            <div class="text-sm font-bold text-white">${nombre}</div>
                            <div class="text-xs text-gray-500">${fecha}${carnet}</div>
                        </div>
                    </div>
                    <span class="text-[10px] px-2.5 py-1 rounded-full font-bold flex-shrink-0 border ${statusBadge}">
                        ${labelStr}
                    </span>
                </div>

                <div class="bg-black/30 rounded-xl p-4 mb-4 border border-white/5">
                    <p class="text-sm text-gray-200 leading-relaxed">${f.message}</p>
                </div>

                <div id="admin-chat-area-${f.id}" class="hidden mt-4 pt-4 border-t border-white/5 animate-fade-in">
                    <div class="space-y-3 mb-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar" id="admin-chat-msgs-${f.id}"></div>
                    <div class="flex gap-2">
                        <input type="text" id="admin-chat-input-${f.id}"
                            class="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-blue-500/50 outline-none"
                            placeholder="Escribe tu respuesta..."
                            onkeydown="if(event.key==='Enter') sendAdminChatReply('${f.id}')">
                        <button onclick="sendAdminChatReply('${f.id}')"
                            class="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-colors">
                            <i data-lucide="send" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                <div class="flex gap-2 justify-end flex-wrap mt-4">
                    <button onclick="openAdminFeedbackChat('${f.id}')" title="Contestar"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 rounded-lg border border-blue-500/25 transition-all">
                        <i data-lucide="message-square" class="w-3 h-3"></i> Contestar
                    </button>
                    ${f.status !== 'implemented' ? `
                    <button onclick="markFeedbackStatus('${f.id}', 'implemented')" title="Marcar como Resuelto"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-lg border border-emerald-500/25 transition-all">
                        <i data-lucide="check-circle" class="w-3 h-3"></i> Resuelto
                    </button>` : ''}
                    ${f.status !== 'important' ? `
                    <button onclick="markFeedbackStatus('${f.id}', 'important')" title="Marcar como Importante"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-red-500/15 hover:bg-red-500/25 text-red-400 rounded-lg border border-red-500/25 transition-all">
                        <i data-lucide="star" class="w-3 h-3"></i> Importante
                    </button>` : ''}
                    ${f.status === 'pending' ? `
                    <button onclick="markFeedbackStatus('${f.id}', 'reviewed')" title="Marcar como Visto"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 rounded-lg border border-purple-500/25 transition-all">
                        <i data-lucide="eye" class="w-3 h-3"></i> Visto
                    </button>` : ''}
                    ${f.status !== 'archived' ? `
                    <button onclick="confirmArchive('${f.id}')" title="Archivar"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-700/15 hover:bg-gray-700/25 text-gray-300 rounded-lg border border-gray-500/25 transition-all">
                        <i data-lucide="archive" class="w-3 h-3"></i> Archivar
                    </button>` : `
                    <button onclick="confirmRestore('${f.id}')" title="Restaurar"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 rounded-lg border border-blue-500/25 transition-all">
                        <i data-lucide="refresh-cw" class="w-3 h-3"></i> Restaurar
                    </button>`}
                    ${!isPending ? `
                    <button onclick="confirmDelete('${f.id}')" title="Eliminar"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-500/15 hover:bg-gray-500/25 text-gray-400 rounded-lg border border-gray-500/25 transition-all">
                        <i data-lucide="trash-2" class="w-3 h-3"></i> Eliminar
                    </button>` : ''}
                </div>
                ${archivedInfo}
            </div>
        `;
    }).join('');

    if (window.lucide) lucide.createIcons();
}

function openAdminFeedbackChat(feedbackId, forceOpen = false) {
    const chatArea = document.getElementById(`admin-chat-area-${feedbackId}`);
    if (!chatArea) return;

    // Toggle visibilidad (solo si no se fuerza la apertura)
    if (!forceOpen && !chatArea.classList.contains('hidden')) {
        chatArea.classList.add('hidden');
        return;
    }

    // Mostrar y cargar mensajes
    chatArea.classList.remove('hidden');
    const msgsEl = document.getElementById(`admin-chat-msgs-${feedbackId}`);
    const f = _adminFeedbackAll.find(x => x.id === feedbackId);
    if (!f || !msgsEl) return;

    let chatHtml = `
        <div class="bg-emerald-500/10 p-3 rounded-tr-xl rounded-b-xl border border-emerald-500/10 mb-2">
            <p class="text-[9px] text-emerald-400 font-black uppercase tracking-widest mb-1">Usuario (Original)</p>
            <p class="text-xs text-white">${f.message}</p>
        </div>
    `;

    if (f.conversation && f.conversation.length > 0) {
        f.conversation.forEach(msg => {
            const isMe = msg.sender === 'admin';
            chatHtml += `
                <div class="${isMe ? 'bg-blue-500/10 ml-auto rounded-tl-xl border border-blue-500/10' : 'bg-emerald-500/10 mr-auto rounded-tr-xl border border-emerald-500/10'} p-3 rounded-b-xl max-w-[90%] mb-2">
                    <p class="text-[9px] ${isMe ? 'text-blue-400 text-right' : 'text-emerald-400'} font-black uppercase tracking-widest mb-1">${isMe ? 'TÃº (Admin)' : 'Usuario'}</p>
                    <p class="text-xs text-white">${msg.msg}</p>
                </div>
            `;
        });
    }

    msgsEl.innerHTML = chatHtml;
    msgsEl.scrollTop = msgsEl.scrollHeight;
    if (window.lucide) lucide.createIcons();
}

async function sendAdminChatReply(feedbackId) {
    const input = document.getElementById(`admin-chat-input-${feedbackId}`);
    if (!input) return;
    const msg = input.value.trim();
    if (!msg) return;
    
    try {
        const f = _adminFeedbackAll.find(x => x.id === feedbackId);
        if (!f) return;
        
        let conv = f.conversation || [];
        conv.push({ sender: 'admin', msg: msg, date: new Date().toISOString() });
        
        const { error } = await window.supaAuth.supabase
            .from('user_feedback')
            .update({ 
                conversation: conv,
                has_unread_reply: true,
                status: f.status === 'pending' ? 'reviewed' : f.status
            })
            .eq('id', feedbackId);
            
        if (error) throw error;
        
        f.conversation = conv;
        if(f.status === 'pending') f.status = 'reviewed';
        
        input.value = ''; // Limpiar input
        _actualizarContadoresAdmin();
        openAdminFeedbackChat(feedbackId, true); // Forzar actualizaciÃ³n sin cerrar
    } catch (err) {
        console.error("Error sending reply from admin", err);
        alert('Error al enviar mensaje');
    }
}

async function markFeedbackStatus(feedbackId, newStatus) {
    const session = window.supaAuth?.getCurrentSession();
    if (!session || !esAdmin() || !window.supaAuth?.supabase) return;

    // Feedback visual inmediato
    const card = document.getElementById(`feedback-card-${feedbackId}`);
    if (card) {
        const btns = card.querySelectorAll('button');
        btns.forEach(b => { if(b.title?.startsWith('Marcar')) { b.disabled = true; b.innerHTML = '...'; } });
    }

    try {
        const payload = { status: newStatus };
        if (newStatus === 'archived') payload.archived_at = new Date().toISOString();
        else payload.archived_at = null;

        const { error } = await window.supaAuth.supabase
            .from('user_feedback')
            .update(payload)
            .eq('id', feedbackId);

        if (error) throw error;

        // Actualizar el dato local sin recargar todo
        const item = _adminFeedbackAll.find(f => f.id === feedbackId);
        if (item) item.status = newStatus;

        // Refrescar contadores y lista
        _actualizarContadoresAdmin();
        renderAdminFeedback(_adminCurrentTab);
        if (window.lucide) lucide.createIcons();

    } catch (err) {
        console.error("Error marking status:", err);
        alert("Error al actualizar: " + err.message);
        renderAdminFeedback(_adminCurrentTab);
    }
}

async function deleteFeedback(feedbackId) {
    const session = window.supaAuth?.getCurrentSession();
    if (!session || !esAdmin() || !window.supaAuth?.supabase) return;

    // Deletion is confirmed via confirm modal wrapper

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
        // Restaurar si fallÃ³
        renderAdminFeedback(_adminCurrentTab);
    }
}

// -------------------------
// Confirm modal helper
// -------------------------
let __confirmCallback = null;
function showConfirm(message, callback) {
    const modal = document.getElementById('confirm-modal');
    const msgEl = document.getElementById('confirm-modal-msg');
    const confirmBtn = document.getElementById('confirm-confirm-btn');
    if (!modal || !msgEl || !confirmBtn) {
        if (callback) callback(true);
        return;
    }
    msgEl.textContent = message;
    __confirmCallback = callback;
    modal.classList.remove('hidden');
    // remove previous listeners
    const newConfirm = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
    newConfirm.addEventListener('click', () => {
        modal.classList.add('hidden');
        if (typeof __confirmCallback === 'function') __confirmCallback(true);
        __confirmCallback = null;
    });
}

function confirmArchive(feedbackId) {
    showConfirm('¿Archivar este mensaje? Podrás restaurarlo luego.', () => markFeedbackStatus(feedbackId, 'archived'));
}

function confirmRestore(feedbackId) {
    showConfirm('¿Restaurar este mensaje de archivados?', () => markFeedbackStatus(feedbackId, 'reviewed'));
}

function confirmDelete(feedbackId) {
    showConfirm('¿Eliminar permanentemente este feedback? Esta acción no se puede deshacer.', () => deleteFeedback(feedbackId));
}

// -------------------------
// Bulk actions helpers
// -------------------------
function toggleAdminSelectAll(chk) {
    const boxes = Array.from(document.querySelectorAll('.admin-feedback-checkbox'));
    boxes.forEach(b => { b.checked = chk.checked; });
    setAdminBulkState();
}

function setAdminBulkState() {
    const any = document.querySelectorAll('.admin-feedback-checkbox:checked').length > 0;
    const toolbar = document.getElementById('admin-feedback-toolbar');
    if (toolbar) {
        // keep toolbar visible; optionally could hide when none selected
    }
    const selectAll = document.getElementById('admin-feedback-select-all');
    if (selectAll) {
        const boxes = document.querySelectorAll('.admin-feedback-checkbox');
        selectAll.checked = boxes.length > 0 && Array.from(boxes).every(b => b.checked);
    }
}

function getSelectedFeedbackIds() {
    return Array.from(document.querySelectorAll('.admin-feedback-checkbox:checked')).map(c => c.getAttribute('data-id'));
}

async function bulkUpdateStatus(newStatus) {
    const ids = getSelectedFeedbackIds();
    if (!ids || ids.length === 0) return alert('No hay items seleccionados');
    if (!confirm(`Aplicar '${newStatus}' a ${ids.length} items?`)) return;

    try {
        const payload = { status: newStatus };
        if (newStatus === 'archived') payload.archived_at = new Date().toISOString();
        else payload.archived_at = null;

        const { error } = await window.supaAuth.supabase
            .from('user_feedback')
            .update(payload)
            .in('id', ids);

        if (error) throw error;

        // update local cache
        _adminFeedbackAll.forEach(f => { if (ids.includes(f.id)) { f.status = newStatus; f.archived_at = payload.archived_at; } });
        _actualizarContadoresAdmin();
        renderAdminFeedback(_adminCurrentTab);
        document.getElementById('admin-feedback-select-all').checked = false;
    } catch (err) {
        console.error('Error bulk updating:', err);
        alert('Error al aplicar cambio en lote: ' + err.message);
    }
}

function bulkDeleteConfirm() {
    const ids = getSelectedFeedbackIds();
    if (!ids || ids.length === 0) return alert('No hay items seleccionados');
    showConfirm(`¿Eliminar permanentemente ${ids.length} mensajes? Esta acción no se puede deshacer.`, () => bulkDelete(ids));
}

async function bulkDelete(ids) {
    try {
        const { error } = await window.supaAuth.supabase
            .from('user_feedback')
            .delete()
            .in('id', ids);
        if (error) throw error;

        _adminFeedbackAll = _adminFeedbackAll.filter(f => !ids.includes(f.id));
        _actualizarContadoresAdmin();
        renderAdminFeedback(_adminCurrentTab);
        document.getElementById('admin-feedback-select-all').checked = false;
    } catch (err) {
        console.error('Error bulk delete:', err);
        alert('Error al eliminar en lote: ' + err.message);
    }
}

// ===================================
// GESTOS MÃ“VILES (SWIPE TO GO BACK)
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

    // Si el swipe empezÃ³ muy cerca del borde izquierdo (ej: < 40px)
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

// Establecer estado inicial en el historial para evitar que el primer "AtrÃ¡s" cierre la app
if (!history.state || !history.state.page) {
    const currentPage = document.documentElement.getAttribute('data-initial-page') || 'home';
    try {
        history.replaceState({ page: currentPage }, '', '#' + currentPage);
    } catch(e) {
        console.warn("history.replaceState fallÃ³", e);
    }
}

// Manejar el botÃ³n "AtrÃ¡s" del navegador/mÃ³vil
window.addEventListener('popstate', (e) => {
    // Si hay un modal abierto, lo cerramos en lugar de navegar
    const modales = document.querySelectorAll('.modal-overlay:not(.hidden)');
    if (modales.length > 0) {
        modales.forEach(m => m.classList.add('hidden'));
        // Evitamos que retroceda la pÃ¡gina visualmente
        history.pushState({ page: e.state ? e.state.page : 'home' }, '', window.location.hash);
        return;
    }

    if (e.state && e.state.page) {
        window.navigateTo(e.state.page, false);
    } else {
        // En lugar de salir, nos quedamos
        history.pushState({ page: 'home' }, '', '#home');
        window.navigateTo('home', false);
    }
});

/**
 * Busca todos los cursos compartidos y replica el estado mÃ¡s avanzado en todas las carreras.
 */
function sincronizarCompartidosGlobal() {
    let compartidosRevisados = new Set();
    
    // Primero, encontrar el estado mÃ¡s alto para cada cÃ³digo de curso (ej: EG-1)
    let mejorEstadoPorCodigo = {};
    
    Object.keys(CARRERAS).forEach(cId => {
        const cursos = CARRERAS[cId].cursos;
        if (!cursos) return;
        cursos.forEach(curso => {
            const currentHighest = mejorEstadoPorCodigo[curso.codigo] || 0;
            if (curso.estado > currentHighest) {
                mejorEstadoPorCodigo[curso.codigo] = curso.estado;
            }
        });
    });

    // Luego, aplicar ese estado mÃ¡s alto a todos los hermanos
    Object.keys(CARRERAS).forEach(cId => {
        const cursos = CARRERAS[cId].cursos;
        if (!cursos) return;
        cursos.forEach(curso => {
            const maxEstado = mejorEstadoPorCodigo[curso.codigo];
            if (maxEstado && curso.estado < maxEstado) {
                curso.estado = maxEstado;
            }
        });
    });
}

// ===================================
// LÃ“GICA DE SNAPSHOTS DEL PLAN
// ===================================

// guardarSnapshotPlan â€” definida mas abajo con soporte completo


async function abrirModalHistorialPlanes() {
    const session = window.supaAuth?.getCurrentSession();
    if (!session) {
        alert("Debes iniciar sesiÃ³n para ver tus respaldos guardados.");
        return;
    }
    document.getElementById('plan-history-modal').classList.remove('hidden');
    cargarHistorialPlanes();
}

async function cargarHistorialPlanes() {
    const lista = document.getElementById('plan-history-list');
    lista.innerHTML = '<div class="flex items-center justify-center h-full"><i data-lucide="loader-2" class="w-8 h-8 text-gray-500 animate-spin"></i></div>';
    if (window.lucide) lucide.createIcons();

    const session = window.supaAuth?.getCurrentSession();
    if (!session) return;

    try {
        const { data, error } = await window.supaAuth.supabase
            .from('user_plan_snapshots')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            lista.innerHTML = '<div class="text-center p-4 text-sm text-gray-500 bg-black/30 border border-white/5 rounded-2xl">No tienes respaldos guardados.</div>';
            return;
        }

        let html = '';
        data.forEach(snap => {
            const dateStr = new Date(snap.created_at).toLocaleDateString('es-CR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
            
            // Contar cuÃ¡ntos cursos guardados hay en total
            let totalCursos = 0;
            if (snap.datos_json) {
                Object.keys(snap.datos_json).forEach(cId => {
                    totalCursos += snap.datos_json[cId].length;
                });
            }

            html += `
                <div class="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-yellow-500/30 transition-colors">
                    <div>
                        <div class="font-bold text-white text-sm">${snap.nombre}</div>
                        <div class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">${dateStr} â€¢ ${totalCursos} cursos registrados</div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="abrirSnapshotPlan('${snap.id}')" title="Cargar y sobreescribir plan actual" class="bg-blue-500/10 hover:bg-blue-500/30 text-blue-500 p-2 rounded-lg transition-colors border border-blue-500/20">
                            <i data-lucide="download-cloud" class="w-4 h-4"></i>
                        </button>
                        <button onclick="eliminarSnapshotPlan('${snap.id}')" title="Eliminar respaldo" class="bg-red-500/10 hover:bg-red-500/30 text-red-500 p-2 rounded-lg transition-colors border border-red-500/20">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        lista.innerHTML = html;
        if (window.lucide) lucide.createIcons();

    } catch (err) {
        console.error("Error al cargar historial de planes:", err);
        lista.innerHTML = '<div class="text-center text-red-500 text-sm py-4">Error al cargar historial.</div>';
    }
}

async function abrirSnapshotPlan(snapshotId) {
    if (!confirm("Â¿EstÃ¡s seguro de querer cargar este respaldo? ReemplazarÃ¡ tu progreso actual con los datos guardados.")) return;

    try {
        const { data, error } = await window.supaAuth.supabase
            .from('user_plan_snapshots')
            .select('datos_json')
            .eq('id', snapshotId)
            .single();

        if (error) throw error;
        if (!data || !data.datos_json) throw new Error("No hay datos en el snapshot.");

        // 1. Resetear todos los estados a 0 (Limpiar el canvas)
        Object.keys(CARRERAS).forEach(carreraId => {
            CARRERAS[carreraId].cursos.forEach(curso => { curso.estado = 0; });
        });

        // 2. Aplicar los estados guardados
        const savedData = data.datos_json;
        Object.keys(savedData).forEach(cId => {
            if (CARRERAS[cId]) {
                const arr = savedData[cId];
                arr.forEach(savedCurso => {
                    const idx = CARRERAS[cId].cursos.findIndex(c => c.codigo === savedCurso.codigo);
                    if (idx !== -1) {
                        CARRERAS[cId].cursos[idx].estado = savedCurso.estado;
                    }
                });
            }
        });

        // 3. Sincronizar compartidos globalmente (Asegura consistencia cruzada)
        if (typeof sincronizarCompartidosGlobal === 'function') {
            sincronizarCompartidosGlobal();
        }

        // 4. Guardar como estado principal oficial
        guardarEstado();

        // 5. Renderizar interfaz y cerrar modal
        renderizarCarrera();
        document.getElementById('plan-history-modal').classList.add('hidden');
        alert("Â¡Progreso cargado y sincronizado exitosamente!");

    } catch (err) {
        console.error("Error al abrir snapshot:", err);
        alert("Hubo un problema cargando el respaldo.");
    }
}

async function eliminarSnapshotPlan(snapshotId) {
    if (!confirm("Â¿EstÃ¡s seguro de eliminar este respaldo permanentemente?")) return;

    try {
        const { error } = await window.supaAuth.supabase
            .from('user_plan_snapshots')
            .delete()
            .eq('id', snapshotId);

        if (error) throw error;
        cargarHistorialPlanes(); // Recargar la lista
    } catch (err) {
        console.error("Error al eliminar snapshot:", err);
        alert("Error al eliminar el respaldo.");
    }
}

// ===================================
// LÃ“GICA DE SNAPSHOTS DEL PLAN
// ===================================

function abrirModalGuardarPlan() {
    const modal = document.getElementById('plan-save-modal');
    const contextContainer = document.getElementById('plan-save-context');
    const actionsContainer = document.getElementById('plan-save-actions');
    const nameInput = document.getElementById('plan-save-name');
    
    // Si hay un plan previamente cargado, mostramos UI de "ActualizaciÃ³n"
    if (window.currentLoadedSnapshotId) {
        contextContainer.innerHTML = `<p class="text-xs text-yellow-500 font-bold mb-1">Â¡EstÃ¡s editando un plan existente!</p><p class="text-xs text-gray-400">Puedes sobreescribir este plan con los nuevos cambios, o guardarlo como una copia nueva.</p>`;
        
        actionsContainer.innerHTML = `
            <button onclick="guardarSnapshotPlan(false)" class="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <i data-lucide="refresh-cw" class="w-4 h-4"></i> Actualizar Plan Actual
            </button>
            <button onclick="guardarSnapshotPlan(true)" class="w-full bg-transparent border border-white/20 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <i data-lucide="copy" class="w-4 h-4"></i> Guardar como Copia Nueva
            </button>
        `;
    } else {
        contextContainer.innerHTML = `<p class="text-xs text-gray-400">GuardÃ¡ una versiÃ³n de tu avance actual en la nube. Ãštil por si cometÃ©s un error luego.</p>`;
        
        actionsContainer.innerHTML = `
            <button onclick="guardarSnapshotPlan(false)" class="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <i data-lucide="cloud-upload" class="w-4 h-4"></i> Guardar en Supabase
            </button>
        `;
    }
    
    if (window.lucide) lucide.createIcons();
    modal.classList.remove('hidden');
}

async function guardarSnapshotPlan(isNuevaCopia = false) {
    const session = window.supaAuth?.getCurrentSession();
    if (!session) {
        alert("Debes iniciar sesiÃ³n para guardar tu progreso en la nube.");
        return;
    }

    const nombreInput = document.getElementById('plan-save-name');
    const nombre = nombreInput.value.trim() || 'Mi Respaldo AutomÃ¡tico';
    
    // Check if we are updating an existing snapshot
    const currentSnapshotId = isNuevaCopia ? null : (window.currentLoadedSnapshotId || null);
    
    // Preparar el estado completo de todas las carreras activas (estado > 0)
    const estado = {};
    Object.keys(CARRERAS).forEach(cId => {
        const cursosGuardar = CARRERAS[cId].cursos.filter(c => c.estado > 0).map(c => ({ codigo: c.codigo, estado: c.estado }));
        if (cursosGuardar.length > 0) {
            estado[cId] = cursosGuardar;
        }
    });

    // Obtener el botÃ³n que disparÃ³ la acciÃ³n (cualquier botÃ³n activo del modal)
    const btn = document.querySelector('#plan-save-modal button[onclick*="guardarSnapshotPlan"]') ||
                 document.querySelector('#plan-save-modal button.bg-yellow-500');
    let oldText = '';
    if (btn) {
        oldText = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Guardando...';
        btn.disabled = true;
    }

    try {
        if (currentSnapshotId) {
            // Actualizar existente
            const { error } = await window.supaAuth.supabase
                .from('user_plan_snapshots')
                .update({
                    nombre: nombre,
                    datos_json: estado
                })
                .eq('id', currentSnapshotId);
            if (error) throw error;
            alert("Â¡Plan actualizado exitosamente!");
        } else {
            // Guardar nuevo
            const { error } = await window.supaAuth.supabase
                .from('user_plan_snapshots')
                .insert([{
                    user_id: session.user.id,
                    nombre: nombre,
                    datos_json: estado
                }]);
            if (error) throw error;
            alert("Â¡Nuevo respaldo guardado exitosamente!");
        }
        document.getElementById('plan-save-modal').classList.add('hidden');
        document.getElementById('plan-save-name').value = '';
    } catch (err) {
        console.error("Error al guardar snapshot:", err);
        alert("Hubo un error al guardar tu progreso.");
    } finally {
        if (btn) {
            btn.innerHTML = oldText;
            btn.disabled = false;
        }
        if (window.lucide) lucide.createIcons();
    }
}

async function abrirModalHistorialPlanes() {
    const session = window.supaAuth?.getCurrentSession();
    if (!session) {
        alert("Debes iniciar sesiÃ³n para ver tus respaldos guardados.");
        return;
    }
    document.getElementById('plan-history-modal').classList.remove('hidden');
    cargarHistorialPlanes();
}

async function cargarHistorialPlanes() {
    const lista = document.getElementById('plan-history-list');
    lista.innerHTML = '<div class="flex items-center justify-center h-full"><i data-lucide="loader-2" class="w-8 h-8 text-gray-500 animate-spin"></i></div>';
    if (window.lucide) lucide.createIcons();

    const session = window.supaAuth?.getCurrentSession();
    if (!session) return;

    try {
        const { data, error } = await window.supaAuth.supabase
            .from('user_plan_snapshots')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            lista.innerHTML = '<div class="text-center p-4 text-sm text-gray-500 bg-black/30 border border-white/5 rounded-2xl">No tienes respaldos guardados.</div>';
            return;
        }

        let html = '';
        data.forEach(snap => {
            const dateStr = new Date(snap.created_at).toLocaleDateString('es-CR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
            
            // Contar cuÃ¡ntos cursos guardados hay en total
            let totalCursos = 0;
            if (snap.datos_json) {
                Object.keys(snap.datos_json).forEach(cId => {
                    totalCursos += snap.datos_json[cId].length;
                });
            }

            html += `
                <div class="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-yellow-500/30 transition-colors">
                    <div>
                        <div class="font-bold text-white text-sm">${snap.nombre}</div>
                        <div class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">${dateStr} â€¢ ${totalCursos} cursos registrados</div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="abrirSnapshotPlan('${snap.id}')" title="Cargar y sobreescribir plan actual" class="bg-blue-500/10 hover:bg-blue-500/30 text-blue-500 p-2 rounded-lg transition-colors border border-blue-500/20">
                            <i data-lucide="download-cloud" class="w-4 h-4"></i>
                        </button>
                        <button onclick="eliminarSnapshotPlan('${snap.id}')" title="Eliminar respaldo" class="bg-red-500/10 hover:bg-red-500/30 text-red-500 p-2 rounded-lg transition-colors border border-red-500/20">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        lista.innerHTML = html;
        if (window.lucide) lucide.createIcons();

    } catch (err) {
        console.error("Error al cargar historial de planes:", err);
        lista.innerHTML = '<div class="text-center text-red-500 text-sm py-4">Error al cargar historial.</div>';
    }
}

async function abrirSnapshotPlan(snapshotId) {
    if (!confirm("Â¿EstÃ¡s seguro de querer cargar este respaldo? ReemplazarÃ¡ tu progreso actual con los datos guardados.")) return;

    try {
        const { data, error } = await window.supaAuth.supabase
            .from('user_plan_snapshots')
            .select('datos_json')
            .eq('id', snapshotId)
            .single();

        if (error) throw error;
        if (!data || !data.datos_json) throw new Error("No hay datos en el snapshot.");

        // 1. Resetear todos los estados a 0 (Limpiar el canvas)
        Object.keys(CARRERAS).forEach(carreraId => {
            CARRERAS[carreraId].cursos.forEach(curso => { curso.estado = 0; });
        });

        // 2. Aplicar los estados guardados
        const savedData = data.datos_json;
        Object.keys(savedData).forEach(cId => {
            if (CARRERAS[cId]) {
                const arr = savedData[cId];
                arr.forEach(savedCurso => {
                    const idx = CARRERAS[cId].cursos.findIndex(c => c.codigo === savedCurso.codigo);
                    if (idx !== -1) {
                        CARRERAS[cId].cursos[idx].estado = savedCurso.estado;
                    }
                });
            }
        });

        // 3. Sincronizar compartidos globalmente (Asegura consistencia cruzada)
        if (typeof sincronizarCompartidosGlobal === 'function') {
            sincronizarCompartidosGlobal();
        }

        // 4. Guardar como estado principal oficial
        guardarEstado();

        // 5. Renderizar interfaz y cerrar modal
        renderizarCarrera();
        document.getElementById('plan-history-modal').classList.add('hidden');
        
        // Registrar globalmente el id cargado
        window.currentLoadedSnapshotId = snapshotId;
        
        alert("Â¡Progreso cargado y sincronizado exitosamente!");

    } catch (err) {
        console.error("Error al abrir snapshot:", err);
        alert("Hubo un problema cargando el respaldo.");
    }
}

async function eliminarSnapshotPlan(snapshotId) {
    if (!confirm("Â¿EstÃ¡s seguro de eliminar este respaldo permanentemente?")) return;

    try {
        const { error } = await window.supaAuth.supabase
            .from('user_plan_snapshots')
            .delete()
            .eq('id', snapshotId);

        if (error) throw error;
        cargarHistorialPlanes(); // Recargar la lista
    } catch (err) {
        console.error("Error al eliminar snapshot:", err);
        alert("Error al eliminar el respaldo.");
    }
}

// ===================================
// REALTIME Y ONBOARDING
// ===================================

let realtimeChannel = null;

function setupRealtimeSubscription() {
    const session = window.supaAuth?.getCurrentSession();
    if (!session || !window.supaAuth?.supabase) return;

    if (realtimeChannel) {
        window.supaAuth.supabase.removeChannel(realtimeChannel);
    }

    realtimeChannel = window.supaAuth.supabase.channel('custom-all-channel')
    .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_courses', filter: `user_id=eq.${session.user.id}` },
        (payload) => {
            console.log('Cambio detectado en tiempo real:', payload);
            
            // Actualizar memoria local
            if (payload.new && payload.new.carrera_id && payload.new.course_id) {
                const cId = payload.new.carrera_id;
                if (CARRERAS[cId]) {
                    const curso = CARRERAS[cId].cursos.find(c => c.codigo === payload.new.course_id);
                    if (curso) {
                        curso.estado = parseInt(payload.new.status);
                    }
                }
                
                // Forzar sincronizaciÃ³n de compartidos si estÃ¡ definido
                if (typeof sincronizarCompartidosGlobal === 'function') {
                    sincronizarCompartidosGlobal();
                }

                // Guardar en localStorage silenciosamente
                guardarEstadoLocalSilencioso();

                // Re-renderizar
                if (typeof renderizarCarrera === 'function') renderizarCarrera();
            }
        }
    )
    .subscribe();
}

function guardarEstadoLocalSilencioso() {
    const session = window.supaAuth?.getCurrentSession();
    const storageKey = session ? `ucr_estado_${session.user.id}` : APP_STORAGE_KEY;
    const localState = { carreraActual };
    Object.keys(CARRERAS).forEach(cId => {
        localState[cId] = CARRERAS[cId].cursos.map(c => ({ codigo: c.codigo, estado: c.estado }));
    });
    localStorage.setItem(storageKey, JSON.stringify(localState));
}

function iniciarTutorial() {
    // Si ya lo viÃ³ o no cargÃ³ la librerÃ­a, ignorar
    if (localStorage.getItem('tutorial_visto') === 'true') return;
    if (typeof introJs !== 'function') return;

    const intro = introJs();
    intro.setOptions({
        nextLabel: 'Siguiente',
        prevLabel: 'AtrÃ¡s',
        doneLabel: 'Â¡Comenzar!',
        showStepNumbers: false,
        showProgress: true,
        exitOnOverlayClick: false,
        steps: [
            {
                intro: "ðŸ‘‹ Â¡Bienvenido! Te darÃ© un recorrido rÃ¡pido de 30 segundos para que saquÃ©s el mÃ¡ximo provecho a la plataforma."
            },
            {
                element: document.querySelector('.malla-container') || document.querySelector('#plan-section'),
                intro: "ðŸ’¡ **Tu Plan de Estudios:** Dale clic a cualquier curso para cambiarlo de color (Aprobado, Cursando, Pendiente).",
                position: 'top'
            },
            {
                element: document.querySelector('.controls-left') || document.querySelector('.controls-container'),
                intro: "ðŸ’¾ **Respaldos y ExportaciÃ³n:** GuardÃ¡ tu progreso en la nube o descargÃ¡ tu plan en formato imagen desde aquÃ­.",
                position: 'top'
            },
            {
                element: document.querySelector('button[data-navigate="calculator"]') || document.querySelector('.mobile-nav'),
                intro: "ðŸ”¢ **Herramientas Extra:** AccedÃ© a la Calculadora de Ponderado y al Generador de Horarios desde la navegaciÃ³n inferior.",
                position: 'top'
            }
        ]
    });

    intro.oncomplete(function() {
        localStorage.setItem('tutorial_visto', 'true');
    });

    intro.onexit(function() {
        localStorage.setItem('tutorial_visto', 'true');
    });

    setTimeout(() => {
        // Asegurarse de que el usuario estÃ© en la pestaÃ±a de "Plan"
        const planSection = document.getElementById('plan-section');
        if (planSection && !planSection.classList.contains('hidden')) {
            intro.start();
        }
    }, 1000);
}





