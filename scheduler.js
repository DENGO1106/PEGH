/**
 * SCHEDULER.JS
 * Lógica para la gestión de horarios evolucionada: Cursos recomendados, dinámicos y personalizables.
 */

let selectedCourses = [];
let currentPickerCategory = null;
let editingCourseId = null;
let categoryColorOverrides = {}; // { carreraId: colorIndex }

// Paletas de colores premium disponibles para los cursos
const CAREER_COLORS = [
    { bg: 'bg-red-950/85', border: 'border-red-500/30', accent: 'bg-red-600', text: 'text-red-100', name: 'Rojo' },
    { bg: 'bg-blue-950/85', border: 'border-blue-500/30', accent: 'bg-blue-600', text: 'text-blue-100', name: 'Azul' },
    { bg: 'bg-emerald-950/85', border: 'border-emerald-500/30', accent: 'bg-emerald-600', text: 'text-emerald-100', name: 'Verde' },
    { bg: 'bg-indigo-950/85', border: 'border-indigo-500/30', accent: 'bg-indigo-600', text: 'text-indigo-100', name: 'Índigo' },
    { bg: 'bg-purple-950/85', border: 'border-purple-500/30', accent: 'bg-purple-600', text: 'text-purple-100', name: 'Morado' },
    { bg: 'bg-zinc-900/90', border: 'border-white/10', accent: 'bg-zinc-400', text: 'text-gray-100', name: 'Plata' },
    { bg: 'bg-amber-950/85', border: 'border-amber-500/30', accent: 'bg-amber-600', text: 'text-amber-100', name: 'Ámbar' }
];

function initScheduler() {
    cargarHorarios();
    renderSchedulerCategories();
    lucide.createIcons();
}

/**
 * Renderiza dinámicamente los contenedores para las carreras seleccionadas en el sidebar.
 */
function renderSchedulerCategories() {
    const container = document.getElementById('scheduler-careers-container');
    if (!container) return;
    
    let html = '';
    
    let activeCareers = [];
    const profile = window.supaAuth?.getCurrentProfile();
    if (profile && profile.selected_carreras && profile.selected_carreras.length > 0) {
        activeCareers = profile.selected_carreras;
    } else {
        activeCareers = typeof CARRERAS !== 'undefined' ? Object.keys(CARRERAS) : [];
    }
    
    activeCareers.forEach((carreraId, index) => {
        const nombre = typeof getNombreCarrera === 'function' ? getNombreCarrera(carreraId) : carreraId;
        
        // Usar color del override, o el por defecto según el índice
        const overrideIndex = categoryColorOverrides[carreraId];
        const colorIndex = overrideIndex !== undefined ? overrideIndex : (index % CAREER_COLORS.length);
        const color = CAREER_COLORS[colorIndex];
        
        html += `
            <div class="cat-box border-l-4 ${color.border.replace('border-', 'border-l-')} ${color.bg.replace('/85', '/10')} p-4 rounded-xl border border-white/5 relative">
              <div class="flex justify-between items-center mb-3">
                <span class="text-xs font-black ${color.text} uppercase tracking-widest flex items-center gap-2">
                  <button onclick="changeCategoryColor('${carreraId}')" class="w-3 h-3 rounded-full ${color.accent} cursor-pointer hover:scale-125 transition-transform" title="Cambiar Color a toda la carrera"></button>
                  ${nombre}
                </span>
                <button onclick="openCoursePicker('${carreraId}')"
                  class="text-[9px] font-bold ${color.bg.replace('/85', '/20')} hover:${color.bg.replace('/85', '/40')} ${color.text} px-3 py-1 rounded-full transition-all border ${color.border}">
                  + Añadir Cursos
                </button>
              </div>
              <div id="list-${carreraId}" class="space-y-2"></div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    renderSelectedCourses(); 
}

function getBaseColorForCategory(categoryId) {
    const overrideIndex = categoryColorOverrides[categoryId];
    if (overrideIndex !== undefined) return CAREER_COLORS[overrideIndex];

    let activeCareers = [];
    const profile = window.supaAuth?.getCurrentProfile();
    if (profile && profile.selected_carreras && profile.selected_carreras.length > 0) {
        activeCareers = profile.selected_carreras;
    } else {
        activeCareers = typeof CARRERAS !== 'undefined' ? Object.keys(CARRERAS) : [];
    }
    const index = activeCareers.indexOf(categoryId);
    return CAREER_COLORS[index >= 0 ? index % CAREER_COLORS.length : 0];
}

function changeCategoryColor(categoryId) {
    const currentOverride = categoryColorOverrides[categoryId];
    
    let currentIndex = 0;
    if (currentOverride !== undefined) {
        currentIndex = currentOverride;
    } else {
        let activeCareers = window.supaAuth?.getCurrentProfile()?.selected_carreras || [];
        if (activeCareers.length === 0) activeCareers = typeof CARRERAS !== 'undefined' ? Object.keys(CARRERAS) : [];
        const index = activeCareers.indexOf(categoryId);
        currentIndex = index >= 0 ? index % CAREER_COLORS.length : 0;
    }
    
    const nextIndex = (currentIndex + 1) % CAREER_COLORS.length;
    categoryColorOverrides[categoryId] = nextIndex;
    
    // Actualizar todos los cursos existentes de esa carrera al nuevo color
    selectedCourses.forEach(c => {
        if (c.category === categoryId) {
            c.colorSettings = CAREER_COLORS[nextIndex];
        }
    });
    
    renderSchedulerCategories(); // Re-renderiza colores del sidebar
    renderSelectedCourses();     // Re-renderiza las listas
    guardarHorarios();
}

function openCoursePicker(carreraId, existingId = null) {
    currentPickerCategory = carreraId;
    editingCourseId = existingId;
    const modal = document.getElementById('course-picker-modal');
    const optionsContainer = document.getElementById('picker-options');
    const title = document.getElementById('picker-title');

    modal.classList.remove('hidden');
    optionsContainer.innerHTML = '';

    const nombreCarrera = typeof getNombreCarrera === 'function' ? getNombreCarrera(carreraId) : carreraId;
    title.textContent = existingId ? `Cambiar Curso: ${nombreCarrera}` : `Seleccionar: ${nombreCarrera}`;

    const recomendados = typeof getCursosDisponibles === 'function' ? getCursosDisponibles(carreraId) : [];
    const todos = CARRERAS[carreraId]?.cursos || [];
    const yaAgregadosIds = selectedCourses.map(c => c.codigo);
    
    let html = '';
    
    if (recomendados.length > 0) {
        html += `<div class="text-xs font-black text-green-500 uppercase tracking-widest mb-2 mt-2 px-2"><i data-lucide="star" class="w-3 h-3 inline pb-0.5"></i> Recomendados (Requisitos Listos)</div>`;
        recomendados.forEach(curso => {
            if (yaAgregadosIds.includes(curso.codigo) && !existingId) return; 
            html += _createPickerOptionHTML(carreraId, curso, true, existingId);
        });
    }
    
    html += `<div class="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 mt-6 px-2">Todos los Cursos</div>`;
    todos.forEach(curso => {
        if (yaAgregadosIds.includes(curso.codigo) && !existingId) return;
        if (recomendados.find(r => r.codigo === curso.codigo)) return;
        html += _createPickerOptionHTML(carreraId, curso, false, existingId);
    });

    if (html.trim() === '<div class="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 mt-6 px-2">Todos los Cursos</div>') {
        html = '<p class="text-gray-500 text-center py-4 text-sm">No hay cursos disponibles para matricular.</p>';
    }

    optionsContainer.innerHTML = html;
    lucide.createIcons();
}

function _createPickerOptionHTML(carreraId, curso, isRecommended, existingId) {
    return `
        <button onclick="selectCourseFromPicker('${carreraId}', '${curso.codigo}')" class="picker-option flex justify-between items-center text-left w-full hover:bg-white/5 p-3 rounded-xl transition-colors group border border-transparent hover:border-white/10 ${isRecommended ? 'bg-green-900/10 border-green-500/10' : ''}">
            <div class="text-left">
                <div class="font-bold text-white text-sm group-hover:text-red-400 transition-colors">${curso.nombre}</div>
                <div class="text-[10px] text-gray-400 font-medium">${curso.codigo} · ${curso.creditos} CR</div>
            </div>
            <i data-lucide="${existingId ? 'refresh-cw' : 'plus'}" class="w-4 h-4 text-gray-600 group-hover:text-white transition-colors"></i>
        </button>
    `;
}

function closeCoursePicker() {
    const modal = document.getElementById('course-picker-modal');
    if(modal) modal.classList.add('hidden');
    editingCourseId = null;
}

function selectCourseFromPicker(carreraId, codigo) {
    const cursoData = typeof getCursoByCodigo === 'function' ? getCursoByCodigo(carreraId, codigo) : null;
    if (!cursoData) return;

    if (editingCourseId) {
        const curso = selectedCourses.find(c => c.id === editingCourseId);
        if (curso) {
            curso.codigo = cursoData.codigo;
            curso.nombre = cursoData.nombre;
            curso.creditos = cursoData.creditos;
        }
    } else {
        const startRad = document.querySelector('input[name="sched-start"]:checked');
        const startH = startRad ? parseInt(startRad.value) : 7;
        const color = getBaseColorForCategory(carreraId);
        
        const nuevaEntrada = {
            id: Date.now() + Math.random(),
            codigo: cursoData.codigo,
            nombre: cursoData.nombre,
            creditos: cursoData.creditos,
            category: carreraId,
            colorSettings: color,
            sessions: [
                {
                    id: Date.now() + Math.random(),
                    day: 'Lunes',
                    startTime: startH,
                    endTime: Math.min(22, startH + 2),
                    building: 'Ingeniería',
                    room: ''
                }
            ]
        };
        selectedCourses.push(nuevaEntrada);
    }

    closeCoursePicker();
    renderSelectedCourses();
    guardarHorarios();
}

function addManualCourse() {
    const input = document.getElementById('custom-activity-name');
    const name = input ? input.value.trim() : '';
    if (!name) {
        alert("Por favor ingresa un nombre para la actividad extra.");
        return;
    }
    
    const startRad = document.querySelector('input[name="sched-start"]:checked');
    const startH = startRad ? parseInt(startRad.value) : 7;
    
    selectedCourses.push({
        id: Date.now() + Math.random(),
        codigo: 'EXTRA',
        nombre: name,
        creditos: 0,
        category: 'custom',
        colorSettings: CAREER_COLORS[CAREER_COLORS.length - 1], // Default: Ámbar
        sessions: [
            {
                id: Date.now() + Math.random(),
                day: 'Lunes',
                startTime: startH,
                endTime: Math.min(22, startH + 2),
                building: 'Casa/Otro',
                room: ''
            }
        ]
    });
    
    if (input) input.value = '';
    renderSelectedCourses();
    guardarHorarios();
}

function addSession(courseId) {
    const curso = selectedCourses.find(c => c.id === courseId);
    if (!curso) return;

    const lastSession = curso.sessions[curso.sessions.length - 1];
    let buildingBase = lastSession ? lastSession.building : 'Aulas';

    curso.sessions.push({
        id: Date.now() + Math.random(),
        day: lastSession ? lastSession.day : 'Lunes',
        startTime: lastSession ? lastSession.startTime : 7,
        endTime: Math.min(22, (lastSession ? lastSession.endTime : 8)),
        building: buildingBase,
        room: lastSession ? lastSession.room : ''
    });
    renderSelectedCourses();
    guardarHorarios();
}

function removeSession(courseId, sessionId) {
    const curso = selectedCourses.find(c => c.id === courseId);
    if (!curso) return;
    if (curso.sessions.length <= 1) {
        removeCourse(courseId);
        return;
    }
    curso.sessions = curso.sessions.filter(s => s.id !== sessionId);
    renderSelectedCourses();
    guardarHorarios();
}

function clearAllSchedule() {
    if (confirm('¿Estás seguro de que deseas borrar todo el horario?')) {
        selectedCourses = [];
        renderSelectedCourses();
        guardarHorarios();
    }
}

function changeCourseColor(courseId) {
    const curso = selectedCourses.find(c => c.id === courseId);
    if (!curso) return;
    
    const currentIndex = CAREER_COLORS.findIndex(c => c.name === (curso.colorSettings?.name || ''));
    const nextIndex = (currentIndex + 1) % CAREER_COLORS.length;
    curso.colorSettings = CAREER_COLORS[nextIndex];
    
    renderSelectedCourses();
    guardarHorarios();
}

function renderSelectedCourses() {
    // Vaciar contenedores
    const activeCareers = typeof CARRERAS !== 'undefined' ? Object.keys(CARRERAS) : [];
    activeCareers.forEach(cat => {
        const c = document.getElementById(`list-${cat}`);
        if(c) c.innerHTML = '';
    });
    const cCustom = document.getElementById('list-custom');
    if(cCustom) cCustom.innerHTML = '';

    const startRad = document.querySelector('input[name="sched-start"]:checked');
    const startH_config = startRad ? parseInt(startRad.value) : 7;
    const conflicts = findConflicts();

    selectedCourses.forEach(curso => {
        const container = document.getElementById(`list-${curso.category}`);
        if (!container) return; // Ignore if category is missing from DOM

        const card = document.createElement('div');
        card.className = `bg-white/5 border border-white/10 rounded-xl p-4 mb-4 transition-all relative overflow-hidden`;
        
        const cStyles = curso.colorSettings || CAREER_COLORS[0];
        card.innerHTML += `<div class="absolute left-0 top-0 bottom-0 w-1 ${cStyles.accent}"></div>`;

        let sessionsHtml = '';
        curso.sessions.forEach(session => {
            const conflictInfo = conflicts.find(conf => conf.courseId === curso.id && conf.sessionId === session.id);
            sessionsHtml += `
                <div class="session-row p-3 bg-black/30 rounded-lg border border-white/5 mb-2 relative ${conflictInfo ? 'border-red-500/50 bg-red-900/10' : ''}">
                    <div class="grid grid-cols-12 gap-2 mt-1">
                        <select onchange="updateSessionField(${curso.id}, ${session.id}, 'day', this.value)" class="col-span-4 bg-zinc-900 text-xs text-gray-300 rounded-lg p-2 border border-white/5 outline-none">
                            ${['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(d => `<option value="${d}" ${session.day === d ? 'selected' : ''}>${d}</option>`).join('')}
                        </select>
                        <div class="col-span-8 flex items-center gap-1">
                            <select onchange="updateSessionField(${curso.id}, ${session.id}, 'startTime', parseInt(this.value))" class="bg-zinc-900 text-xs text-gray-300 rounded-lg p-2 border border-white/5 outline-none flex-1">
                                ${getHourOptions(startH_config, session.startTime)}
                            </select>
                            <span class="text-gray-700">-</span>
                            <select onchange="updateSessionField(${curso.id}, ${session.id}, 'endTime', parseInt(this.value))" class="bg-zinc-900 text-xs text-gray-300 rounded-lg p-2 border border-white/5 outline-none flex-1">
                                ${getHourOptions(startH_config, session.endTime)}
                            </select>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-12 gap-2 mt-2">
                        <select onchange="updateSessionField(${curso.id}, ${session.id}, 'building', this.value)" class="col-span-6 bg-zinc-900 text-xs text-gray-300 rounded-lg p-2 border border-white/5 outline-none">
                            ${['Aulas', 'Ingeniería', 'Ciencias Económicas', 'Generales', 'Educación', 'Casa/Otro'].map(b => `<option value="${b}" ${session.building === b ? 'selected' : ''}>${b}</option>`).join('')}
                        </select>
                        <input type="text" placeholder="Aula" value="${session.room}" onchange="updateSessionField(${curso.id}, ${session.id}, 'room', this.value)" 
                               class="col-span-6 bg-zinc-900 text-xs p-2 rounded-lg border border-white/5 outline-none placeholder-gray-700 text-white">
                    </div>
                    
                    ${conflictInfo ? `<div class="text-[8px] text-red-500 font-bold mt-2 flex items-center gap-1 uppercase tracking-widest"><i data-lucide="alert-triangle" class="w-2.5 h-2.5"></i> CHOCA CON: ${conflictInfo.conflictWith}</div>` : ''}
                    <button onclick="removeSession(${curso.id}, ${session.id})" class="absolute -top-1 -right-1 bg-red-600/20 text-red-500 rounded-full p-1 hover:bg-red-600/40 transition-all border border-transparent hover:border-red-500/20">
                        <i data-lucide="x" class="w-3 h-3"></i>
                    </button>
                </div>
            `;
        });

        const changeContentHtml = curso.category === 'custom' ? '' : `
            <button onclick="openCoursePicker('${curso.category}', ${curso.id})" class="text-gray-600 hover:text-white transition-colors" title="Cambiar Curso">
                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
            </button>
        `;

        card.innerHTML += `
            <div class="flex flex-col gap-3 group ml-2">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="text-xs font-black text-white uppercase tracking-tighter flex items-center gap-2">
                            ${curso.nombre}
                            <button onclick="changeCourseColor(${curso.id})" class="w-2.5 h-2.5 rounded-full ${cStyles.accent} cursor-pointer hover:scale-125 transition-transform" title="Cambiar Color"></button>
                        </div>
                        <div class="text-[9px] text-gray-500 uppercase mt-0.5 tracking-wider">${curso.codigo} · ${curso.creditos} CR</div>
                    </div>
                    <div class="flex gap-2">
                        ${changeContentHtml}
                        <button onclick="removeCourse(${curso.id})" class="text-gray-600 hover:text-red-500 transition-colors">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
                
                <div class="sessions-list">
                    ${sessionsHtml}
                </div>

                <button onclick="addSession(${curso.id})" class="text-[9px] uppercase font-black text-gray-500 hover:text-white border border-dashed border-white/10 rounded-lg py-1.5 flex items-center justify-center gap-1 transition-all">
                    <i data-lucide="plus" class="w-3 h-3"></i> Añadir Bloque Adicional
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    updateStats();
    lucide.createIcons();
}

function getHourOptions(start, selected) {
    let options = '';
    for (let h = start; h <= 22; h++) {
        options += `<option value="${h}" ${selected === h ? 'selected' : ''}>${h}:00</option>`;
    }
    return options;
}

function findConflicts() {
    const list = [];
    const allSessions = [];
    selectedCourses.forEach(c => {
        c.sessions.forEach(s => {
            allSessions.push({ ...s, courseId: c.id, courseName: c.nombre });
        });
    });

    for (let i = 0; i < allSessions.length; i++) {
        for (let j = i + 1; j < allSessions.length; j++) {
            const s1 = allSessions[i];
            const s2 = allSessions[j];
            if (s1.day === s2.day) {
                if (s1.startTime < s2.endTime && s2.startTime < s1.endTime) {
                    list.push({ courseId: s1.courseId, sessionId: s1.id, conflictWith: s2.courseName });
                    list.push({ courseId: s2.courseId, sessionId: s2.id, conflictWith: s1.courseName });
                }
            }
        }
    }
    return list;
}

function updateSessionField(courseId, sessionId, field, value) {
    const curso = selectedCourses.find(c => c.id === courseId);
    if (curso) {
        const session = curso.sessions.find(s => s.id === sessionId);
        if (session) {
            session[field] = value;
            renderSelectedCourses();
            guardarHorarios();
        }
    }
}

function removeCourse(id) {
    selectedCourses = selectedCourses.filter(c => c.id !== id);
    renderSelectedCourses();
    guardarHorarios();
}

/**
 * Genera la rejilla visual PREMIUM
 */
function generateSchedule() {
    const conflicts = findConflicts();
    if (conflicts.length > 0) {
        alert('❌ No se puede generar el horario visual porque existen CHOQUES DE HORARIO.\n\nPor favor, revisa las alertas en rojo en tu lista de materias y ajusta las horas antes de continuar.');
        const firstConflict = document.querySelector('.border-red-500\\/50');
        if (firstConflict) firstConflict.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    const startRad = document.querySelector('input[name="sched-start"]:checked');
    const startHourVal = startRad ? parseInt(startRad.value) : 7;
    const showWeekendEl = document.getElementById('sched-weekend');
    const showWeekend = showWeekendEl ? showWeekendEl.checked : false;
    const cycleEl = document.getElementById('scheduler-cycle');
    const cycle = (cycleEl && cycleEl.value) ? cycleEl.value : 'I CICLO';

    const outCycle = document.getElementById('out-cycle');
    if(outCycle) outCycle.textContent = cycle;

    const container = document.getElementById('scheduler-grid-container');
    if(!container) return;
    container.innerHTML = '';

    const days = showWeekend
        ? ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        : ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    updateResultStats();

    container.style.gridTemplateColumns = `70px repeat(${days.length}, 1fr)`;

    container.appendChild(document.createElement('div')); // Esquina vacía
    days.forEach(d => {
        const header = document.createElement('div');
        header.className = 'flex items-center justify-center p-3 mb-2 bg-zinc-900/50 rounded-xl border border-white/5 mx-1';
        header.innerHTML = `<span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">${d}</span>`;
        container.appendChild(header);
    });

    for (let h = startHourVal; h <= 22; h++) {
        const timeCell = document.createElement('div');
        timeCell.className = 'text-[10px] text-gray-600 font-mono flex items-center justify-end pr-4 h-[80px] border-t border-white/5';
        timeCell.textContent = `${h}:00`;
        container.appendChild(timeCell);

        for (let d = 0; d < days.length; d++) {
            const cell = document.createElement('div');
            cell.className = 'border-t border-l border-white/5 relative h-[80px] bg-white/[0.01]';
            container.appendChild(cell);
        }
    }

    container.style.position = 'relative';

    selectedCourses.forEach(curso => {
        const cStyles = curso.colorSettings || CAREER_COLORS[0];

        curso.sessions.forEach(session => {
            const dayIdx = days.indexOf(session.day);
            if (dayIdx === -1) return;
            if (session.startTime < startHourVal) return;

            const duration = session.endTime - session.startTime;
            const topY = (session.startTime - startHourVal) * 80 + 58;
            const heightVal = duration * 80;

            const block = document.createElement('div');
            block.className = `absolute ${cStyles.bg} border ${cStyles.border} rounded-2xl overflow-hidden z-20 flex flex-col shadow-2xl backdrop-blur-md transition-all`;
            block.style.left = `calc(70px + (100% - 70px) / ${days.length} * ${dayIdx} + 8px)`;
            block.style.width = `calc((100% - 70px) / ${days.length} - 16px)`;
            block.style.top = `${topY}px`;
            block.style.height = `${heightVal}px`;

            block.innerHTML = `
                <div class="flex justify-between items-start pt-3 px-3">
                    <div class="bg-black/40 px-2 py-0.5 rounded text-[8px] font-black text-white/50 border border-white/5">${curso.codigo}</div>
                    <div class="text-right">
                        <div class="text-[11px] font-black text-white leading-none">${curso.creditos || 0}</div>
                        <div class="text-[6px] font-bold text-white/30 uppercase tracking-tighter">CR</div>
                    </div>
                </div>

                <div class="flex-1 flex flex-col justify-center px-4 py-2">
                    <div class="text-[11px] font-black text-white uppercase leading-[1.1] text-center mb-3 tracking-tight drop-shadow-sm">
                        ${curso.nombre}
                    </div>
                    <div class="text-center">
                        <div class="text-[8px] text-white/50 font-black uppercase tracking-[0.1em]">${session.building}</div>
                        <div class="text-[9px] text-white/80 font-bold mt-0.5">${session.room || '--'}</div>
                    </div>
                </div>

                <div class="absolute top-0 left-0 right-0 h-1 ${cStyles.accent} opacity-90"></div>
            `;
            container.appendChild(block);
        });
    });

    const resEl = document.getElementById('schedule-result');
    if(resEl) {
        resEl.classList.remove('hidden');
        resEl.scrollIntoView({ behavior: 'smooth' });
    }
}

function updateStats() {
    updateResultStats();
}

function updateResultStats() {
    let totCR = 0;
    let totH = 0;
    
    selectedCourses.forEach(c => {
        totCR += (c.creditos || 0);
        c.sessions.forEach(s => {
            totH += (s.endTime - s.startTime);
        });
    });

    const summaryEl = document.getElementById('out-stats-summary');
    if (summaryEl) {
        summaryEl.innerHTML = `
            <span class="text-white font-black">✨ TOTAL HORAS: ${totH}H</span>
        `;
    }
    const crEl = document.getElementById('out-total-cr');
    if (crEl) crEl.textContent = `${totCR} CR`;
}

async function downloadScheduleImage() {
    const area = document.getElementById('schedule-capture-area');
    const cycleEl = document.getElementById('scheduler-cycle');
    const cycle = (cycleEl && cycleEl.value) ? cycleEl.value : 'Horario';
    try {
        const canvas = await html2canvas(area, {
            scale: 3, 
            backgroundColor: '#0a0a0a',
            logging: false,
            useCORS: true
        });
        const link = document.createElement('a');
        link.download = `Horario_Semanal_${cycle.replace(/\\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (e) {
        console.error(e);
        alert('Error al generar imagen.');
    }
}

const SCHED_STORAGE_KEY = 'ucr_app_horarios_v3'; 

function guardarHorarios() {
    const cycleEl = document.getElementById('scheduler-cycle');
    const startRad = document.querySelector('input[name="sched-start"]:checked');
    const weekendEl = document.getElementById('sched-weekend');
    
    const data = {
        courses: selectedCourses,
        colorOverrides: categoryColorOverrides,
        cycle: cycleEl ? cycleEl.value : '',
        config: {
            start: startRad ? startRad.value : 7,
            weekend: weekendEl ? weekendEl.checked : false
        }
    };
    
    const session = window.supaAuth?.getCurrentSession();
    const key = session ? `${SCHED_STORAGE_KEY}_${session.user.id}` : SCHED_STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(data));
}

function cargarHorarios() {
    const session = window.supaAuth?.getCurrentSession();
    const key = session ? `${SCHED_STORAGE_KEY}_${session.user.id}` : SCHED_STORAGE_KEY;
    const saved = localStorage.getItem(key);
    
    if (!saved) return;
    try {
        const data = JSON.parse(saved);
        selectedCourses = data.courses || [];
        categoryColorOverrides = data.colorOverrides || {};
        
        const cycleEl = document.getElementById('scheduler-cycle');
        if(cycleEl) cycleEl.value = data.cycle || '';
        
        if (data.config) {
            const radio = document.querySelector(`input[name="sched-start"][value="${data.config.start}"]`);
            if (radio) radio.checked = true;
            const weekendEl = document.getElementById('sched-weekend');
            if (weekendEl) weekendEl.checked = data.config.weekend;
        }
    } catch (e) {
        console.error('Error cargando horarios:', e);
    }
}
