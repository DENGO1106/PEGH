// ===================================================
// ADMIN.JS — Panel de Administración UCR Uplan
// Solo accesible si currentProfile.is_admin === true
// ===================================================

let adminCurrentTab = 'carreras';
let adminEditingCourseId = null;
let adminEditingCarreraKey = null;

// ===================================================
// ABRIR / CERRAR PANEL
// ===================================================

function openAdminPanel() {
    const profile = window.supaAuth?.getCurrentProfile?.();
    if (!profile?.is_admin) {
        alert('Acceso denegado. No tenés permisos de administrador.');
        return;
    }
    document.getElementById('admin-panel-modal').classList.remove('hidden');
    adminSwitchTab('carreras');
}

function closeAdminPanel() {
    document.getElementById('admin-panel-modal').classList.add('hidden');
}

function adminSwitchTab(tab) {
    adminCurrentTab = tab;
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active-admin-tab');
        btn.classList.add('inactive-admin-tab');
    });
    const activeBtn = document.getElementById('admin-tab-' + tab);
    if (activeBtn) {
        activeBtn.classList.add('active-admin-tab');
        activeBtn.classList.remove('inactive-admin-tab');
    }
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.add('hidden'));
    document.getElementById('admin-content-' + tab)?.classList.remove('hidden');

    if (tab === 'carreras') adminLoadCarreras();
    else if (tab === 'cursos') adminLoadCursosByCarrera();
    else if (tab === 'convalidaciones') adminLoadConvalidaciones();
    else if (tab === 'usuarios') adminLoadUsuarios();
    else if (tab === 'feedback') { if(typeof loadAdminFeedbackData === 'function') loadAdminFeedbackData(); }
}

// ===================================================
// TAB 1: GESTIÓN DE CARRERAS
// ===================================================

async function adminLoadCarreras() {
    const container = document.getElementById('admin-carreras-list');
    if (!container) return;
    container.innerHTML = '<div class="text-center text-gray-500 py-8">Cargando...</div>';

    try {
        const { data, error } = await window.supaAuth.supabase
            .from('courses_catalog')
            .select('carrera_id');

        if (error) throw error;

        const counts = {};
        (data || []).forEach(c => { counts[c.carrera_id] = (counts[c.carrera_id] || 0) + 1; });

        const allCarreras = Object.keys(CARRERAS).map(key => ({
            key,
            ...CARRERAS[key],
            totalCursos: counts[key] || CARRERAS[key]?.cursos?.length || 0
        }));

        if (allCarreras.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 py-8">No hay carreras.</div>';
            return;
        }

        container.innerHTML = allCarreras.map(c => `
            <div class="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-white/5 gap-3">
                <div class="min-w-0 flex-1">
                    <p class="text-white font-bold truncate">${c.nombre}</p>
                    <p class="text-xs text-gray-400 truncate">${c.codigo} · ${c.facultad} · ${c.totalCursos} cursos</p>
                </div>
                <button onclick="adminEditCarrera('${c.key}')" class="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all border border-blue-500/20 flex-shrink-0">
                    <i data-lucide="pencil" class="w-4 h-4"></i>
                </button>
            </div>
        `).join('');
        lucide.createIcons();
    } catch (e) {
        container.innerHTML = '<div class="text-red-400 p-4">Error: ' + e.message + '</div>';
    }
}

function adminEditCarrera(key) {
    const carrera = CARRERAS[key];
    if (!carrera) return;
    adminEditingCarreraKey = key;
    document.getElementById('admin-carrera-form-title').textContent = 'Editando: ' + carrera.nombre;
    document.getElementById('admin-carrera-key').value = key;
    document.getElementById('admin-carrera-nombre').value = carrera.nombre;
    document.getElementById('admin-carrera-codigo').value = carrera.codigo;
    document.getElementById('admin-carrera-descripcion').value = carrera.descripcion || '';
    document.getElementById('admin-carrera-facultad').value = carrera.facultad || '';
    document.getElementById('admin-carrera-form').classList.remove('hidden');
    document.getElementById('admin-carrera-form').scrollIntoView({ behavior: 'smooth' });
}

function adminNewCarrera() {
    adminEditingCarreraKey = null;
    document.getElementById('admin-carrera-form-title').textContent = 'Nueva Carrera';
    ['admin-carrera-key','admin-carrera-nombre','admin-carrera-codigo','admin-carrera-descripcion','admin-carrera-facultad'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('admin-carrera-form').classList.remove('hidden');
    document.getElementById('admin-carrera-form').scrollIntoView({ behavior: 'smooth' });
}

function adminCancelCarreraForm() {
    document.getElementById('admin-carrera-form').classList.add('hidden');
    adminEditingCarreraKey = null;
}

async function adminSaveCarrera() {
    const originalKey = document.getElementById('admin-carrera-key').value.trim();
    const key = originalKey || document.getElementById('admin-carrera-nombre').value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    const nombre = document.getElementById('admin-carrera-nombre').value.trim();
    const codigo = document.getElementById('admin-carrera-codigo').value.trim();
    const descripcion = document.getElementById('admin-carrera-descripcion').value.trim();
    const facultad = document.getElementById('admin-carrera-facultad').value.trim();

    if (!nombre || !codigo) { alert('Nombre y código son obligatorios.'); return; }

    const isUpdate = !!originalKey;
    const payload = {
        id: key,
        nombre: nombre,
        codigo: codigo,
        descripcion: descripcion,
        facultad: facultad
    };

    try {
        if (!window.supaAuth?.supabase) throw new Error("No hay conexión a Supabase.");

        let resp;
        if (isUpdate) {
            resp = await window.supaAuth.supabase.from('careers_catalog').update(payload).eq('id', key);
        } else {
            resp = await window.supaAuth.supabase.from('careers_catalog').insert([payload]);
        }
        
        if (resp.error) throw resp.error;

        // Update local memory so UI refreshes immediately
        if (!CARRERAS[key]) CARRERAS[key] = { cursos: [] };
        CARRERAS[key].nombre = nombre;
        CARRERAS[key].codigo = codigo;
        CARRERAS[key].descripcion = descripcion;
        CARRERAS[key].facultad = facultad;

        adminCancelCarreraForm();
        adminLoadCarreras();
        showAdminToast('✅ Carrera "' + nombre + '" guardada en Supabase.');
    } catch (err) {
        alert('Error al guardar la carrera en Supabase: ' + err.message);
    }
}

// ===================================================
// TAB 2: GESTIÓN DE CURSOS
// ===================================================

async function adminLoadCursosByCarrera() {
    const selector = document.getElementById('admin-cursos-carrera-selector');
    if (!selector) return;

    if (selector.options.length <= 1) {
        Object.keys(CARRERAS).forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = CARRERAS[key].nombre;
            selector.appendChild(opt);
        });
    }

    const carreraId = selector.value;
    const listEl = document.getElementById('admin-cursos-list');
    if (!carreraId) {
        listEl.innerHTML = '<div class="text-center text-gray-500 py-8">Seleccioná una carrera arriba.</div>';
        return;
    }

    listEl.innerHTML = '<div class="text-center text-gray-500 py-8">Cargando...</div>';

    try {
        const { data, error } = await window.supaAuth.supabase
            .from('courses_catalog')
            .select('*')
            .eq('carrera_id', carreraId)
            .order('nivel', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            listEl.innerHTML = '<div class="text-center text-gray-500 py-8">Sin cursos. Agregá el primero.</div>';
            return;
        }

        const niveles = {};
        data.forEach(c => {
            if (!niveles[c.nivel]) niveles[c.nivel] = [];
            niveles[c.nivel].push(c);
        });

        let html = '';
        Object.keys(niveles).sort((a, b) => a - b).forEach(nivel => {
            html += `<h4 class="text-xs font-black text-yellow-500 uppercase tracking-widest mt-6 mb-2 pb-2 border-b border-white/10">Nivel ${nivel}</h4>`;
            html += `<div class="space-y-2">`;
            html += niveles[nivel].map(c => `
                <div class="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-white/5 gap-3">
                    <div class="min-w-0 flex-1">
                        <p class="text-white font-bold text-sm truncate">${c.nombre}</p>
                        <p class="text-xs text-gray-400">${c.codigo} · Nivel ${c.nivel} · ${c.creditos} cr · Reqs: ${(c.requisitos || []).join(', ') || 'Ninguno'}</p>
                    </div>
                    <div class="flex gap-2 flex-shrink-0">
                        <button onclick="adminEditCurso('${c.id}', '${carreraId}')" class="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all border border-blue-500/20">
                            <i data-lucide="pencil" class="w-4 h-4"></i>
                        </button>
                        <button onclick="adminDeleteCurso('${c.id}', '${c.nombre.replace(/'/g, "\\'")}')" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/20">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            html += `</div>`;
        });

        listEl.innerHTML = html;
        lucide.createIcons();
    } catch (e) {
        listEl.innerHTML = '<div class="text-red-400 p-4">Error: ' + e.message + '</div>';
    }
}

async function adminEditCurso(id, carreraId) {
    const { data, error } = await window.supaAuth.supabase
        .from('courses_catalog').select('*').eq('id', id).single();

    if (error || !data) { alert('No se pudo cargar el curso.'); return; }

    adminEditingCourseId = id;
    document.getElementById('admin-curso-form-title').textContent = 'Editando: ' + data.nombre;
    document.getElementById('admin-curso-id').value = id;
    document.getElementById('admin-curso-carrera').value = carreraId;
    document.getElementById('admin-curso-codigo').value = data.codigo;
    document.getElementById('admin-curso-nombre').value = data.nombre;
    document.getElementById('admin-curso-creditos').value = data.creditos;
    document.getElementById('admin-curso-nivel').value = data.nivel;
    adminRenderRequisitosCheckboxes(carreraId, data.requisitos || [], id);
    const preSelector = document.getElementById('admin-cursos-preexistentes-container');
    if (preSelector) preSelector.classList.add('hidden');
    document.getElementById('admin-curso-form').classList.remove('hidden');
    document.getElementById('admin-curso-form').scrollIntoView({ behavior: 'smooth' });
}

function adminNewCurso() {
    adminEditingCourseId = null;
    const carreraId = document.getElementById('admin-cursos-carrera-selector')?.value || '';
    document.getElementById('admin-curso-form-title').textContent = 'Nuevo Curso';
    document.getElementById('admin-curso-id').value = '';
    document.getElementById('admin-curso-carrera').value = carreraId;
    document.getElementById('admin-curso-codigo').value = '';
    document.getElementById('admin-curso-nombre').value = '';
    document.getElementById('admin-curso-creditos').value = '3';
    document.getElementById('admin-curso-nivel').value = '1';
    adminRenderRequisitosCheckboxes(carreraId, [], null);
    const preSelector = document.getElementById('admin-cursos-preexistentes-container');
    if (preSelector) preSelector.classList.add('hidden');
    document.getElementById('admin-curso-form').classList.remove('hidden');
    document.getElementById('admin-curso-form').scrollIntoView({ behavior: 'smooth' });
}

function adminCancelCursoForm() {
    document.getElementById('admin-curso-form').classList.add('hidden');
    adminEditingCourseId = null;
}

async function adminSaveCurso() {
    const id = document.getElementById('admin-curso-id').value;
    const carreraId = document.getElementById('admin-curso-carrera').value;
    const codigo = document.getElementById('admin-curso-codigo').value.trim().toUpperCase();
    const nombre = document.getElementById('admin-curso-nombre').value.trim();
    const creditos = parseInt(document.getElementById('admin-curso-creditos').value) || 0;
    const nivel = parseInt(document.getElementById('admin-curso-nivel').value) || 1;
    const checkboxes = document.querySelectorAll('.admin-req-checkbox:checked');
    const requisitos = Array.from(checkboxes).map(cb => cb.value);

    if (!carreraId || !codigo || !nombre) { alert('Carrera, código y nombre son obligatorios.'); return; }

    const payload = { carrera_id: carreraId, codigo, nombre, creditos, nivel, requisitos };

    try {
        let resp;
        if (id) {
            resp = await window.supaAuth.supabase.from('courses_catalog').update(payload).eq('id', id);
        } else {
            resp = await window.supaAuth.supabase.from('courses_catalog').insert([payload]);
        }
        if (resp.error) throw resp.error;

        if (CARRERAS[carreraId]) CARRERAS[carreraId].cursos = [];

        adminCancelCursoForm();
        adminLoadCursosByCarrera();
        showAdminToast('✅ Curso "' + nombre + '" guardado exitosamente.');
    } catch (e) {
        alert('Error al guardar: ' + e.message);
    }
}

async function adminDeleteCurso(id, nombre) {
    if (!confirm('¿Eliminar el curso "' + nombre + '"?\n\nEsta acción no se puede deshacer.')) return;
    try {
        const { error } = await window.supaAuth.supabase.from('courses_catalog').delete().eq('id', id);
        if (error) throw error;
        const carreraId = document.getElementById('admin-cursos-carrera-selector')?.value;
        if (carreraId && CARRERAS[carreraId]) CARRERAS[carreraId].cursos = [];
        adminLoadCursosByCarrera();
        showAdminToast('🗑️ Curso "' + nombre + '" eliminado.');
    } catch (e) {
        alert('Error al eliminar: ' + e.message);
    }
}

// ===================================================
// TAB 3: CONVALIDACIONES
// ===================================================

async function adminLoadConvalidaciones() {
    const container = document.getElementById('admin-conv-list');
    if (!container) return;
    container.innerHTML = '<div class="text-center text-gray-500 py-8">Cargando...</div>';

    try {
        const { data, error } = await window.supaAuth.supabase
            .from('convalidaciones')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 py-8">No hay convalidaciones registradas.</div>';
            return;
        }

        container.innerHTML = data.map(c => `
            <div class="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-white/5 gap-3">
                <div class="min-w-0 flex-1 text-sm">
                    <span class="text-blue-400 font-mono font-bold">${c.codigo_origen}</span>
                    <span class="text-gray-400 mx-1">(${CARRERAS[c.carrera_origen]?.nombre || c.carrera_origen})</span>
                    <span class="text-gray-400">→</span>
                    <span class="text-emerald-400 font-mono font-bold ml-1">${c.codigo_destino}</span>
                    <span class="text-gray-400 mx-1">(${CARRERAS[c.carrera_destino]?.nombre || c.carrera_destino})</span>
                </div>
                <button onclick="adminDeleteConvalidacion('${c.id}')" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 flex-shrink-0">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `).join('');
        lucide.createIcons();
    } catch (e) {
        if (e.message && (e.message.includes('does not exist') || e.code === '42P01')) {
            container.innerHTML = '<div class="text-yellow-400 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-sm">La tabla <code>convalidaciones</code> no existe. Ejecutá el SQL del panel de abajo.</div>';
        } else {
            container.innerHTML = '<div class="text-red-400 p-4">Error: ' + e.message + '</div>';
        }
    }
}

function adminShowConvForm() {
    ['admin-conv-carrera-origen', 'admin-conv-carrera-destino'].forEach(id => {
        const sel = document.getElementById(id);
        if (sel && sel.options.length <= 1) {
            Object.keys(CARRERAS).forEach(key => {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = CARRERAS[key].nombre;
                sel.appendChild(opt);
            });
        }
    });
    document.getElementById('admin-conv-form').classList.remove('hidden');
}

function adminHideConvForm() {
    document.getElementById('admin-conv-form').classList.add('hidden');
}

async function adminSaveConvalidacion() {
    const carreraOrigen = document.getElementById('admin-conv-carrera-origen').value;
    const codigoOrigen = document.getElementById('admin-conv-codigo-origen').value.trim().toUpperCase();
    const carreraDestino = document.getElementById('admin-conv-carrera-destino').value;
    const codigoDestino = document.getElementById('admin-conv-codigo-destino').value.trim().toUpperCase();

    if (!carreraOrigen || !codigoOrigen || !carreraDestino || !codigoDestino) { alert('Todos los campos son obligatorios.'); return; }

    try {
        const { error } = await window.supaAuth.supabase
            .from('convalidaciones')
            .insert([{ carrera_origen: carreraOrigen, codigo_origen: codigoOrigen, carrera_destino: carreraDestino, codigo_destino: codigoDestino }]);
        if (error) throw error;
        adminHideConvForm();
        adminLoadConvalidaciones();
        showAdminToast('✅ Convalidación registrada.');
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

async function adminDeleteConvalidacion(id) {
    if (!confirm('¿Eliminar esta convalidación?')) return;
    try {
        const { error } = await window.supaAuth.supabase.from('convalidaciones').delete().eq('id', id);
        if (error) throw error;
        adminLoadConvalidaciones();
        showAdminToast('🗑️ Convalidación eliminada.');
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

// ===================================================
// TAB 4: GESTIÓN DE USUARIOS
// ===================================================

async function adminLoadUsuarios(searchTerm) {
    const container = document.getElementById('admin-users-list');
    if (!container) return;
    container.innerHTML = '<div class="text-center text-gray-500 py-8">Cargando usuarios...</div>';

    try {
        let query = window.supaAuth.supabase
            .from('profiles')
            .select('id, username, full_name, student_id, email, is_admin, created_at')
            .order('created_at', { ascending: false })
            .limit(100);

        if (searchTerm) query = query.ilike('username', '%' + searchTerm + '%');

        const { data, error } = await query;
        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 py-8">No hay usuarios.</div>';
            return;
        }

        container.innerHTML = data.map(u => `
            <div class="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-white/5 gap-3">
                <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                        <p class="text-white font-bold text-sm">${u.username || 'sin usuario'}</p>
                        ${u.is_admin ? '<span class="text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full font-bold">ADMIN</span>' : ''}
                    </div>
                    <p class="text-xs text-gray-400">${u.full_name || 'Sin nombre'} · ${u.student_id || 'Sin carné'}</p>
                    <p class="text-xs text-gray-500">${new Date(u.created_at).toLocaleDateString('es-CR')}</p>
                </div>
                <div class="flex gap-2 flex-shrink-0">
                    ${!u.is_admin
                        ? '<button onclick="adminToggleAdmin(\'' + u.id + '\', true, \'' + (u.username || '') + '\')" class="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/20" title="Promover a Admin"><i data-lucide="shield-check" class="w-4 h-4"></i></button>'
                        : '<button onclick="adminToggleAdmin(\'' + u.id + '\', false, \'' + (u.username || '') + '\')" class="p-2 bg-zinc-700 hover:bg-zinc-600 text-gray-400 rounded-lg border border-white/10" title="Revocar Admin"><i data-lucide="shield-off" class="w-4 h-4"></i></button>'
                    }
                    <button onclick="adminDeleteUser(\'' + u.id + '\', \'' + (u.username || '') + '\')" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20" title="Eliminar"><i data-lucide="user-x" class="w-4 h-4"></i></button>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    } catch (e) {
        if (e.message && (e.message.includes('permission') || e.message.includes('policy'))) {
            container.innerHTML = '<div class="text-yellow-400 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-sm">Sin permisos para leer todos los usuarios. Ejecutá el SQL de política de admin en Supabase (ver panel de Ayuda abajo).</div>';
        } else {
            container.innerHTML = '<div class="text-red-400 p-4">Error: ' + e.message + '</div>';
        }
    }
}

async function adminToggleAdmin(userId, makeAdmin, username) {
    const action = makeAdmin ? 'promover a administrador' : 'revocar el rol de administrador de';
    if (!confirm('¿Estás seguro de ' + action + ' "' + username + '"?')) return;
    try {
        const { error } = await window.supaAuth.supabase.from('profiles').update({ is_admin: makeAdmin }).eq('id', userId);
        if (error) throw error;
        adminLoadUsuarios();
        showAdminToast('✅ Permisos de "' + username + '" actualizados.');
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

async function adminDeleteUser(userId, username) {
    const myId = window.supaAuth?.getCurrentSession()?.user?.id;
    if (userId === myId) { alert('No podés eliminar tu propia cuenta desde aquí.'); return; }
    if (!confirm('🛑 ¿Eliminar permanentemente al usuario "' + username + '"?\n\nEsta acción NO se puede deshacer.')) return;
    try {
        const { error } = await window.supaAuth.supabase.from('profiles').delete().eq('id', userId);
        if (error) throw error;
        adminLoadUsuarios();
        showAdminToast('🗑️ Usuario "' + username + '" eliminado.');
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

// ===================================================
// UTILIDADES
// ===================================================

function showAdminToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 z-[9999] bg-zinc-800 border border-white/10 text-white text-sm px-5 py-3 rounded-xl shadow-2xl';
    toast.style.animation = 'fadeIn 0.3s ease';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// Exponer globalmente
window.openAdminPanel = openAdminPanel;
window.closeAdminPanel = closeAdminPanel;
window.adminSwitchTab = adminSwitchTab;
window.adminNewCarrera = adminNewCarrera;
window.adminEditCarrera = adminEditCarrera;
window.adminSaveCarrera = adminSaveCarrera;
window.adminCancelCarreraForm = adminCancelCarreraForm;
window.adminLoadCursosByCarrera = adminLoadCursosByCarrera;
window.adminNewCurso = adminNewCurso;
window.adminEditCurso = adminEditCurso;
window.adminSaveCurso = adminSaveCurso;
window.adminCancelCursoForm = adminCancelCursoForm;
window.adminRellenarCursoPreexistente = adminRellenarCursoPreexistente;
window.adminDeleteCurso = adminDeleteCurso;
window.adminLoadConvalidaciones = adminLoadConvalidaciones;
window.adminShowConvForm = adminShowConvForm;
window.adminHideConvForm = adminHideConvForm;
window.adminSaveConvalidacion = adminSaveConvalidacion;
window.adminDeleteConvalidacion = adminDeleteConvalidacion;
window.adminLoadUsuarios = adminLoadUsuarios;
window.adminToggleAdmin = adminToggleAdmin;
window.adminDeleteUser = adminDeleteUser;

console.log('[Admin] Módulo de administración cargado.');


function adminRenderRequisitosCheckboxes(carreraId, requisitosActuales, currentCourseId) {
    const container = document.getElementById('admin-curso-requisitos-container');
    if (!container) return;
    
    // Obtener todos los cursos de esta carrera
    let cursos = [];
    if (carreraId && CARRERAS[carreraId] && CARRERAS[carreraId].cursos) {
        cursos = CARRERAS[carreraId].cursos;
    }

    if (cursos.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500">No hay otros cursos cargados en esta carrera.</p>';
        return;
    }

    // Filtrar el curso actual (no puede ser requisito de sí mismo)
    const opciones = cursos.filter(c => c.id !== currentCourseId && c.codigo !== document.getElementById('admin-curso-codigo').value);
    
    if (opciones.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500">No hay otros cursos disponibles para seleccionar como requisito.</p>';
        return;
    }

    // Agrupar por nivel
    const niveles = {};
    opciones.forEach(c => {
        if (!niveles[c.nivel]) niveles[c.nivel] = [];
        niveles[c.nivel].push(c);
    });

    let html = '';
    Object.keys(niveles).sort((a, b) => a - b).forEach(nivel => {
        html += `<h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3 mb-1 pl-1">Nivel ${nivel}</h4>`;
        html += niveles[nivel].map(c => {
            const isChecked = requisitosActuales.includes(c.codigo) ? 'checked' : '';
            return `
                <label class="flex items-center gap-3 p-2 bg-black/30 border border-white/5 rounded-lg cursor-pointer hover:bg-black/50 transition-colors">
                    <input type="checkbox" value="${c.codigo}" class="admin-req-checkbox w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900 bg-gray-700" ${isChecked}>
                    <div class="flex flex-col">
                        <span class="text-xs font-bold text-white">${c.codigo}</span>
                        <span class="text-[10px] text-gray-400">${c.nombre} (Nivel ${c.nivel})</span>
                    </div>
                </label>
            `;
        }).join('');
    });

    container.innerHTML = html;
}





