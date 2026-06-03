#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera insert_clean.sql con UTF-8 puro leyendo directamente data.js via Node.js
"""
import subprocess, json, sys, os

# Usar node para extraer los datos de CARRERAS directamente desde data.js
node_script = r"""
const fs = require('fs');
let content = fs.readFileSync('data.js', 'utf8');
if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
// Extraer CARRERAS como objeto JSON
const code = content
    .split('const DATA_ESTADOS')[0]
    .replace('const CARRERAS =', 'var CARRERAS =');
eval(code);
const skip = ['ingenieriaIndustrial','contaduriaPublica','direccionEmpresas'];
const result = {};
Object.keys(CARRERAS).forEach(cId => {
    if (skip.includes(cId)) return;
    result[cId] = CARRERAS[cId].cursos.map(c => ({
        carrera_id: cId,
        codigo: c.codigo,
        nombre: c.nombre,
        creditos: c.creditos,
        nivel: c.nivel,
        requisitos: c.requisitos
    }));
});
process.stdout.write(JSON.stringify(result));
"""

result = subprocess.run(
    ['node', '-e', node_script],
    capture_output=True,
    text=True,
    encoding='utf-8',
    cwd=os.path.dirname(os.path.abspath(__file__))
)

if result.returncode != 0:
    print("ERROR en Node:", result.stderr, file=sys.stderr)
    sys.exit(1)

data = json.loads(result.stdout)
rows = []
for cId, cursos in data.items():
    for c in cursos:
        nombre = c['nombre'].replace("'", "''")
        codigo = c['codigo'].replace("'", "''")
        if c['requisitos']:
            reqs = ','.join(f"'{r}'" for r in c['requisitos'])
            req_sql = f"ARRAY[{reqs}]"
        else:
            req_sql = "'{}'"
        rows.append(f"('{cId}','{codigo}','{nombre}',{c['creditos']},{c['nivel']},{req_sql})")

sql = (
    "-- INSERT LIMPIO (generado con Python UTF-8 puro)\n"
    "-- Carreras: Actuariales, Farmacia, Ing.Quimica, Economia, Medicina, Microbiologia\n"
    "INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) VALUES\n"
    + ",\n".join(rows)
    + "\nON CONFLICT (carrera_id, codigo) DO UPDATE SET nombre=EXCLUDED.nombre;\n"
)

with open('insert_clean.sql', 'w', encoding='utf-8', newline='\n') as f:
    f.write(sql)

print(f"OK: {len(rows)} cursos exportados a insert_clean.sql")
