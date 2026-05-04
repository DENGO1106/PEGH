// calculator.js - Lógica para la Calculadora de Promedio Ponderado

let calcCurrentMode = 'auto';
let calcAutoCourses = [];
let calcManualCourses = [];
const CALC_STORAGE_KEY = 'ucr_app_calc_v1';

function calcGetStorageKey() {
    const session = window.supaAuth?.getCurrentSession();
    return session ? `${CALC_STORAGE_KEY}_${session.user.id}` : CALC_STORAGE_KEY;
}

function calcSaveData() {
    const data = {
        autoCourses: calcAutoCourses,
        manualCourses: calcManualCourses
    };
    localStorage.setItem(calcGetStorageKey(), JSON.stringify(data));
}

function calcLoadSavedData() {
    const saved = localStorage.getItem(calcGetStorageKey());
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch(e) {}
    }
    return null;
}

// ==========================================
// NAVEGACIÓN Y TABS
// ==========================================

function calcSwitchTab(mode) {
    calcCurrentMode = mode;
    const btnAuto = document.getElementById('calc-tab-auto');
    const btnManual = document.getElementById('calc-tab-manual');
    const sectionAuto = document.getElementById('calc-mode-auto');
    const sectionManual = document.getElementById('calc-mode-manual');

    if (mode === 'auto') {
        btnAuto.className = 'flex-1 py-2 text-sm font-bold text-black bg-white rounded-lg transition-all shadow-sm';
        btnManual.className = 'flex-1 py-2 text-sm font-bold text-gray-400 hover:text-white transition-all rounded-lg';
        sectionAuto.classList.remove('hidden');
        sectionManual.classList.add('hidden');
        if (calcAutoCourses.length === 0) calcLoadAuto();
        else calcRenderAuto();
    } else {
        btnManual.className = 'flex-1 py-2 text-sm font-bold text-black bg-white rounded-lg transition-all shadow-sm';
        btnAuto.className = 'flex-1 py-2 text-sm font-bold text-gray-400 hover:text-white transition-all rounded-lg';
        sectionManual.classList.remove('hidden');
        sectionAuto.classList.add('hidden');
        
        // Si al cambiar a manual no hay cursos guardados, agregamos uno por defecto.
        // Si hay guardados, se renderizan.
        const savedData = calcLoadSavedData();
        if (savedData?.manualCourses && savedData.manualCourses.length > 0) {
            calcManualCourses = savedData.manualCourses;
            calcRenderManual();
        } else if (calcManualCourses.length === 0) {
            calcAddManualRow();
        } else {
            calcRenderManual();
        }
    }

    calcCalculateResult();
}

// ==========================================
// MODO AUTOMÁTICO (Cursos Amarillos = estado 2)
// ==========================================

function calcLoadAuto() {
    if (typeof CARRERAS === 'undefined') {
        console.warn('CARRERAS no disponible aún.');
        return;
    }

    const savedData = calcLoadSavedData();
    const savedAuto = savedData?.autoCourses || [];

    calcAutoCourses = [];

    // Obtener carreras activas del perfil, si no hay usar todas
    let activeCareers = [];
    const profile = window.supaAuth?.getCurrentProfile();
    if (profile && profile.selected_carreras && profile.selected_carreras.length > 0) {
        activeCareers = profile.selected_carreras;
    } else {
        activeCareers = Object.keys(CARRERAS);
    }

    // Iterar sobre las carreras activas y buscar cursos en estado 2 (Cursando / Amarillo)
    activeCareers.forEach(carreraId => {
        if (!CARRERAS[carreraId]) return;
        CARRERAS[carreraId].cursos.forEach(curso => {
            if (curso.estado === 2) {
                // Evitar duplicados si un curso (ej. Humanidades) está en múltiples carreras
                if (!calcAutoCourses.some(c => c.id === curso.codigo)) {
                    // Verificar si ya teníamos una nota guardada para este curso
                    const prev = savedAuto.find(s => s.id === curso.codigo);
                    calcAutoCourses.push({
                        id: curso.codigo,
                        name: curso.nombre,
                        credits: curso.creditos || 0,
                        grade: prev && prev.grade !== undefined ? prev.grade : ''
                    });
                }
            }
        });
    });

    calcSaveData();
    calcRenderAuto();
    calcCalculateResult();
}

function calcRenderAuto() {
    const listEl = document.getElementById('calc-auto-list');
    if (calcAutoCourses.length === 0) {
        listEl.innerHTML = `
            <div class="bg-black/30 border border-white/5 rounded-2xl p-6 text-center">
                <p class="text-gray-400 text-sm">No tenés cursos marcados como "Matriculados" o "Cursando" (en color amarillo) en tu Plan de Estudios.</p>
                <button onclick="navigateTo('plan')" class="mt-4 px-6 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-xl transition-all font-bold text-sm border border-yellow-500/20 flex items-center justify-center gap-2 mx-auto">
                    Ir a Mi Plan
                </button>
            </div>
        `;
        return;
    }

    listEl.innerHTML = calcAutoCourses.map((c, index) => `
        <div class="flex flex-col sm:flex-row gap-3 bg-zinc-900 border border-white/10 rounded-2xl p-4 items-start sm:items-center transition-all hover:border-yellow-500/30 group">
            <div class="flex-1 w-full">
                <p class="text-white font-bold text-sm line-clamp-1 group-hover:text-yellow-400 transition-colors">${c.name}</p>
                <p class="text-gray-500 text-xs mt-0.5 font-medium">${c.credits} Créditos · ${c.id}</p>
            </div>
            <div class="w-full sm:w-32 flex-shrink-0">
                <div class="relative">
                    <input type="number" step="0.5" min="0" max="10" placeholder="Nota"
                        value="${c.grade}"
                        oninput="calcUpdateAutoGrade(${index}, this.value)"
                        onchange="calcFormatGradeInput(this, 'auto', ${index})"
                        class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all font-bold text-center">
                </div>
            </div>
        </div>
    `).join('');
    
    if (window.lucide) lucide.createIcons();
}

function calcUpdateAutoGrade(index, value) {
    let val = parseFloat(value);
    calcAutoCourses[index].grade = isNaN(val) ? '' : val;
    calcSaveData();
    calcCalculateResult();
}

// ==========================================
// MODO MANUAL LIBRE
// ==========================================

function getAvailableCoursesHTML(selectedIndexStr) {
    if (typeof CARRERAS === 'undefined') return '<option value="">Cargando catálogo...</option>';
    
    // Obtener carreras activas del perfil, si no hay usar todas
    let activeCareers = [];
    const profile = window.supaAuth?.getCurrentProfile();
    if (profile && profile.selected_carreras && profile.selected_carreras.length > 0) {
        activeCareers = profile.selected_carreras;
    } else {
        activeCareers = Object.keys(CARRERAS);
    }

    let html = '<option value="">-- Seleccionar curso... --</option>';
    
    activeCareers.forEach(carreraId => {
        const carrera = CARRERAS[carreraId];
        if (!carrera) return;
        
        html += `<optgroup label="${carrera.nombre}">`;
        
        // Agrupar por nivel es un buen detalle visual (opcional)
        carrera.cursos.forEach(curso => {
            // El valor será un string con la data
            const val = `${curso.codigo}::${curso.nombre}::${curso.creditos}`;
            const isSelected = selectedIndexStr === val ? 'selected' : '';
            html += `<option value="${val}" ${isSelected}>${curso.codigo} - ${curso.nombre} (${curso.creditos} CR)</option>`;
        });
        
        html += `</optgroup>`;
    });

    html += `<optgroup label="Otros">
        <option value="CUSTOM" ${selectedIndexStr === 'CUSTOM' ? 'selected' : ''}>+ Curso Personalizado</option>
    </optgroup>`;

    return html;
}

function calcAddManualRow() {
    calcManualCourses.push({
        id: Date.now().toString(),
        selectedCourseVal: '',
        name: '',
        credits: 3,
        grade: ''
    });
    calcSaveData();
    calcRenderManual();
    calcCalculateResult();
}

function calcRemoveManualRow(index) {
    calcManualCourses.splice(index, 1);
    if (calcManualCourses.length === 0) {
        calcAddManualRow(); // Mantener al menos una fila
    } else {
        calcSaveData();
        calcRenderManual();
        calcCalculateResult();
    }
}

function calcUpdateManualSelect(index, valStr) {
    const c = calcManualCourses[index];
    c.selectedCourseVal = valStr;

    if (valStr && valStr !== 'CUSTOM') {
        const parts = valStr.split('::'); // codigo::nombre::creditos
        c.name = parts[1];
        c.credits = parseInt(parts[2]) || 0;
    } else if (valStr === 'CUSTOM') {
        c.name = '';
        c.credits = 3;
    } else {
        c.name = '';
        c.credits = 0;
    }

    calcSaveData();
    calcRenderManual();
    calcCalculateResult();
}

function calcUpdateManual(index, field, value) {
    if (field === 'name') {
        calcManualCourses[index].name = value;
    } else {
        let val = parseFloat(value);
        calcManualCourses[index][field] = isNaN(val) ? '' : val;
    }
    calcSaveData();
    calcCalculateResult();
}

function calcRenderManual() {
    const listEl = document.getElementById('calc-manual-list');
    
    listEl.innerHTML = calcManualCourses.map((c, index) => {
        const showCustomInput = c.selectedCourseVal === 'CUSTOM';
        
        return `
        <div class="flex flex-col gap-3 bg-zinc-900 border border-white/10 rounded-2xl p-4 transition-all hover:border-yellow-500/30 group relative">
            <button onclick="calcRemoveManualRow(${index})" class="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-full transition-all border border-white/10 hover:border-red-500/20 z-10">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
            
            <div class="w-full flex flex-col gap-2">
                <select onchange="calcUpdateManualSelect(${index}, this.value)" class="w-full bg-black/50 text-white text-sm font-bold border border-white/10 rounded-xl p-3 outline-none focus:border-yellow-500/50 cursor-pointer">
                    ${getAvailableCoursesHTML(c.selectedCourseVal)}
                </select>

                ${showCustomInput ? `
                <input type="text" placeholder="Nombre de la actividad/curso"
                    value="${c.name}"
                    oninput="calcUpdateManual(${index}, 'name', this.value)"
                    class="w-full bg-transparent border-b border-white/10 text-white font-bold text-sm px-2 py-2 focus:outline-none focus:border-yellow-500/50 mt-1 placeholder:text-gray-600 transition-colors">
                ` : ''}
            </div>

            <div class="flex gap-2 w-full mt-1">
                <div class="flex-1 flex flex-col">
                    <label class="text-[10px] text-gray-500 uppercase font-black ml-1 mb-1">Créditos</label>
                    <input type="number" min="0" max="10" placeholder="CR"
                        value="${c.credits}"
                        oninput="calcUpdateManual(${index}, 'credits', this.value)"
                        ${c.selectedCourseVal && c.selectedCourseVal !== 'CUSTOM' ? 'disabled' : ''}
                        class="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all font-bold text-center disabled:opacity-50">
                </div>
                
                <div class="flex-1 flex flex-col">
                    <label class="text-[10px] text-gray-500 uppercase font-black ml-1 mb-1">Nota</label>
                    <input type="number" step="0.5" min="0" max="10" placeholder="Nota"
                        value="${c.grade}"
                        oninput="calcUpdateManual(${index}, 'grade', this.value)"
                        onchange="calcFormatGradeInput(this, 'manual', ${index})"
                        class="w-full bg-yellow-500/10 border border-yellow-500/30 focus:border-yellow-500 rounded-xl px-3 py-2.5 text-sm text-white font-black focus:outline-none transition-all text-center">
                </div>
            </div>
        </div>
    `}).join('');
    
    if (window.lucide) lucide.createIcons();
}

// ==========================================
// FORMATEO Y CÁLCULO MATEMÁTICO PONDERADO
// ==========================================

function calcFormatGradeInput(inputEl, mode, index) {
    let val = parseFloat(inputEl.value);
    if (!isNaN(val)) {
        if (val < 0) val = 0;
        if (val > 10) val = 10;
        // Redondear a la mitad más cercana (.0 o .5)
        val = Math.round(val * 2) / 2;
        inputEl.value = val;
        
        if (mode === 'auto') {
            calcAutoCourses[index].grade = val;
        } else {
            calcManualCourses[index].grade = val;
        }
        calcSaveData();
        calcCalculateResult();
    }
}

function calcCalculateResult() {
    const courses = calcCurrentMode === 'auto' ? calcAutoCourses : calcManualCourses;
    
    let totalCredits = 0;
    let totalScore = 0;
    let hasSub5 = false;

    courses.forEach(c => {
        // Solo considerar cursos que tengan nota y créditos válidos
        if (c.grade !== '' && c.grade !== null && c.credits > 0) {
            totalCredits += c.credits;
            
            let finalGrade = c.grade;
            // Regla UCR: Notas inferiores a 5 se calculan como 5 en el ponderado
            if (finalGrade < 5) {
                finalGrade = 5;
                hasSub5 = true;
            }
            totalScore += (finalGrade * c.credits);
        }
    });

    const average = totalCredits > 0 ? (totalScore / totalCredits) : 0;

    document.getElementById('calc-result-grade').textContent = average.toFixed(2);
    document.getElementById('calc-result-credits').textContent = totalCredits;
    
    // Mostrar u ocultar mensaje de redondeo inferior a 5
    let noticeEl = document.getElementById('calc-sub5-notice');
    if (hasSub5) {
        if (!noticeEl) {
            noticeEl = document.createElement('div');
            noticeEl.id = 'calc-sub5-notice';
            noticeEl.className = 'text-xs text-yellow-400 font-bold mt-3 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl inline-flex items-center justify-center gap-2 max-w-[90%] mx-auto z-10 shadow-lg';
            noticeEl.innerHTML = '<i data-lucide="info" class="w-4 h-4"></i> Nota < 5.0 calculada como 5.0 por Reglamento UCR';
            document.querySelector('#calculator-section .bg-gradient-to-br').appendChild(noticeEl);
            if (window.lucide) lucide.createIcons();
        } else {
            noticeEl.classList.remove('hidden');
        }
    } else {
        if (noticeEl) noticeEl.classList.add('hidden');
    }
}

// ==========================================
// HISTORIAL SEMESTRAL (SUPABASE)
// ==========================================

let calcHistoryData = [];

async function calcLoadSemesters() {
    const session = window.supaAuth?.getCurrentSession();
    if (!session) return;

    try {
        const { data, error } = await window.supaAuth.supabase
            .from('user_semesters')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        calcHistoryData = data || [];
        calcRenderHistory(calcHistoryData);
    } catch (err) {
        console.error("Error cargando historial de promedios:", err);
    }
}

function calcRenderHistory(historyList) {
    const container = document.getElementById('calc-history-list');
    if (!container) return;

    if (historyList.length === 0) {
        container.innerHTML = `
            <div class="text-center p-6 text-sm text-gray-500 bg-black/30 border border-white/5 rounded-2xl md:col-span-2">
                No tienes historiales guardados aún.
            </div>`;
        return;
    }

    container.innerHTML = historyList.map(h => `
        <div onclick="calcOpenHistoryDetail('${h.id}')" class="bg-zinc-900 border border-white/10 rounded-2xl p-5 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all flex flex-col gap-3 group relative cursor-pointer">
            <button onclick="event.stopPropagation(); calcDeleteSemester('${h.id}')" class="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-2 z-10 rounded-lg hover:bg-white/5">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="text-white font-black text-lg">${h.semester_name}</h4>
                    <p class="text-yellow-500 text-xs font-bold uppercase tracking-wider">${h.semester_year}</p>
                </div>
                <div class="text-right">
                    <div class="text-3xl font-black text-white">${Number(h.gpa).toFixed(2)}</div>
                    <p class="text-[10px] text-gray-500 font-bold uppercase">Promedio</p>
                </div>
            </div>
            
            <div class="mt-2 pt-3 border-t border-white/5">
                <p class="text-gray-400 text-xs font-medium mb-2">${h.total_credits} Créditos Totales • ${h.courses_json ? h.courses_json.length : 0} Cursos</p>
                <div class="flex flex-wrap gap-1">
                    ${(h.courses_json || []).slice(0, 3).map(c => `<span class="bg-white/5 text-gray-300 text-[10px] px-2 py-1 rounded-md border border-white/5 line-clamp-1 max-w-[150px]">${c.name} (${c.grade})</span>`).join('')}
                    ${(h.courses_json && h.courses_json.length > 3) ? `<span class="bg-white/5 text-gray-400 text-[10px] px-2 py-1 rounded-md border border-white/5">+${h.courses_json.length - 3} más</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    if (window.lucide) lucide.createIcons();
}

function calcOpenHistoryDetail(id) {
    const h = calcHistoryData.find(x => x.id === id);
    if (!h) return;

    document.getElementById('calc-detail-title').innerHTML = `<span data-lucide="calendar" class="w-5 h-5 text-yellow-500 inline-block"></span> ${h.semester_name}`;
    document.getElementById('calc-detail-year').textContent = h.semester_year;
    document.getElementById('calc-detail-gpa').textContent = Number(h.gpa).toFixed(2);
    document.getElementById('calc-detail-credits').textContent = h.total_credits;

    const coursesContainer = document.getElementById('calc-detail-courses');
    const courses = h.courses_json || [];
    
    if (courses.length === 0) {
        coursesContainer.innerHTML = '<p class="text-gray-500 text-sm text-center py-4">No hay cursos registrados en este semestre.</p>';
    } else {
        coursesContainer.innerHTML = courses.map(c => `
            <div class="bg-black/30 border border-white/5 rounded-xl p-4 flex justify-between items-center">
                <div>
                    <p class="text-white font-bold text-sm">${c.name}</p>
                    <p class="text-gray-500 text-xs font-medium mt-0.5">${c.credits} Créditos</p>
                </div>
                <div class="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-black px-3 py-1.5 rounded-lg">
                    ${Number(c.grade).toFixed(1)}
                </div>
            </div>
        `).join('');
    }

    // Configurar el botón de eliminar del modal
    const delBtn = document.getElementById('calc-btn-delete-history');
    delBtn.onclick = () => {
        calcDeleteSemester(id);
    };

    document.getElementById('calc-history-detail-modal').classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
}

async function calcConfirmSaveSemester() {
    const session = window.supaAuth?.getCurrentSession();
    if (!session) {
        alert("Debes iniciar sesión para guardar tu historial.");
        return;
    }

    const nameInput = document.getElementById('calc-save-name');
    const yearInput = document.getElementById('calc-save-year');
    
    if (!nameInput.value.trim() || !yearInput.value.trim()) {
        alert("Por favor ingresa un nombre de semestre y un año.");
        return;
    }

    const courses = calcCurrentMode === 'auto' ? calcAutoCourses : calcManualCourses;
    const validCourses = courses.filter(c => c.grade !== '' && c.grade !== null && c.credits > 0);
    
    if (validCourses.length === 0) {
        alert("No hay cursos con notas válidas para guardar.");
        return;
    }

    let totalCredits = 0;
    let totalScore = 0;

    const mappedCourses = validCourses.map(c => {
        totalCredits += c.credits;
        let finalGrade = c.grade;
        if (finalGrade < 5) finalGrade = 5;
        totalScore += (finalGrade * c.credits);
        
        return {
            name: c.name || 'Personalizado',
            credits: c.credits,
            grade: c.grade
        };
    });

    const average = totalCredits > 0 ? (totalScore / totalCredits) : 0;
    const btn = document.getElementById('calc-btn-save-confirm');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Guardando...';
    btn.disabled = true;

    try {
        const { error } = await window.supaAuth.supabase.from('user_semesters').insert([{
            user_id: session.user.id,
            semester_name: nameInput.value.trim(),
            semester_year: yearInput.value.trim(),
            gpa: average,
            total_credits: totalCredits,
            courses_json: mappedCourses
        }]);

        if (error) throw error;
        
        document.getElementById('calc-save-modal').classList.add('hidden');
        nameInput.value = '';
        
        // Recargar el historial
        await calcLoadSemesters();
        
    } catch (err) {
        console.error("Error al guardar semestre:", err);
        alert("Hubo un error al guardar tu historial.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
        if (window.lucide) lucide.createIcons();
    }
}

async function calcDeleteSemester(id) {
    if (!confirm("¿Seguro que deseas eliminar este registro histórico?")) return;
    
    try {
        const { error } = await window.supaAuth.supabase
            .from('user_semesters')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        
        document.getElementById('calc-history-detail-modal').classList.add('hidden');
        await calcLoadSemesters();
    } catch (err) {
        console.error("Error al borrar historial:", err);
        alert("No se pudo borrar el historial.");
    }
}

// ==========================================
// COMBINAR HISTORIALES (PONDERADO ANUAL)
// ==========================================

function calcOpenCombineModal() {
    if (calcHistoryData.length === 0) {
        alert("No tenés historiales guardados para combinar.");
        return;
    }

    const listEl = document.getElementById('calc-combine-list');
    listEl.innerHTML = calcHistoryData.map(h => `
        <label class="flex items-center gap-4 p-4 bg-black/30 border border-white/5 rounded-xl cursor-pointer hover:border-yellow-500/30 transition-all has-[:checked]:border-yellow-500/60 has-[:checked]:bg-yellow-500/10">
            <input type="checkbox" value="${h.id}" class="w-5 h-5 accent-yellow-500 combine-checkbox">
            <div class="flex-1">
                <p class="text-white font-bold text-sm">${h.semester_name} - ${h.semester_year}</p>
                <p class="text-gray-500 text-xs mt-0.5">${h.total_credits} CR · ${h.courses_json ? h.courses_json.length : 0} Cursos</p>
            </div>
            <div class="text-right">
                <p class="text-yellow-500 font-black text-lg">${Number(h.gpa).toFixed(2)}</p>
            </div>
        </label>
    `).join('');

    document.getElementById('calc-combine-modal').classList.remove('hidden');
}

function calcConfirmCombine() {
    const checkboxes = document.querySelectorAll('.combine-checkbox:checked');
    if (checkboxes.length === 0) {
        alert("Seleccioná al menos un historial para combinar.");
        return;
    }

    let combinedCourses = [];

    checkboxes.forEach(cb => {
        const id = cb.value;
        const h = calcHistoryData.find(x => x.id === id);
        if (h && h.courses_json) {
            combinedCourses = combinedCourses.concat(h.courses_json);
        }
    });

    if (combinedCourses.length === 0) {
        alert("No se encontraron cursos válidos en los historiales seleccionados.");
        return;
    }

    // Transformar los cursos combinados al formato de Modo Manual Libre
    calcManualCourses = combinedCourses.map((c, index) => ({
        id: Date.now().toString() + index,
        selectedCourseVal: 'CUSTOM', // Como es combinado, lo dejamos en CUSTOM para que se vea el nombre
        name: c.name,
        credits: c.credits,
        grade: c.grade
    }));

    calcSaveData();
    document.getElementById('calc-combine-modal').classList.add('hidden');
    
    // Cambiar a la pestaña de Modo Manual para que el usuario lo vea
    calcSwitchTab('manual');
    
    // Opcionalmente, hacer un scroll arriba suave
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Exponer la carga inicial para cuando se navegue a la calculadora
document.addEventListener('DOMContentLoaded', () => {
    // Escuchar el evento de carga del estado en app.js para inicializar la auto carga
    setTimeout(() => {
        calcLoadAuto(); // Intenta cargar los automáticos y los guardados en local
        calcLoadSemesters(); // Cargar el historial desde Supabase
    }, 1500);
});
