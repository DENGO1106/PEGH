import os
for file in ['02_nuevas_carreras.sql', '01_fix_carreras_corruptas.sql']:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            text = f.read()
        text = text.replace("ARRAY['{}']", "ARRAY[]::text[]")
        with open(file, 'w', encoding='utf-8') as f:
            f.write(text)

with open('03_fix_requisitos_vacios_en_bd.sql', 'w', encoding='utf-8') as f:
    f.write('''-- Corrección para limpiar los requisitos que quedaron como ['{}'] en Supabase
-- Ejecutar en Supabase Dashboard > SQL Editor

UPDATE public.courses_catalog
SET requisitos = ARRAY[]::text[]
WHERE array_length(requisitos, 1) = 1 
  AND requisitos[1] = '{}';

-- Verificar el resultado:
-- SELECT carrera_id, codigo, nombre, requisitos FROM public.courses_catalog WHERE array_length(requisitos, 1) = 0 LIMIT 10;
''')
