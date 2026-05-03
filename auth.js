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
function _getStoredUsername() { 
    let u = localStorage.getItem(UCR_USERNAME_KEY);
    if (u) return u;
    
    // Si no está en caché pero hay sesión, sacarlo del correo falso
    if (currentSession && currentSession.user && currentSession.user.email) {
        const email = currentSession.user.email;
        if (email.endsWith('@campus-ucr.app')) return email.split('@')[0];
        if (email === 'diegodengosoto@gmail.com') return 'DENGO1106'; // Soporte cuenta vieja
    }
    return ''; 
}
function _setStoredUsername(u) { if (u) localStorage.setItem(UCR_USERNAME_KEY, u); }
function _clearStoredUsername() { localStorage.removeItem(UCR_USERNAME_KEY); }

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

// ==========================================
// PERFIL Y SELECCIÓN DE CARRERAS
// ==========================================

async function fetchUserProfile(userId) {
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
            if (typeof window.navigateTo === 'function') window.navigateTo('home');
            if (typeof cargarEstado === 'function') cargarEstado();
        }
    } catch (error) {
        console.error('[Auth] Error cargando perfil:', error);
        _actualizarNombreHome(); // <-- Asegurar que el UI se actualice aunque falle
        // Si falla, ir al home igual
        if (typeof window.navigateTo === 'function') window.navigateTo('home');
    }
}

function _mostrarSeleccionCarreras() {
    document.querySelectorAll('.tab-content').forEach(s => s.classList.add('hidden'));
    const sec = document.getElementById('career-selection-section');
    if (sec) sec.classList.remove('hidden');
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
    if (!user || !_db) return;

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
    if (confirm('¿Deseas cerrar sesión?')) handleSignOut();
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
    getCurrentSession: function() { return currentSession; },
    getCurrentProfile: function() { return currentProfile; },
    getStoredUsername: _getStoredUsername
};
// Acceso directo desde HTML onclick
window.guardarSeleccionCarreras = guardarSeleccionCarreras;
window.editarCarreras = editarCarreras;

console.log('[Auth] Inicializado. Cliente Supabase:', !!_db);
