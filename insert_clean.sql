-- INSERT UTF-8 LIMPIO (generado por gen_insert.js)
-- Carreras: Actuariales, Farmacia, Ing.Quimica, Economia, Medicina, Microbiologia
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) VALUES

ON CONFLICT (carrera_id, codigo) DO UPDATE SET nombre=EXCLUDED.nombre;
