-- Corrección para limpiar los requisitos que quedaron como ['{}'] en Supabase
-- Ejecutar en Supabase Dashboard > SQL Editor

UPDATE public.courses_catalog
SET requisitos = ARRAY[]::text[]
WHERE array_length(requisitos, 1) = 1 
  AND requisitos[1] = '{}';

-- Verificar el resultado:
-- SELECT carrera_id, codigo, nombre, requisitos FROM public.courses_catalog WHERE array_length(requisitos, 1) = 0 LIMIT 10;
