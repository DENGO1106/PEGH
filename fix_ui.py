import re

# 1. FIX INDEX.HTML
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add anti-flicker script in head
anti_flicker = """
  <!-- PREVENIR LAGASO / FLICKER -->
  <script>
    const lastPage = localStorage.getItem('ucr_last_page') || 'login';
    document.documentElement.setAttribute('data-initial-page', lastPage);
  </script>
  <style>
    html[data-initial-page] .tab-content { display: none !important; }
    html[data-initial-page="home"] #home-section { display: flex !important; }
    html[data-initial-page="plan"] #plan-section { display: block !important; }
    html[data-initial-page="horario"] #horarios-section { display: block !important; }
    html[data-initial-page="calculator"] #calculator-section { display: flex !important; }
    html[data-initial-page="login"] #login-section { display: flex !important; }
  </style>
"""
if "data-initial-page" not in html:
    html = html.replace('</title>', '</title>\n' + anti_flicker)

# Add hidden to home section just in case
if 'id="home-section"\n    class="tab-content flex' in html:
    html = html.replace('id="home-section"\n    class="tab-content flex', 'id="home-section"\n    class="tab-content hidden flex')

# Replace hardcoded checkboxes with empty container
html = re.sub(
    r'<div class="space-y-4 mb-8">.*?</label>\s*</div>',
    '<div id="career-selection-list" class="space-y-4 mb-8"></div>',
    html,
    flags=re.DOTALL
)

# Replace hardcoded tabs with empty container
html = re.sub(
    r'<div class="carrera-tabs">.*?</div>',
    '<div class="carrera-tabs" id="carrera-tabs-container"></div>',
    html,
    flags=re.DOTALL
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

# 2. FIX APP.JS
with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# In navigateTo, remove data-initial-page
if "document.documentElement.removeAttribute('data-initial-page');" not in js:
    js = js.replace(
        "document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));",
        "document.documentElement.removeAttribute('data-initial-page');\n    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));"
    )

# Add dynamic rendering in inicializar()
dynamic_render = """
    // Generar UI dinámicamente desde CARRERAS
    const selectionList = document.getElementById('career-selection-list');
    const tabsContainer = document.getElementById('carrera-tabs-container');
    if (selectionList) selectionList.innerHTML = '';
    if (tabsContainer) tabsContainer.innerHTML = '';

    Object.keys(CARRERAS).forEach(cId => {
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
    });
"""

if "Generar UI dinámicamente desde CARRERAS" not in js:
    js = js.replace(
        "cargarEstado();",
        "cargarEstado();\n" + dynamic_render
    )
    
    # Also we need to remove the old hardcoded listeners for tab-btn in app.js
    js = re.sub(
        r"document\.querySelectorAll\('\.tab-btn'\)\.forEach\(btn => \{\s*btn\.addEventListener\('click', \(\) => cambiarCarrera\(btn\.dataset\.carrera\)\);\s*\}\);",
        "// Event listeners for tab-btn are now attached dynamically",
        js
    )

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("UI Fixed successfully!")
