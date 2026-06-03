const fs = require('fs');
let content = fs.readFileSync('data.js', 'utf8');
if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
const code = content.split('const DATA_ESTADOS')[0].replace('const CARRERAS =', 'var CARRERAS =');
eval(code);
const skip = ['ingenieriaIndustrial', 'contaduriaPublica', 'direccionEmpresas'];
const rows = [];
Object.keys(CARRERAS).forEach(cId => {
    if (skip.includes(cId)) return;
    CARRERAS[cId].cursos.forEach(c => {
        const nombre = c.nombre.replace(/'/g, "''");
        const reqs = c.requisitos.length > 0
            ? 'ARRAY[' + c.requisitos.map(r => "'" + r + "'").join(',') + ']'
            : "'{}'";
        rows.push("('" + cId + "','" + c.codigo + "','" + nombre + "'," + c.creditos + "," + c.nivel + "," + reqs + ")");
    });
});
const sql =
    '-- INSERT UTF-8 LIMPIO (generado por gen_insert.js)\n' +
    '-- Carreras: Actuariales, Farmacia, Ing.Quimica, Economia, Medicina, Microbiologia\n' +
    'INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) VALUES\n' +
    rows.join(',\n') +
    '\nON CONFLICT (carrera_id, codigo) DO UPDATE SET nombre=EXCLUDED.nombre;\n';
fs.writeFileSync('insert_clean.sql', sql, { encoding: 'utf8' });
console.log('OK: ' + rows.length + ' cursos exportados');
