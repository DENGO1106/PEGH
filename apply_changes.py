import re

# ==========================================
# 1. Update data.js with faculties
# ==========================================

faculties = {
    'ingenieriaIndustrial': 'Facultad de Ingeniería',
    'contaduriaPublica': 'Facultad de Ciencias Económicas',
    'direccionEmpresas': 'Facultad de Ciencias Económicas',
    'cienciasActuariales': 'Facultad de Ciencias Básicas',
    'farmacia': 'Facultad de Farmacia',
    'ingenieriaQuimica': 'Facultad de Ingeniería',
    'economia': 'Facultad de Ciencias Económicas',
    'medicina': 'Facultad de Medicina',
    'microbiologia': 'Facultad de Microbiología',
    'ingenieriaCivil': 'Facultad de Ingeniería',
    'administracionPublica': 'Facultad de Ciencias Económicas',
    'arquitectura': 'Facultad de Ingeniería',
    'computadoras_redes': 'Facultad de Ingeniería',
    'electronica_telecomunicaciones': 'Facultad de Ingeniería',
    'sistemas_energia': 'Facultad de Ingeniería',
    'licenciatura_electrica': 'Facultad de Ingeniería',
    'estadistica': 'Facultad de Ciencias Económicas', # wait, UCR statistics is usually Ciencias Económicas
    'geologia': 'Facultad de Ciencias Básicas',
    'ingenieriaTopografica': 'Facultad de Ingeniería',
    'odontologia': 'Facultad de Odontología',
    'odontologiaLic': 'Facultad de Odontología',
    'nutricion': 'Facultad de Medicina'
}

with open('data.js', 'r', encoding='utf-8') as f:
    data_content = f.read()

for cid, fac in faculties.items():
    # regex to inject facultad into the object
    pattern = rf"({cid}:\s*{{.*?)(\s*cursos:\s*\[\]\s*}})"
    # We check if it already has facultad
    if "facultad:" not in re.search(rf"{cid}: {{.*}}", data_content).group(0):
        data_content = re.sub(pattern, rf"\1, facultad: '{fac}' \2", data_content)

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(data_content)


# ==========================================
# 2. Update app.js 
# ==========================================

with open('app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()


# A) Fix Requisitos ['{}'] in cargarCursosDeSupabase
pattern_req = r"(requisitos:\s*c\.requisitos\s*\|\|\s*\[\],)"
if "c.requisitos[0] !== '{}'" not in app_content:
    app_content = re.sub(
        pattern_req, 
        r"requisitos: (c.requisitos && c.requisitos[0] !== '{}') ? c.requisitos : [],", 
        app_content
    )


# B) UI Random colors & Grouping by Faculty
dynamic_ui_logic_old = """    Object.keys(CARRERAS).forEach(cId => {
        const c = CARRERAS[cId];
        // 1. Checkboxes en el modal
        if (selectionList) {
            const lbl = document.createElement('label');
            lbl.className = "flex items-center gap-4 p-5 bg-zinc-900 border border-white/10 rounded-2xl cursor-pointer hover:border-red-500/40 transition-all has-[:checked]:border-red-500/60 has-[:checked]:bg-red-950/20";
            lbl.innerHTML = `
              <input type="checkbox" value="${cId}" class="carrera-check w-5 h-5 accent-red-600">
              <div class="text-left">
                <div class="text-white font-bold">${c.nombre}</div>
                <div class="text-gray-500 text-xs mt-0.5">${c.descripcion}</div>
              </div>
            `;
            selectionList.appendChild(lbl);
        }
        // 2. Tabs en la vista de plan
        if (tabsContainer) {
            const btn = document.createElement('button');
            btn.className = "tab-btn hidden"; // hidden by default, unhidden by filtrarCarrerasPorPerfil
            btn.dataset.carrera = cId;
            btn.textContent = c.nombre;
            btn.addEventListener('click', () => cambiarCarrera(cId));
            tabsContainer.appendChild(btn);
        }
    });"""

dynamic_ui_logic_new = """    // Agrupación por facultades y colores aleatorios
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
            
            // Título de Facultad
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
    }"""

if "colorPalettes =" not in app_content:
    app_content = app_content.replace(dynamic_ui_logic_old, dynamic_ui_logic_new)

# C) Sincronizar Compartidos Globalmente en cargarEstado
sync_logic = """
/**
 * Busca todos los cursos compartidos y replica el estado más avanzado en todas las carreras.
 */
function sincronizarCompartidosGlobal() {
    let compartidosRevisados = new Set();
    
    // Primero, encontrar el estado más alto para cada código de curso (ej: EG-1)
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

    // Luego, aplicar ese estado más alto a todos los hermanos
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
"""

if "function sincronizarCompartidosGlobal" not in app_content:
    app_content += sync_logic

# Inyectar en cargarEstado(), justo después del forEach que carga de Supabase (esperando que todas las promesas se resuelvan)
# cargarEstado es asíncrona:
# await Promise.all(promesasCursos);
# <-- HERE -->
# const saved = localStorage.getItem(DATA_STORAGE_KEY);
# Actually wait, loading from user_courses in Supabase overwrites local state.
# Let's see the end of cargarEstado...
pattern_cargar_estado_end = r"(// \.\.\. Código de migración local, etc\.\.\.\s*updateOverallProgress\(\);\s*renderizarCarrera\(\);)"
if "sincronizarCompartidosGlobal()" not in app_content:
    app_content = re.sub(
        pattern_cargar_estado_end,
        r"sincronizarCompartidosGlobal();\n    \1",
        app_content
    )


with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_content)

print("Cambios aplicados correctamente.")
