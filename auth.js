// auth.js - Módulo de Autenticación de Supabase

const SUPABASE_URL = 'https://ynqwmbjpznmywrxpftte.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucXdtYmpwem5teXdyeHBmdHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MTg1NTUsImV4cCI6MjA5Mjk5NDU1NX0.to4VGnDTIcFyuvVPp2vVI0D15gt0M7dejbB7HP2vINo';

// _db = cliente interno (evita conflicto con global window.supabase del CDN)
if (!window.supabase) {
    console.error('[Auth] CRITICO: CDN de Supabase no cargó.');
}
const _db = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

let currentSession = null;
let currentProfile = null;

// Cache local del username para mostrar siempre el nombre correcto
const UCR_USERNAME_KEY = 'ucr_last_username';
const AUTH_UCR_LAST_PAGE_KEY = 'ucr_last_page';
function _getStoredUsername() { 
    let u = localStorage.getItem(UCR_USERNAME_KEY);
    if (u) return u;
    
    // Si no está en caché pero hay sesión, sacarlo del correo falso
    if (currentSession && currentSession.user && currentSession.user.email) {
        const email = currentSession.user.email;
        if (email.endsWith('@campus-ucr.app')) return email.split('@')[0];
    }
    return ''; 
}
function _setStoredUsername(u) { if (u) localStorage.setItem(UCR_USERNAME_KEY, u); }
function _clearStoredUsername() { localStorage.removeItem(UCR_USERNAME_KEY); }
function _getSavedLastPage() {
    const page = localStorage.getItem(AUTH_UCR_LAST_PAGE_KEY);
    return page && page !== 'login' ? page : null;
}

// ==========================================
// INICIALIZACIÓN Y ESCUCHA DE SESIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    if (!_db) return;

    _db.auth.onAuthStateChange((event, session) => {
        const isSessionChanged = (currentSession?.user?.id !== session?.user?.id);
        currentSession = session;

        if (session) {
            console.log('[Auth] Sesión activa:', session.user.email);
            fetchUserProfile(session.user.id);
            updateAuthUI(session);
            _actualizarNombreHome(); // <-- LLAMADA AGREGADA AQUÍ
            if (isSessionChanged) {
                window.dispatchEvent(new CustomEvent('supabase_auth_changed'));
            }
        } else {
            console.log('[Auth] Sin sesión');
            currentProfile = null;
            updateAuthUI(null);
            if (isSessionChanged) {
                window.dispatchEvent(new CustomEvent('supabase_auth_changed'));
            }
        }
    });
});

// ==========================================
// UI - BOTÓN DE PERFIL EN NAVBAR
// ==========================================

function updateAuthUI(session) {
    const authContainer = document.getElementById('auth-btn-container');
    if (!authContainer) return;

    if (session) {
        const displayName = currentProfile?.full_name || currentProfile?.username || _getStoredUsername() || 'Usuario';
        authContainer.innerHTML = `
            <button id="auth-btn" class="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-all border border-emerald-500/20">
                <i data-lucide="user-check" class="w-4 h-4"></i>
                <span class="text-xs font-bold">${displayName}</span>
            </button>
        `;
        document.getElementById('auth-btn').onclick = () => showProfileMenu();
    } else {
        authContainer.innerHTML = '';
        if (typeof window.navigateTo === 'function') window.navigateTo('login');
    }
    if (window.lucide) lucide.createIcons();
}

// Actualiza el nombre en el home cuando el perfil carga
function _actualizarNombreHome() {
    // Top bar en Home
    const homeEl = document.getElementById('home-user-name');
    if (homeEl) {
        homeEl.textContent = currentProfile?.full_name || currentProfile?.username || _getStoredUsername() || 'Usuario';
    }

    // Header en Mi Plan
    const planNameEl = document.getElementById('plan-user-name');
    const planCarnetEl = document.getElementById('plan-user-carnet');
    const scheduleNameEl = document.getElementById('schedule-user-name');
    
    if (planNameEl && currentProfile) {
        planNameEl.textContent = currentProfile.full_name || 'Estudiante';
    }
    if (planCarnetEl && currentProfile) {
        planCarnetEl.textContent = currentProfile.student_id ? `${currentProfile.student_id}` : '';
    }
    if (scheduleNameEl && currentProfile) {
        scheduleNameEl.textContent = currentProfile.full_name || 'Estudiante Universitario';
    }
    
    // Mostrar botón admin si corresponde
    if (typeof initAdminBtn === 'function') {
        initAdminBtn();
    }
}

function initAdminBtn() {
    const btn = document.getElementById('btn-admin-panel');
    if (!btn) return;
    if (currentProfile?.is_admin) {
        btn.classList.remove('hidden');
        btn.classList.add('flex');
    } else {
        btn.classList.add('hidden');
        btn.classList.remove('flex');
    }
}

// ==========================================
// MÉTODOS DE AUTENTICACIÓN
// ==========================================

// Antiguas líneas eliminadas
// Helper para convertir username a un email falso para Supabase,
// pero si el username es DENGO1106, retorna el correo de administrador real.
function usernameToEmail(username) {
    const cleaned = username.toLowerCase().replace(/[^a-z0-9_.-]/g, '');
    return `${cleaned}@campus-ucr.app`;
}

async function handleSignUp(username, password, fullName, studentId) {
    showAuthLoading(true);
    try {
        const emailToUse = usernameToEmail(username);
        const { data, error } = await _db.auth.signUp({
            email: emailToUse,
            password: password,
            options: { data: { full_name: fullName, student_id: studentId } }
        });
        if (error) throw error;

        // Guardar username localmente
        _setStoredUsername(username);

        if (data.user) {
            await _db.from('profiles').upsert({
                id: data.user.id,
                username: username,
                full_name: fullName,
                student_id: studentId,
                email: emailToUse,
                selected_carreras: []
            }, { onConflict: 'id' });
        }

        if (data.session) {
            // Email confirm OFF → sesión activa ya, fetchUserProfile se encarga de navegar
        } else {
            showAuthError('Cuenta creada. Iniciá sesión con tu usuario y contraseña.');
            if (typeof switchAuthTab === 'function') switchAuthTab('login');
        }
    } catch (error) {
        const msg = error.message?.includes('already registered')
            ? 'Ese nombre de usuario ya está en uso. Elegí otro.'
            : error.message;
        showAuthError(msg);
    } finally {
        showAuthLoading(false);
    }
}

async function handleSignIn(username, password) {
    showAuthLoading(true);
    try {
        const emailToUse = usernameToEmail(username);
        const { data, error } = await _db.auth.signInWithPassword({ email: emailToUse, password });
        if (error) throw error;

        // Guardar el username localmente para mostrar el nombre siempre
        _setStoredUsername(username);

        // Intentar persistir en BD (funciona si la columna username existe)
        if (data.user) {
            try {
                await _db.from('profiles').upsert({
                    id: data.user.id,
                    username: username,
                    email: emailToUse
                }, { onConflict: 'id' });
            } catch(_) { /* silenciar si columna username no existe aún */ }
        }
        // onAuthStateChange se encarga del resto
    } catch (error) {
        showAuthError('Usuario o contraseña incorrectos.');
    } finally {
        showAuthLoading(false);
    }
}

async function handleSignOut() {
    try {
        _clearStoredUsername();
        await _db.auth.signOut();
        location.reload();
    } catch (error) {
        alert('Error al cerrar sesión: ' + error.message);
    }
}

async function deleteAccount() {
    if (!confirm('🛑 ¡ADVERTENCIA!\n\n¿Estás completamente seguro de que querés eliminar tu cuenta de forma permanente?\n\nEsta acción NO se puede deshacer. Todos tus datos, progreso e historiales serán borrados de inmediato y tu nombre de usuario quedará libre.')) {
        return;
    }

    const session = currentSession;
    if (!session || !session.user || !_db) {
        alert('No se pudo verificar tu sesión. Iniciá sesión de nuevo e intentá.');
        return;
    }

    try {
        // Llamar a la función RPC (Remote Procedure Call) en Supabase para que borre el usuario
        // Requiere haber ejecutado el SQL de delete_user en Supabase
        const { error } = await _db.rpc('delete_user');
        
        if (error) {
            console.error('Error rpc delete_user:', error);
            // Fallback: Si el RPC falla o no está creado, intentamos borrar el profile.
            // Esto liberará el nombre de usuario, aunque el auth.user en Supabase quede huérfano.
            const { error: profileError } = await _db.from('profiles').delete().eq('id', session.user.id);
            if (profileError) throw profileError;
        }

        _clearStoredUsername();
        await _db.auth.signOut();
        
        alert('Tu cuenta y todos tus datos han sido eliminados correctamente.');
        location.reload();
        
    } catch (error) {
        console.error('Error al eliminar cuenta:', error);
        alert('Hubo un error al intentar eliminar la cuenta: ' + error.message);
    }
}

// ==========================================
// PERFIL Y SELECCIÓN DE CARRERAS
// ==========================================

async function fetchUserProfile(userId) {
    if(typeof cargarCarrerasDeSupabase === 'function') await cargarCarrerasDeSupabase();
    try {
        const { data, error } = await _db
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        currentProfile = data;
        updateAuthUI(currentSession);
        _actualizarNombreHome();

        // Si no ha elegido carreras → pantalla de selección
        const selected = data?.selected_carreras;
        if (!selected || selected.length === 0) {
            _mostrarSeleccionCarreras();
        } else {
            if (typeof filtrarCarrerasPorPerfil === 'function') filtrarCarrerasPorPerfil(selected);
            if (typeof window.navigateTo === 'function') {
                const savedPage = _getSavedLastPage();
                if (savedPage) {
                    window.navigateTo(savedPage, false);
                } else {
                    window.navigateTo('home', false);
                }
            }
            if (typeof cargarEstado === 'function') cargarEstado();
        }
    } catch (error) {
        console.error('[Auth] Error cargando perfil:', error);
        _actualizarNombreHome(); // <-- Asegurar que el UI se actualice aunque falle
        // Si falla, ir al home igual
        if (typeof window.navigateTo === 'function') {
            const savedPage = _getSavedLastPage();
            window.navigateTo(savedPage || 'home', false);
        }
    }
}

function _mostrarSeleccionCarreras() {
    document.querySelectorAll('.tab-content').forEach(s => s.classList.add('hidden'));
    const sec = document.getElementById('career-selection-section');
    if (sec) sec.classList.remove('hidden');
}

function cerrarSeleccionCarreras() {
    const sec = document.getElementById('career-selection-section');
    if (sec) sec.classList.add('hidden');
    if (typeof window.navigateTo === 'function') {
        if (currentSession?.user) {
            window.navigateTo('home', false);
        } else {
            window.navigateTo('login', false);
        }
    }
}

async function guardarSeleccionCarreras() {
    const checkboxes = document.querySelectorAll('.carrera-check:checked');
    const selected = Array.from(checkboxes).map(c => c.value);

    const errEl = document.getElementById('career-select-error');
    if (errEl) errEl.classList.add('hidden');

    if (selected.length === 0) {
        if (errEl) errEl.classList.remove('hidden');
        return;
    }

    const user = currentSession?.user;
    if (!user || !_db) { alert('Error: Sesión no válida o no hay conexión. Recarga la página.'); return; }

    try {
        const { error } = await _db.from('profiles')
            .update({ selected_carreras: selected })
            .eq('id', user.id);
        if (error) throw error;

        if (currentProfile) currentProfile.selected_carreras = selected;
        if (typeof filtrarCarrerasPorPerfil === 'function') filtrarCarrerasPorPerfil(selected);
        if (typeof window.navigateTo === 'function') window.navigateTo('home');
    } catch (err) {
        console.error('[Auth] Error guardando carreras:', err);
        alert('Error al guardar tus carreras: ' + (err.message || JSON.stringify(err)));
    }
}

// Abre la pantalla de edición de carreras
function editarCarreras() {
    const selected = currentProfile?.selected_carreras || [];
    // Marcar los checkboxes según la selección actual
    document.querySelectorAll('.carrera-check').forEach(cb => {
        cb.checked = selected.includes(cb.value);
    });
    _mostrarSeleccionCarreras();
}

function showAuthLoading(isLoading) {
    const btnText = document.getElementById('auth-submit-text');
    if (btnText) btnText.innerText = isLoading ? 'Procesando...' : 'Completar Acción';
}

function showProfileMenu() {
    // Abrir modal de perfil en lugar de cerrar sesión de golpe
    const modal = document.getElementById('profile-edit-modal');
    if (modal) {
        // Cargar datos actuales
        const fullNameInput = document.getElementById('profile-edit-name');
        const studentIdInput = document.getElementById('profile-edit-carnet');
        const usernameDisplay = document.getElementById('profile-edit-username');
        
        if (fullNameInput) fullNameInput.value = currentProfile?.full_name || '';
        if (studentIdInput) studentIdInput.value = currentProfile?.student_id || '';
        if (usernameDisplay) usernameDisplay.innerText = currentProfile?.username || _getStoredUsername() || 'Usuario';
        const adminBadge = document.getElementById('profile-admin-badge');
        const adminBtnPanel = document.getElementById('profile-admin-panel-btn-container');
        if (currentProfile?.is_admin) {
            if (adminBadge) adminBadge.classList.remove('hidden');
            if (adminBtnPanel) adminBtnPanel.classList.remove('hidden');
        } else {
            if (adminBadge) adminBadge.classList.add('hidden');
            if (adminBtnPanel) adminBtnPanel.classList.add('hidden');
        }
        
        modal.classList.remove('hidden');
    } else {
        if (confirm('¿Deseas cerrar sesión?')) handleSignOut();
    }
}

async function actualizarPerfilData(fullName, studentId) {
    if (!currentSession || !_db) return false;
    
    try {
        const { error } = await _db.from('profiles')
            .update({ 
                full_name: fullName, 
                student_id: studentId 
            })
            .eq('id', currentSession.user.id);
            
        if (error) throw error;
        
        if (currentProfile) {
            currentProfile.full_name = fullName;
            currentProfile.student_id = studentId;
        }
        
        // Actualizar UI
        updateAuthUI(currentSession);
        _actualizarNombreHome();
        
        return true;
    } catch (err) {
        console.error('[Auth] Error al actualizar perfil:', err);
        alert('Error al guardar: ' + err.message);
        return false;
    }
}

// ==========================================
// HISTORIAL DE HORARIOS (GENERADOR)
// ==========================================
async function saveScheduleToCloud(name, data) {
    if (!currentSession || !_db) return false;
    try {
        const { error } = await _db
            .from('user_schedules')
            .insert([{
                user_id: currentSession.user.id,
                schedule_name: name,
                data: data
            }]);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('[Auth] Error guardando horario:', error);
        return false;
    }
}

async function loadAllSavedSchedules() {
    if (!currentSession || !_db) return [];
    try {
        const { data, error } = await _db
            .from('user_schedules')
            .select('*')
            .eq('user_id', currentSession.user.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('[Auth] Error cargando historial de horarios:', error);
        return [];
    }
}

async function deleteSavedSchedule(id) {
    if (!currentSession || !_db) return false;
    try {
        const { error } = await _db
            .from('user_schedules')
            .delete()
            .eq('id', id)
            .eq('user_id', currentSession.user.id);
            
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('[Auth] Error eliminando horario:', error);
        return false;
    }
}

// ==========================================
// EXPONER GLOBALMENTE
// ==========================================
window.supaAuth = {
    supabase: _db,
    handleSignUp: handleSignUp,
    handleSignIn: handleSignIn,
    handleSignOut: handleSignOut,
    guardarSeleccionCarreras: guardarSeleccionCarreras,
    editarCarreras: editarCarreras,
    actualizarPerfilData: actualizarPerfilData,
    showProfileMenu: showProfileMenu,
    getCurrentSession: function() { return currentSession; },
    getCurrentProfile: function() { return currentProfile; },
    getStoredUsername: _getStoredUsername,
    saveScheduleToCloud: saveScheduleToCloud,
    loadAllSavedSchedules: loadAllSavedSchedules,
    deleteSavedSchedule: deleteSavedSchedule
};
// Acceso directo desde HTML onclick
window.guardarSeleccionCarreras = guardarSeleccionCarreras;
window.editarCarreras = editarCarreras;

console.log('[Auth] Inicializado. Cliente Supabase:', !!_db);








