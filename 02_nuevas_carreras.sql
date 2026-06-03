-- ============================================================
-- NUEVAS CARRERAS (13) — Extraído y validado desde PDFs
-- Ejecutar en Supabase Dashboard > SQL Editor
-- NOTA: Odontología Lic. fue renombrada de "odontologia" a "odontologiaLic"
-- NOTA: Ing. Eléctrica Lic. usa "licenciatura_electrica" (solo ciclos 9+)
-- ============================================================

-- ============================================================
-- INGENIERÍA CIVIL
-- carrera_id: 'ingenieriaCivil' | Cursos: 57
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, 
requisitos) VALUES
-- CICLO 1
('ingenieriaCivil', 'EG-', 'CURSO DE ARTE', 2, 1, ARRAY[]::text[]),
('ingenieriaCivil', 'EG-I', 'CURSO INTEGRADO DE HUMANIDADES I', 6, 1, ARRAY[]::text[]),
('ingenieriaCivil', 'IC0101', 'TALLER DE INTRODUCCIÓN A LA INGENIERÍA', 3, 1, 
ARRAY['MA0001']),
('ingenieriaCivil', 'MA0001', 'PRECÁLCULO', 0, 1, ARRAY[]::text[]),
('ingenieriaCivil', 'MA1001', 'CÁLCULO I', 3, 1, ARRAY['MA0001']),
('ingenieriaCivil', 'RP-1', 'REPERTORIO', 3, 1, ARRAY[]::text[]),

-- CICLO 2
('ingenieriaCivil', 'EF-', 'ACTIVIDAD DEPORTIVA', 0, 2, ARRAY['EG-I']),
('ingenieriaCivil', 'EG-II', 'CURSO INTEGRADO DE HUMANIDADES II', 6, 2, ARRAY['EG-I']),
('ingenieriaCivil', 'FS0210', 'FÍSICA GENERAL I', 3, 2, ARRAY['MA1001']),
('ingenieriaCivil', 'FS0211', 'LABORATORIO DE FÍSICA GENERAL I', 1, 2, 
ARRAY['MA1001', 'FS0210']),
('ingenieriaCivil', 'MA1002', 'CÁLCULO II', 4, 2, ARRAY['MA1001']),
('ingenieriaCivil', 'OPT1125', 'BLOQUE DE TRANSICIÓN DE QUÍMICA', 5, 2, ARRAY[]::text[]),

-- CICLO 3
('ingenieriaCivil', 'C10202', 'PRINCIPIOS DE INFORMÁTICA', 4, 3, ARRAY['MA1001']),
('ingenieriaCivil', 'FS0310', 'FÍSICA GENERAL II', 3, 3, ARRAY['FS0210', 'FS0211', 'MA1002']),
('ingenieriaCivil', 'FS0311', 'LABORATORIO DE FÍSICA GENERAL II', 1, 3, 
ARRAY['FS0210', 'FS0211', 'MA1002', 'FS0310']),
('ingenieriaCivil', 'IC0302', 'DISEÑO GRÁFICO', 3, 3, ARRAY['FS0210', 'IC0101', 'MA1002']),
('ingenieriaCivil', 'MA1003', 'CÁLCULO III', 4, 3, ARRAY['MA1002']),
('ingenieriaCivil', 'MA1004', 'ÁLGEBRA LINEAL', 3, 3, ARRAY[]::text[]),

-- CICLO 4
('ingenieriaCivil', 'FS0410', 'FÍSICA GENERAL III', 3, 4, ARRAY['FS0310', 'FS0311', 'MA1003']),
('ingenieriaCivil', 'FS0411', 'LABORATORIO DE FÍSICA GENERAL III', 1, 4, 
ARRAY['FS0310', 'FS0311', 'MA1003', 'FS0410']),
('ingenieriaCivil', 'IC0401', 'ESTÁTICA', 4, 4, ARRAY['FS0310', 'IC0302', 'MA1003']),
('ingenieriaCivil', 'IC0403', 'COMUNICACIÓN TÉCNICA', 3, 4, ARRAY['IC0302']),
('ingenieriaCivil', 'IC0410', 'SEMINARIO DE ÉTICA, INGENIERÍA Y SOCIEDAD', 1, 4, 
ARRAY['IC0302', 'IC0403']),
('ingenieriaCivil', 'IT0001', 'FUNDAMENTOS DE INGENIERÍA TOPOGRÁFICA', 3, 4, 
ARRAY['FS0310', 'IC0302']),
('ingenieriaCivil', 'MA1005', 'ECUACIONES DIFERENCIALES', 4, 4, ARRAY['MA1002', 'MA1004']),

-- CICLO 5
('ingenieriaCivil', 'IC0502', 'DINÁMICA', 3, 5, ARRAY['FS0410', 'IC0401', 'MA1005']),
('ingenieriaCivil', 'IC0510', 'MECÁNICA DEL SÓLIDO I', 4, 5, ARRAY['IC0401', 'MA1005']),
('ingenieriaCivil', 'MA1006', 'INTRODUCCIÓN AL ANÁLISIS NUMÉRICO', 5, 5, 
ARRAY['C10202', 'MA1005']),
('ingenieriaCivil', 'OPT1126', 'BLOQUE DE TRANSICIÓN DE ESTADÍSTICA', 3, 5, ARRAY[]::text[]),
('ingenieriaCivil', 'XE0156', 'INTRODUCCIÓN A LA ECONOMÍA', 4, 5, ARRAY[]::text[]),

-- CICLO 6
('ingenieriaCivil', 'IC0604', 'MATERIALES DE CONSTRUCCIÓN', 3, 6, ARRAY['IC0510']),
('ingenieriaCivil', 'IC0605', 'MECÁNICA DE FLUIDOS', 3, 6, 
ARRAY['IC0510', 'IC0502', 'MA1006']),
('ingenieriaCivil', 'IC0607', 'TALLER DE SISTEMAS DE INGENIERÍA', 4, 6, 
ARRAY['IC0403', 'IC0410', 'IC0502', 'IC0510', 'MA1006', 'IC0811']),
('ingenieriaCivil', 'IC0811', 'ADMINISTRACIÓN EN INGENIERÍA', 3, 6, ARRAY['XE0156']),
('ingenieriaCivil', 'OPT1122', 'BLOQUE MECÁNICA DE SÓLIDOS', 3, 6, ARRAY[]::text[]),
('ingenieriaCivil', 'SR-I', 'SEMINARIO DE REALIDAD NACIONAL I', 2, 6, ARRAY['EG-II']),

-- CICLO 7
('ingenieriaCivil', 'IC0701', 'ANÁLISIS ESTRUCTURAL', 3, 7, ARRAY['OPT1122']),
('ingenieriaCivil', 'IC0703', 'MECÁNICA DE SUELOS', 4, 7, 
ARRAY['IC0604', 'IC0605', 'OPT1122']),
('ingenieriaCivil', 'IC0704', 'MÉTODOS CONSTRUCTIVOS I', 3, 7, ARRAY['IC0604', 'IT0001']),
('ingenieriaCivil', 'IC0709', 'HIDRÁULICA GENERAL', 3, 7, ARRAY['IC0605']),
('ingenieriaCivil', 'IC0711', 'TRANSPORTES', 3, 7, ARRAY['IC0607']),
('ingenieriaCivil', 'IC0712', 'FUNDAMENTOS DE INGENIERÍA AMBIENTAL', 3, 7, 
ARRAY['IC0605']),

-- CICLO 8
('ingenieriaCivil', 'IC0801', 'CONCRETO REFORZADO', 3, 8, ARRAY['IC0604', 'IC0701']),
('ingenieriaCivil', 'IC0804', 'PROGRAMACIÓN Y PRESUPUESTACIÓN DE OBRA', 3, 8, 
ARRAY['IC0704', 'IC0811']),
('ingenieriaCivil', 'IC0808', 'HIDROLOGÍA', 3, 8, ARRAY['IC0709', 'IC0712', 'IT0001']),
('ingenieriaCivil', 'IC0809', 'INGENIERÍA GEOTÉCNICA', 3, 8, ARRAY['IC0703']),
('ingenieriaCivil', 'IC0810', 'DISEÑO VIAL', 3, 8, ARRAY['IC0703', 'IC0711', 'IT0001']),
('ingenieriaCivil', 'IC1006', 'ANÁLISIS DE IMPACTO AMBIENTAL', 3, 8, ARRAY['IC0712']),

-- CICLO 9
('ingenieriaCivil', 'IC0905', 'TALLER DE DISEÑO', 4, 9, 
ARRAY['IC0801', 'IC0804', 'IC0808', 'IC0809', 'IC0810', 'IC1006']),
('ingenieriaCivil', 'OPT1119', 'OPTATIVOS DE INGENIERÍA CIVIL', 9, 9, ARRAY[]::text[]),
('ingenieriaCivil', 'SR-II', 'SEMINARIO DE REALIDAD NACIONAL II', 2, 9, ARRAY['SR-I']),

-- CICLO 10
('ingenieriaCivil', 'OPT1123', 'BLOQUE 0', 12, 10, ARRAY[]::text[]),

-- CICLO 11
('ingenieriaCivil', 'IC9500', 'INVESTIGACIÓN DIRIGIDA 1', 0, 11, ARRAY[]::text[]),
('ingenieriaCivil', 'IC9501', 'INVESTIGACIÓN DIRIGIDA 2', 0, 11, ARRAY[]::text[]),
('ingenieriaCivil', 'IC9502', 'INVESTIGACIÓN DIRIGIDA 3', 0, 11, ARRAY[]::text[]),
('ingenieriaCivil', 'IC9600', 'SEMINARIO DE GRADUACIÓN 1', 0, 11, ARRAY[]::text[]),
('ingenieriaCivil', 'IC9601', 'SEMINARIO DE GRADUACIÓN II', 0, 11, ARRAY[]::text[])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- ADMINISTRACIÓN PÚBLICA
-- carrera_id: 'administracionPublica' | Cursos: 64
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) 
VALUES
-- I CICLO
('administracionPublica', 'EG-1', 'Curso Integrado de Humanidades I', 6, 1, ARRAY[]::text[]),
('administracionPublica', 'LM0348', 'Inglés para Administración y Comercio I', 3, 1, ARRAY[]::text[]),
('administracionPublica', 'MA0001', 'Precálculo', 0, 1, ARRAY[]::text[]),
('administracionPublica', 'XP0450', 'Teoría del Estado Contemporáneo', 3, 1, ARRAY[]::text[]),
('administracionPublica', 'XP0452', 'Teorías y Modelos Organizacionales', 3, 1, ARRAY[]::text[]),
('administracionPublica', 'XP0453', 'Taller de Comunicación Administrativa y Académica', 2, 
1, ARRAY[]::text[]),

-- II CICLO
('administracionPublica', 'EF-', 'Actividad Deportiva', 0, 2, ARRAY[]::text[]),
('administracionPublica', 'EG-II', 'Curso Integrado de Humanidades II', 6, 2, 
ARRAY['EG-1']),
('administracionPublica', 'MA1021', 'Cálculo para Ciencias Económicas I', 4, 2, 
ARRAY['MA0001']),
('administracionPublica', 'XP0454', 'Agendas del Desarrollo y el Bienestar', 3, 2, 
ARRAY['XP0450']),
('administracionPublica', 'XP0455', 'Administración Pública: Enfoques y Tendencias', 5, 2, 
ARRAY['XP0450', 'XP0452', 'XP0453']),

-- III CICLO
('administracionPublica', 'EG-', 'Curso de Arte', 2, 3, ARRAY[]::text[]),
('administracionPublica', 'SR-1', 'Seminario de Realidad Nacional I', 2, 3, ARRAY['EG-II']),
('administracionPublica', 'XP0456', 'Análisis Económico para el Sector Público', 3, 3, 
ARRAY['MA1021']),
('administracionPublica', 'XP0457', 'Marco Normativo del Estado y la Administración 
Pública', 3, 3, ARRAY['XP0450', 'XP0454', 'XP0455']),
('administracionPublica', 'XP0458', 'Análisis de Políticas Públicas', 3, 3, ARRAY['XP0450', 
'XP0454', 'XP0455']),
('administracionPublica', 'XP0459', 'Modelos de Gobernanza', 5, 3, ARRAY['XP0454', 
'XP0455']),

-- IV CICLO
('administracionPublica', 'SR-II', 'Seminario de Realidad Nacional II', 2, 4, 
ARRAY['SR-1']),
('administracionPublica', 'XP0460', 'Fundamentos Contables para el Sector Público', 2, 4, 
ARRAY['XP0456']),
('administracionPublica', 'XP0461', 'Análisis Estadístico para el Sector Público', 3, 4, 
ARRAY['MA1021', 'XP0456']),
('administracionPublica', 'XP0462', 'Planificación y Coordinación para el Sector Público', 
5, 4, ARRAY['XP0454', 'XP0457', 'XP0459']),
('administracionPublica', 'XP0463', 'Gestión de la Contratación Administrativa', 3, 4, 
ARRAY['XP0457']),
('administracionPublica', 'XP0496', 'Negociación para la Gestión Pública', 3, 4, 
ARRAY['XP0457', 'XP0459']),

-- V CICLO
('administracionPublica', 'RP-1', 'Repertorio', 3, 5, ARRAY[]::text[]),
('administracionPublica', 'XP0464', 'Administración Financiera para el Sector Público', 4, 
5, ARRAY['XP0461']),
('administracionPublica', 'XP0465', 'TICs para el Análisis de Datos en la Gestión Pública', 
3, 5, ARRAY['XP0461']),
('administracionPublica', 'XP0466', 'Análisis Administrativo y Diseño Organizacional', 5, 5, 
ARRAY['XP0462']),
('administracionPublica', 'XP0497', 'Economía Social y Cogestión del Bienestar', 3, 5, 
ARRAY['XP0462']),

-- VI CICLO
('administracionPublica', 'XP0467', 'Diseño de Programas y Proyectos Públicos', 3, 6, 
ARRAY['XP0462', 'XP0464']),
('administracionPublica', 'XP0468', 'Finanzas y Presupuestos Públicos', 5, 6, 
ARRAY['XP0464']),
('administracionPublica', 'XP0471', 'Talento Humano en la Gestión Pública', 3, 6, 
ARRAY['XP0457', 'XP0466']),
('administracionPublica', 'XP0474', 'Gestión de la Logística en el Sector Público', 3, 6, 
ARRAY['XP0466']),
('administracionPublica', 'XP0475', 'Análisis Prospectivo', 3, 6, ARRAY['XP0458', 
'XP0466']),

-- VII CICLO
('administracionPublica', 'XP0469', 'Modelos de Provisión de Servicios Públicos', 3, 7, 
ARRAY['XP0457', 'XP0465', 'XP0466']),
('administracionPublica', 'XP0470', 'Control y Administración del Riesgo en la Gestión 
Pública', 3, 7, ARRAY['XP0457', 'XP0466']),
('administracionPublica', 'XP0472', 'Gestión de Programas y Proyectos Públicos', 5, 7, 
ARRAY['XP0467', 'XP0468']),
('administracionPublica', 'XP0473', 'Metodología de Investigación Aplicada a la Gestión 
Pública', 3, 7, ARRAY['XP0453', 'XP0465']),
('administracionPublica', 'XP0476', 'Liderazgo y Ética', 3, 7, ARRAY['XP0453', 'XP0471']),

-- VIII CICLO
('administracionPublica', 'XP0477', 'Evaluación en la Gestión Pública', 3, 8, 
ARRAY['XP0469', 'XP0470', 'XP0472']),
('administracionPublica', 'XP0478', 'Desafíos de la Gestión Pública', 5, 8, 
ARRAY['XP0473']),
('administracionPublica', 'XP0479', 'Gestión del Territorio', 3, 8, ARRAY['XP0469', 
'XP0472']),
('administracionPublica', 'XP0481', 'Práctica Profesional', 5, 8, ARRAY['XP0472', 
'XP0476']),

-- LICENCIATURA - CURSOS COMUNES (Mapeados a Ciclo 9 y 10 comunes)
('administracionPublica', 'XP0482', 'Taller de Investigación I', 8, 9, ARRAY['XP0478']),
('administracionPublica', 'XP0483', 'Taller de Investigación II', 8, 10, ARRAY['XP0482']),
('administracionPublica', 'XP0485', 'Economía Política Internacional', 3, 9, ARRAY['XP0477', 
'XP0478', 'XP0479', 'XP0481']),

-- ÉNFASIS 1: GESTIÓN DEL DESARROLLO (Niveles 9 y 10)
('administracionPublica', 'XP0486', 'Cooperación Internacional para el Desarrollo', 3, 9, 
ARRAY['XP0477', 'XP0478', 'XP0479', 'XP0481']),
('administracionPublica', 'XP0487', 'Planificación y Gestión de la Participación', 3, 9, 
ARRAY['XP0476', 'XP0478', 'XP0479']),
('administracionPublica', 'XP0488', 'Alianzas Público-Privadas para el Desarrollo', 3, 10, 
ARRAY['XP0476', 'XP0478', 'XP0479']),
('administracionPublica', 'XP0489', 'Planificación y Gestión del Desarrollo Urbano', 3, 10, 
ARRAY['XP0485', 'XP0487']),
('administracionPublica', 'XP0490', 'Planificación y Gestión del Desarrollo Rural', 3, 10, 
ARRAY['XP0485', 'XP0487']),

-- ÉNFASIS 2: GESTIÓN DE BANCA Y FINANZAS PÚBLICAS (Niveles 9 y 10)
('administracionPublica', 'XP0494', 'Regulación Bancaria e Intermediación Financiera', 3, 9, 
ARRAY['XP0477', 'XP0478', 'XP0479', 'XP0481']),
('administracionPublica', 'XP0495', 'Técnicas de Gestión Bancaria e Intermediación', 3, 9, 
ARRAY['XP0477', 'XP0478', 'XP0479', 'XP0481']),
('administracionPublica', 'XP0491', 'Financiamiento y Banca Internacional', 3, 10, 
ARRAY['XP0485', 'XP0495']),
('administracionPublica', 'XP0492', 'Gestión de Cartera e Inversiones', 3, 10, 
ARRAY['XP0485', 'XP0494', 'XP0495']),
('administracionPublica', 'XP0493', 'Gestión de Riesgos', 3, 10, ARRAY['XP0485', 'XP0494', 
'XP0495']),

-- XI CICLO (Trabajo Final de Graduación)
('administracionPublica', 'XP9500', 'Investigación Dirigida I', 0, 11, ARRAY[]::text[]),
('administracionPublica', 'XP9501', 'Investigación Dirigida II', 0, 11, ARRAY['XP9500']),
('administracionPublica', 'XP9502', 'Investigación Dirigida III', 0, 11, ARRAY['XP9501']),
('administracionPublica', 'XP9600', 'Seminario de Graduación 1', 0, 11, ARRAY[]::text[]),
('administracionPublica', 'XP9601', 'Seminario de Graduación 2', 0, 11, ARRAY['XP9600']),
('administracionPublica', 'XP9602', 'Seminario de Graduación 3', 0, 11, ARRAY[]::text[]),
('administracionPublica', 'XP9700', 'Práctica Dirigida 1', 0, 11, ARRAY[]::text[]),
('administracionPublica', 'XP9701', 'Práctica Dirigida 2', 0, 11, ARRAY[]::text[]),
('administracionPublica', 'XP9702', 'Práctica Dirigida 3', 0, 11, ARRAY[]::text[])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- ARQUITECTURA
-- carrera_id: 'arquitectura' | Cursos: 63
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) 
VALUES
-- I CICLO
('arquitectura', 'AQ0100', 'Taller de Diseño 1', 4, 1, ARRAY[]::text[]),
('arquitectura', 'AQ0216', 'Fundamentos de Diseño I', 2, 1, ARRAY[]::text[]),
('arquitectura', 'AQ0232', 'Dibujo del Espacio Arquitectónico', 2, 1, ARRAY[]::text[]),
('arquitectura', 'EF-', 'Actividad Deportiva', 0, 1, ARRAY[]::text[]),
('arquitectura', 'EG-I', 'Curso Integrado de Humanidades I', 6, 1, ARRAY[]::text[]),
('arquitectura', 'MA1111', 'Fundamentos de Geometría con Trigonometría', 4, 1, ARRAY[]::text[]),

-- II CICLO
('arquitectura', 'AQ0101', 'Taller de Diseño 2', 4, 2, ARRAY['AQ0100']),
('arquitectura', 'AQ0217', 'Fundamentos de Diseño II', 2, 2, ARRAY['AQ0216']),
('arquitectura', 'AQ0233', 'Geometría Descriptiva', 2, 2, ARRAY['MA1111']),
('arquitectura', 'AQ0234', 'Sistemas de Representación', 2, 2, ARRAY['AQ0232']),
('arquitectura', 'EG-II', 'Curso Integrado de Humanidades II', 6, 2, ARRAY['EG-I']),
('arquitectura', 'FS0210', 'Física para Arquitectura', 3, 2, ARRAY['MA1111']),

-- III CICLO
('arquitectura', 'AQ0102', 'Taller de Diseño 3', 4, 3, ARRAY['AQ0101']),
('arquitectura', 'AQ0203', 'Historia de la Arquitectura I', 2, 3, ARRAY['EG-II']),
('arquitectura', 'AQ0218', 'Teoría de la Arquitectura I', 2, 3, ARRAY['AQ0217']),
('arquitectura', 'AQ0235', 'Perspectiva y Sombras', 2, 3, ARRAY['AQ0233', 'AQ0234']),
('arquitectura', 'AQ0240', 'Sistemas Estructurales I', 3, 3, ARRAY['FS0210']),
('arquitectura', 'SR-I', 'Seminario de Realidad Nacional I', 2, 3, ARRAY['EG-II']),

-- IV CICLO
('arquitectura', 'AQ0103', 'Taller de Diseño 4', 4, 4, ARRAY['AQ0102']),
('arquitectura', 'AQ0204', 'Historia de la Arquitectura II', 2, 4, ARRAY['AQ0203']),
('arquitectura', 'AQ0219', 'Teoría de la Arquitectura II', 2, 4, ARRAY['AQ0218']),
('arquitectura', 'AQ0236', 'Presentación Gráfica', 2, 4, ARRAY['AQ0235']),
('arquitectura', 'AQ0241', 'Sistemas Estructurales II', 3, 4, ARRAY['AQ0240']),
('arquitectura', 'SR-II', 'Seminario de Realidad Nacional II', 2, 4, ARRAY['SR-I']),

-- V CICLO
('arquitectura', 'AQ0104', 'Taller de Diseño 5', 5, 5, ARRAY['AQ0103']),
('arquitectura', 'AQ0205', 'Historia de la Arquitectura III', 2, 5, ARRAY['AQ0204']),
('arquitectura', 'AQ0220', 'Teoría de la Arquitectura III', 2, 5, ARRAY['AQ0219']),
('arquitectura', 'AQ0242', 'Sistemas Estructurales III', 3, 5, ARRAY['AQ0241']),
('arquitectura', 'AQ0250', 'Materiales y Métodos de Construcción I', 3, 5, ARRAY['AQ0240']),
('arquitectura', 'RP-1', 'Repertorio', 3, 5, ARRAY[]::text[]),

-- VI CICLO
('arquitectura', 'AQ0105', 'Taller de Diseño 6', 5, 6, ARRAY['AQ0104']),
('arquitectura', 'AQ0206', 'Historia de la Arquitectura IV', 2, 6, ARRAY['AQ0205']),
('arquitectura', 'AQ0221', 'Teoría de la Arquitectura IV', 2, 6, ARRAY['AQ0220']),
('arquitectura', 'AQ0243', 'Sistemas Estructurales IV', 3, 6, ARRAY['AQ0242']),
('arquitectura', 'AQ0251', 'Materiales y Métodos de Construcción II', 3, 6, 
ARRAY['AQ0250']),
('arquitectura', 'AQ0255', 'Instalaciones en Edificios I', 2, 6, ARRAY['FS0210']),

-- VII CICLO
('arquitectura', 'AQ0106', 'Taller de Diseño 7', 5, 7, ARRAY['AQ0105']),
('arquitectura', 'AQ0207', 'Historia de la Arquitectura V', 2, 7, ARRAY['AQ0206']),
('arquitectura', 'AQ0224', 'Arquitectura y Paisaje', 2, 7, ARRAY['AQ0104']),
('arquitectura', 'AQ0244', 'Sistemas Estructurales V', 3, 7, ARRAY['AQ0243']),
('arquitectura', 'AQ0252', 'Materiales y Métodos de Construcción III', 3, 7, 
ARRAY['AQ0251']),
('arquitectura', 'AQ0256', 'Instalaciones en Edificios II', 2, 7, ARRAY['AQ0255']),

-- VIII CICLO
('arquitectura', 'AQ0107', 'Taller de Diseño 8', 5, 8, ARRAY['AQ0106']),
('arquitectura', 'AQ0212', 'Urbanismo I', 3, 8, ARRAY['AQ0106']),
('arquitectura', 'AQ0245', 'Sistemas Estructurales VI', 3, 8, ARRAY['AQ0244']),
('arquitectura', 'AQ0253', 'Materiales y Métodos de Construcción IV', 3, 8, 
ARRAY['AQ0252']),
('arquitectura', 'AQ0257', 'Instalaciones en Edificios III', 2, 8, ARRAY['AQ0256']),

-- IX CICLO
('arquitectura', 'AQ0108', 'Taller de Diseño 9', 5, 9, ARRAY['AQ0107']),
('arquitectura', 'AQ0213', 'Urbanismo II', 3, 9, ARRAY['AQ0212']),
('arquitectura', 'AQ0280', 'Administración y Práctica Profesional I', 3, 9, 
ARRAY['AQ0253']),

-- X CICLO
('arquitectura', 'AQ0109', 'Taller de Diseño 10', 5, 10, ARRAY['AQ0108']),
('arquitectura', 'AQ0214', 'Urbanismo III', 3, 10, ARRAY['AQ0213']),
('arquitectura', 'AQ0281', 'Administración y Práctica Profesional II', 3, 10, 
ARRAY['AQ0280']),

-- BLOQUE OPTATIVO DISCIPLINAR SUGERIDO
('arquitectura', 'AQ0261', 'Audiovisuales', 2, 7, ARRAY['AQ0106']),
('arquitectura', 'AQ0265', 'Ciudades e Historia Contemporánea', 2, 7, ARRAY['AQ0106']),
('arquitectura', 'AQ0273', 'Evaluación del Impacto Ambiental', 2, 7, ARRAY['AQ0106']),
('arquitectura', 'AQ0215', 'Investigación Urbana', 2, 7, ARRAY['AQ0106']),
('arquitectura', 'AQ0248', 'Áreas Verdes y Floresta Urbana', 2, 7, ARRAY['AQ0106']),
('arquitectura', 'AQ0258', 'Modelos Bioclimáticos', 2, 7, ARRAY['AQ0106']),
('arquitectura', 'AQ0260', 'Modelos de la Estructura y de la Forma', 2, 7, ARRAY['AQ0106']),
('arquitectura', 'AQ0263', 'Modelos y Maquetas', 2, 7, ARRAY['AQ0106']),
('arquitectura', 'AQ0264', 'Grabado para Arquitectura', 2, 7, ARRAY[]::text[]),
('arquitectura', 'AQ0266', 'Restauración Arquitectónica', 2, 7, ARRAY['AQ0106'])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- COMPUTADORAS Y REDES
-- carrera_id: 'computadoras_redes' | Cursos: 48
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) 
VALUES
-- CICLO I
('computadoras_redes', 'EG-I', 'Curso Integrado de Humanidades I', 6, 1, ARRAY[]::text[]),
('computadoras_redes', 'QU-0100', 'Química General I', 3, 1, ARRAY[]::text[]),
('computadoras_redes', 'QU-0101', 'Laboratorio de Química General I', 1, 1, ARRAY[]::text[]),
('computadoras_redes', 'MA-1101', 'Cálculo I', 3, 1, ARRAY[]::text[]),
('computadoras_redes', 'MA-1004', 'Álgebra Lineal', 3, 1, ARRAY[]::text[]),
('computadoras_redes', 'EF-', 'Actividad Deportiva', 0, 1, ARRAY[]::text[]),
('computadoras_redes', 'EG-', 'Curso de Arte', 2, 1, ARRAY[]::text[]),

-- CICLO II
('computadoras_redes', 'EG-II', 'Curso Integrado de Humanidades II', 6, 2, 
ARRAY['EG-I']::text[]),
('computadoras_redes', 'CI-0202', 'Principios de Informática', 4, 2, 
ARRAY['MA-1101']::text[]),
('computadoras_redes', 'MA-1002', 'Cálculo II', 4, 2, ARRAY['MA-1101']::text[]),
('computadoras_redes', 'FS-0210', 'Física General I', 3, 2, ARRAY['MA-1101']::text[]),
('computadoras_redes', 'FS-0211', 'Laboratorio de Física General I', 1, 2, 
ARRAY['MA-1101']::text[]),

-- CICLO III
('computadoras_redes', 'IE-0117', 'Programación bajo Plataformas Abiertas', 3, 3, 
ARRAY['CI-0202']::text[]),
('computadoras_redes', 'IE-0209', 'Circuitos Lineales I', 3, 3, 
ARRAY['MA-1002','MA-1004','FS-0210','FS-0211']::text[]),
('computadoras_redes', 'MA-1003', 'Cálculo III', 4, 3, ARRAY['MA-1002','MA-1004']::text[]),
('computadoras_redes', 'FS-0310', 'Física General II', 3, 3, 
ARRAY['MA-1002','FS-0210','FS-0211']::text[]),
('computadoras_redes', 'FS-0311', 'Laboratorio de Física General II', 1, 3, 
ARRAY['MA-1002','FS-0210','FS-0211']::text[]),
('computadoras_redes', 'MA-1005', 'Ecuaciones Diferenciales', 4, 3, 
ARRAY['MA-1002','MA-1004']::text[]),

-- CICLO IV
('computadoras_redes', 'IE-0217', 'Estructuras Abstractas de Datos y Algoritmos', 3, 4, 
ARRAY['IE-0117']::text[]),
('computadoras_redes', 'IE-0309', 'Circuitos Lineales II', 3, 4, 
ARRAY['IE-0209','MA-1005','FS-0310','FS-0311']::text[]),
('computadoras_redes', 'IE-0247', 'Señales y Sistemas I', 3, 4, 
ARRAY['IE-0209','MA-1005']::text[]),
('computadoras_redes', 'FS-0410', 'Física General III', 3, 4, 
ARRAY['MA-1003','FS-0310','FS-0311']::text[]),
('computadoras_redes', 'FS-0411', 'Laboratorio de Física General III', 1, 4, 
ARRAY['MA-1003','FS-0310','FS-0311']::text[]),
('computadoras_redes', 'IE-0313', 'Electrónica I', 3, 4, ARRAY['IE-0209']::text[]),
('computadoras_redes', 'SR-I', 'Seminario de Realidad Nacional I', 2, 4, 
ARRAY['EG-II']::text[]),

-- CICLO V
('computadoras_redes', 'IM0101', 'Gráfica', 3, 5, ARRAY['MA-1002']::text[]),
('computadoras_redes', 'IE-0323', 'Sistemas Digitales I', 4, 5, ARRAY['IE-0313']::text[]),
('computadoras_redes', 'IE-0347', 'Señales y Sistemas II', 3, 5, ARRAY['IE-0247']::text[]),
('computadoras_redes', 'IE-0307', 'Electromagnetismo I', 3, 5, 
ARRAY['FS-0410','FS-0411','IE-0247','IE-0313','MA-1003']::text[]),
('computadoras_redes', 'IE-0413', 'Electrónica II', 3, 5, 
ARRAY['IE-0247','IE-0313']::text[]),
('computadoras_redes', 'IE-0308', 'Laboratorio de Electrónica I', 3, 5, 
ARRAY['IE-0309','IE-0313']::text[]),

-- CICLO VI
('computadoras_redes', 'IE-0321', 'Estructura de Computadoras Digitales I', 3, 6, 
ARRAY['IE-0323']::text[]),
('computadoras_redes', 'IE-0523', 'Sistemas Digitales II', 3, 6, 
ARRAY['IE-0323','IE-0117']::text[]),
('computadoras_redes', 'IE-0405', 'Modelos Probabilísticos de Señales y Sistemas', 3, 6, 
ARRAY['IE-0347']::text[]),
('computadoras_redes', 'IE-0315', 'Máquinas Eléctricas I', 3, 6, 
ARRAY['IE-0307','IE-0309']::text[]),
('computadoras_redes', 'IE-0311', 'Circuitos Integrados Digitales', 3, 6, 
ARRAY['FS-0410','IE-0323']::text[]),
('computadoras_redes', 'IE0501', 'Responsabilidad en el Ejercicio Profesional', 1, 6, 
ARRAY['IE-0307']::text[]),

-- CICLO VII
('computadoras_redes', 'IE-Optativa_Comp_I', 'Optativa I del Bloque de Ingeniería en 
Computadoras', 3, 7, ARRAY[]::text[]),
('computadoras_redes', 'IE-Optativa_Comp_II', 'Optativa II del Bloque de Ingeniería en 
Computadoras', 3, 7, ARRAY[]::text[]),
('computadoras_redes', 'IE-0424', 'Laboratorio de Diseño Digital', 3, 7, 
ARRAY['IE-0308','IE-0321','IE-0523']::text[]),
('computadoras_redes', 'IE-0431', 'Sistemas de Control', 3, 7, ARRAY['IE-0347']::text[]),
('computadoras_redes', 'IE-0527', 'Ingeniería de Comunicaciones', 3, 7, 
ARRAY['IE-0307','IE-0405']::text[]),
('computadoras_redes', 'SR-II', 'Seminario de Realidad Nacional II', 2, 7, 
ARRAY['SR-I']::text[]),

-- CICLO VIII
('computadoras_redes', 'IE-Optativa_Micro', 'Optativa del Bloque de Microprocesadores', 3, 
8, ARRAY[]::text[]),
('computadoras_redes', 'IE-0499', 'Proyecto Eléctrico', 3, 8, ARRAY['IE-0431']::text[]),
('computadoras_redes', 'IE-0425', 'Redes de Computadoras', 3, 8, 
ARRAY['IE-0321','IE-0527']::text[]),
('computadoras_redes', 'IE-0479', 'Ingeniería Económica', 3, 8, ARRAY['IE0501']::text[]),
('computadoras_redes', 'RP-', 'Repertorio', 3, 8, ARRAY[]::text[])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- ELECTRÓNICA Y TELECOMUNICACIONES
-- carrera_id: 'electronica_telecomunicaciones' | Cursos: 50
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) VALUES
-- CICLO I
('electronica_telecomunicaciones', 'EG-I', 'Curso Integrado de Humanidades I', 6, 1, ARRAY[]::text[]),
('electronica_telecomunicaciones', 'QU-0100', 'Química General I', 3, 1, ARRAY[]::text[]),
('electronica_telecomunicaciones', 'QU-0101', 'Laboratorio de Química General I', 1, 1, ARRAY[]::text[]),
('electronica_telecomunicaciones', 'MA-1101', 'Cálculo I', 3, 1, ARRAY[]::text[]),
('electronica_telecomunicaciones', 'MA-1004', 'Álgebra Lineal', 3, 1, ARRAY[]::text[]),
('electronica_telecomunicaciones', 'EF-', 'Actividad Deportiva', 0, 1, ARRAY[]::text[]),
('electronica_telecomunicaciones', 'EG-', 'Curso de Arte', 2, 1, ARRAY[]::text[]),

-- CICLO II
('electronica_telecomunicaciones', 'EG-II', 'Curso Integrado de Humanidades II', 6, 2, ARRAY['EG-I']::text[]),
('electronica_telecomunicaciones', 'CI-0202', 'Principios de Informática', 4, 2, ARRAY['MA-1101']::text[]),
('electronica_telecomunicaciones', 'MA-1002', 'Cálculo II', 4, 2, ARRAY['MA-1101']::text[]),
('electronica_telecomunicaciones', 'FS-0210', 'Física General I', 3, 2, ARRAY['MA-1101']::text[]),
('electronica_telecomunicaciones', 'FS-0211', 'Laboratorio de Física General I', 1, 2, ARRAY['MA-1101']::text[]),

-- CICLO III
('electronica_telecomunicaciones', 'IM-0101', 'Gráfica', 3, 3, ARRAY['MA-1002']::text[]),
('electronica_telecomunicaciones', 'IE-0209', 'Circuitos Lineales I', 3, 3, 
ARRAY['MA-1002','MA-1004','FS-0210','FS-0211']::text[]),
('electronica_telecomunicaciones', 'MA-1003', 'Cálculo III', 4, 3, ARRAY['MA-1002','MA-1004']::text[]),
('electronica_telecomunicaciones', 'FS-0310', 'Física General II', 3, 3, ARRAY['MA-1002','FS-0210','FS-0211']::text[]),
('electronica_telecomunicaciones', 'FS-0311', 'Laboratorio de Física General II', 1, 3, 
ARRAY['MA-1002','FS-0210','FS-0211']::text[]),
('electronica_telecomunicaciones', 'MA-1005', 'Ecuaciones Diferenciales', 4, 3, ARRAY['MA-1002','MA-1004']::text[]),

-- CICLO IV
('electronica_telecomunicaciones', 'IM-0207', 'Mecánica I', 3, 4, ARRAY['FS-0210','FS-0211','MA-1002','IM-0101']::text[]),
('electronica_telecomunicaciones', 'IE-0309', 'Circuitos Lineales II', 3, 4, 
ARRAY['IE-0209','MA-1005','FS-0310','FS-0311']::text[]),
('electronica_telecomunicaciones', 'IE-0247', 'Señales y Sistemas I', 3, 4, ARRAY['IE-0209','MA-1005']::text[]),
('electronica_telecomunicaciones', 'FS-0410', 'Física General III', 3, 4, ARRAY['MA-1003','FS-0310','FS-0311']::text[]),
('electronica_telecomunicaciones', 'FS-0411', 'Laboratorio de Física General III', 1, 4, 
ARRAY['MA-1003','FS-0310','FS-0311']::text[]),
('electronica_telecomunicaciones', 'IE-0313', 'Electrónica I', 3, 4, ARRAY['IE-0209']::text[]),
('electronica_telecomunicaciones', 'SR-I', 'Seminario de Realidad Nacional I', 2, 4, ARRAY['EG-II']::text[]),

-- CICLO V
('electronica_telecomunicaciones', 'IM-0307', 'Mecánica II', 3, 5, ARRAY['IM-0207']::text[]),
('electronica_telecomunicaciones', 'IE-0323', 'Sistemas Digitales I', 4, 5, ARRAY['IE-0313']::text[]),
('electronica_telecomunicaciones', 'IE-0347', 'Señales y Sistemas II', 3, 5, ARRAY['IE-0247']::text[]),
('electronica_telecomunicaciones', 'IE-0307', 'Electromagnetismo I', 3, 5, 
ARRAY['FS-0410','FS-0411','IE-0247','IE-0313','MA-1003']::text[]),
('electronica_telecomunicaciones', 'IE-0413', 'Electrónica II', 3, 5, ARRAY['IE-0247','IE-0313']::text[]),
('electronica_telecomunicaciones', 'IE-0308', 'Laboratorio de Electrónica I', 3, 5, ARRAY['IE-0309','IE-0313']::text[]),

-- CICLO VI (Divergencia)
('electronica_telecomunicaciones', 'RP-', 'Repertorio', 3, 6, ARRAY[]::text[]),
('electronica_telecomunicaciones', 'IE-0321', 'Estructura de Computadoras Digitales I', 3, 6, ARRAY['IE-0323']::text[]),
('electronica_telecomunicaciones', 'IE-0405', 'Modelos Probabilísticos de Señales y Sistemas', 3, 6, ARRAY['IE-0347']::text[]),
('electronica_telecomunicaciones', 'IE-0315', 'Máquinas Eléctricas I', 3, 6, ARRAY['IE-0307','IE-0309']::text[]),
('electronica_telecomunicaciones', 'IE-0316', 'Laboratorio de Máquinas Eléctricas I', 1, 6, ARRAY['IE-0307','IE-0309']::text[]),
('electronica_telecomunicaciones', 'IE-0408', 'Laboratorio de Electrónica II', 3, 6, ARRAY['IE-0308','IE-0413']::text[]),
('electronica_telecomunicaciones', 'IE-0501', 'Responsabilidad en el Ejercicio Profesional', 1, 6, ARRAY['IE-0307']::text[]),

-- CICLO VII
('electronica_telecomunicaciones', 'IE-Optativa_I', 'Optativa I', 3, 7, ARRAY[]::text[]),
('electronica_telecomunicaciones', 'IE-0527', 'Ingeniería de Comunicaciones', 3, 7, ARRAY['IE-0307','IE-0405']::text[]),
('electronica_telecomunicaciones', 'IE-0431', 'Sistemas de Control', 3, 7, ARRAY['IE-0347']::text[]),
('electronica_telecomunicaciones', 'IE-0615', 'Máquinas Eléctricas II', 3, 7, ARRAY['IE-0315','IE-0316','IE-0347']::text[]),
('electronica_telecomunicaciones', 'IE-0616', 'Laboratorio de Máquinas Eléctricas II', 1, 7, 
ARRAY['IE-0315','IE-0316','IE-0347']::text[]),
('electronica_telecomunicaciones', 'IE-0513', 'Electrónica III', 3, 7, ARRAY['IE-0413']::text[]),
('electronica_telecomunicaciones', 'SR-II', 'Seminario de Realidad Nacional II', 2, 7, ARRAY['SR-I']::text[]),

-- CICLO VIII
('electronica_telecomunicaciones', 'IE-Optativa_II', 'Optativa II', 3, 8, ARRAY[]::text[]),
('electronica_telecomunicaciones', 'IE-0425', 'Redes de Computadoras', 3, 8, ARRAY['IE-0321','IE-0527']::text[]),
('electronica_telecomunicaciones', 'IE-0499', 'Proyecto Eléctrico', 3, 8, ARRAY['IE-0431']::text[]),
('electronica_telecomunicaciones', 'IE-0471', 'Diseño Eléctrico Industrial I', 3, 8, ARRAY['IE-0315','IE-0316']::text[]),
('electronica_telecomunicaciones', 'IE-0479', 'Ingeniería Económica', 3, 8, ARRAY['IE-0501']::text[])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- ESTADÍSTICA
-- carrera_id: 'estadistica' | Cursos: 38
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) 
VALUES
-- I CICLO
('estadistica', 'EG-', 'Curso de Arte', 2, 1, ARRAY[]::text[]),
('estadistica', 'EG-1', 'Curso Integrado de Humanidades I', 6, 1, ARRAY[]::text[]),
('estadistica', 'LM1030', 'Estrategias de Lectura en Inglés I (para otras carreras)', 4, 1, 
ARRAY[]::text[]),
('estadistica', 'MA0001', 'Precálculo', 0, 1, ARRAY[]::text[]),
('estadistica', 'XS1110', 'Estadística Introductoria I', 4, 1, ARRAY[]::text[]),

-- II CICLO
('estadistica', 'EF-', 'Actividad Deportiva', 0, 2, ARRAY[]::text[]),
('estadistica', 'EG-II', 'Curso Integrado de Humanidades II', 6, 2, ARRAY['EG-1']),
('estadistica', 'MA1001', 'Cálculo I', 3, 2, ARRAY['MA0001']),
('estadistica', 'XS1130', 'Estadística Introductoria II', 4, 2, ARRAY['XS1110']),
('estadistica', 'XS2110', 'Métodos de Investigación Cuantitativa', 4, 2, ARRAY['XS1110']),

-- III CICLO
('estadistica', 'CI0202', 'Principios de Informática', 4, 3, ARRAY['MA1001']),
('estadistica', 'MA1002', 'Cálculo II', 4, 3, ARRAY['MA1001']),
('estadistica', 'MA1004', 'Álgebra Lineal', 3, 3, ARRAY['MA1001']),
('estadistica', 'SR-1', 'Seminario de Realidad Nacional I', 2, 3, ARRAY['EG-II']),
('estadistica', 'XS2310', 'Probabilidad e Inferencia Estadística I', 4, 3, ARRAY['MA1001', 
'XS1130']),

-- IV CICLO
('estadistica', 'MA1003', 'Cálculo III', 4, 4, ARRAY['MA1002', 'MA1004']),
('estadistica', 'SR-II', 'Seminario de Realidad Nacional II', 2, 4, ARRAY['SR-1']),
('estadistica', 'XS3110', 'Técnicas de Muestreo', 4, 4, ARRAY['XS2110', 'XS2310']),
('estadistica', 'XS3310', 'Probabilidad e Inferencia Estadística II', 4, 4, ARRAY['MA1002', 
'XS2310']),

-- V CICLO
('estadistica', 'RP-1', 'Repertorio', 3, 5, ARRAY[]::text[]),
('estadistica', 'XS3130', 'Diseño de Experimentos', 4, 5, ARRAY['MA1004', 'XS3310']),
('estadistica', 'XS3150', 'Análisis de Regresión', 4, 5, ARRAY['MA1004', 'XS3310']),
('estadistica', 'XS3330', 'Métodos No Paramétricos', 3, 5, ARRAY['XS3310']),

-- VI CICLO
('estadistica', 'XS3210', 'Paquetes Estadísticos', 3, 6, ARRAY['CI0202', 'XS3150']),
('estadistica', 'XS4110', 'Análisis Multivariado', 4, 6, ARRAY['XS3150']),
('estadistica', 'XS4310', 'Procesos Estocásticos', 3, 6, ARRAY['MA1003', 'XS3310']),
('estadistica', 'XS4330', 'Teoría Estadística', 4, 6, ARRAY['MA1003', 'XS3310']),

-- VII CICLO
('estadistica', 'XS4130', 'Análisis de Series de Tiempo', 4, 7, ARRAY['XS3150', 'XS4310']),
('estadistica', 'XS4150', 'Análisis de Datos Demográficos', 4, 7, ARRAY['XS3110', 
'XS3150']),
('estadistica', 'XS4410', 'Consultoría Estadística I', 3, 7, ARRAY['XS3110', 'XS3130', 
'XS3150', 'XS3210']),

-- VIII CICLO
('estadistica', 'XS4170', 'Modelos Lineales Generalizados', 4, 8, ARRAY['XS3150', 
'XS4330']),
('estadistica', 'XS4210', 'Tópicos de Computación Estadística', 3, 8, ARRAY['XS3210']),
('estadistica', 'XS4430', 'Consultoría Estadística II', 4, 8, ARRAY['XS4410']),

-- CURSOS DEL BLOQUE OPTATIVO SUGERIDO (OPT296)
('estadistica', 'CP1212', 'Política Actual Costarricense', 3, 5, ARRAY[]::text[]),
('estadistica', 'FS0101', 'Fundamentos de Astronomía', 3, 5, ARRAY[]::text[]),
('estadistica', 'FS0115', 'Fundamentos de Oceanografía', 3, 5, ARRAY[]::text[]),
('estadistica', 'LM1032', 'Estrategias de Lectura en Inglés II (para otras carreras)', 4, 5, 
ARRAY['LM1030']),
('estadistica', 'PS0001', 'Psicología General', 3, 5, ARRAY[]::text[])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- GEOLOGÍA
-- carrera_id: 'geologia' | Cursos: 86
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) 
VALUES
-- I CICLO
('geologia', 'EF-', 'Actividad Deportiva', 0, 1, ARRAY[]::text[]),
('geologia', 'EG-I', 'Curso Integrado de Humanidades I', 6, 1, ARRAY[]::text[]),
('geologia', 'G0214', 'Geología General', 4, 1, ARRAY['QU0100', 'QU0101']::text[]),
('geologia', 'MA0001', 'Precálculo', 0, 1, ARRAY[]::text[]),
('geologia', 'MA1001', 'Cálculo I', 3, 1, ARRAY['MA0001']::text[]),
('geologia', 'QU0100', 'Química General I', 3, 1, ARRAY[]::text[]),
('geologia', 'QU0101', 'Laboratorio de Química General I', 1, 1, ARRAY['QU0100']::text[]),

-- II CICLO
('geologia', 'EG-', 'Curso de Arte', 2, 2, ARRAY[]::text[]),
('geologia', 'EG-II', 'Curso Integrado de Humanidades II', 6, 2, ARRAY['EG-I']::text[]),
('geologia', 'FS0210', 'Física General I', 3, 2, ARRAY['MA1001']::text[]),
('geologia', 'FS0211', 'Laboratorio de Física General I', 1, 2, ARRAY['MA1001']::text[]),
('geologia', 'OPT174', 'Bloque Optativo (XS0215 / Cálculo II)', 3, 2, ARRAY[]::text[]),
('geologia', 'QU0102', 'Química General II', 3, 2, ARRAY['QU0100', 'QU0101']::text[]),
('geologia', 'QU0103', 'Laboratorio de Química General II', 1, 2, ARRAY['QU0100', 
'QU0101']::text[]),

-- III CICLO
('geologia', 'FS0310', 'Física General II', 3, 3, ARRAY['FS0210', 'FS0211', 
'OPT174']::text[]),
('geologia', 'FS0311', 'Laboratorio de Física General II', 1, 3, ARRAY['FS0210', 'FS0211', 
'OPT174']::text[]),
('geologia', 'G0224', 'Mineralogía General', 3, 3, ARRAY['FS0210', 'FS0211', 'G0214', 
'QU0102', 'QU0103']::text[]),
('geologia', 'G3003', 'Dibujo Geològico', 4, 3, ARRAY['FS0210', 'G0214']::text[]),
('geologia', 'G4101', 'Geología Numérica', 3, 3, ARRAY['FS0210', 'G0214', 
'OPT174']::text[]),
('geologia', 'RP-1', 'Repertorio', 3, 3, ARRAY[]::text[]),

-- IV CICLO
('geologia', 'G0034', 'Mineralogía Óptica', 4, 4, ARRAY['FS0310', 'G0224']::text[]),
('geologia', 'G0316', 'Geomorfología', 4, 4, ARRAY['G3003', 'G4101']::text[]),
('geologia', 'G0419', 'Paleontología General', 4, 4, ARRAY['G0224']::text[]),
('geologia', 'OPT172', 'Bloque Optativo (I)', 3, 4, ARRAY[]::text[]),
('geologia', 'SR-I', 'Seminario de Realidad Nacional I', 2, 4, ARRAY['EG-II']::text[]),

-- V CICLO
('geologia', 'G0032', 'Geotecnia Introductiva', 4, 5, ARRAY['FS0310', 'G0316']::text[]),
('geologia', 'G4112', 'Hidrogeología', 3, 5, ARRAY['FS0310', 'G0316']::text[]),
('geologia', 'G4115', 'Petrografía de Rocas Ígneas y Metamórficas', 4, 5, ARRAY['FS0310', 
'G0034']::text[]),
('geologia', 'G4214', 'Geología de Campo I', 4, 5, ARRAY['FS0310', 'G0034', 'G0316', 
'G0419']::text[]),
('geologia', 'SR-II', 'Seminario de Realidad Nacional II', 2, 5, ARRAY['SR-I']::text[]),

-- VI CICLO
('geologia', 'G0018', 'Geoquímica Introductiva', 3, 6, ARRAY['G4115', 'G4214']::text[]),
('geologia', 'G0411', 'Yacimientos Minerales', 3, 6, ARRAY['G4115', 'G4214']::text[]),
('geologia', 'G4110', 'Geología Estructural', 4, 6, ARRAY['G0032', 'G4214']::text[]),
('geologia', 'G4121', 'Percepción Remota', 4, 6, ARRAY['G4214']::text[]),
('geologia', 'G4222', 'Petrografía de Rocas Sedimentarias', 3, 6, ARRAY['G0419', 
'G4115']::text[]),

-- VII CICLO (Verano / Vacacional)
('geologia', 'G4116', 'Práctica Geológica', 3, 7, ARRAY['G0032', 'G4112', 'G4115', 
'G4214']::text[]),

-- VIII CICLO
('geologia', 'G4113', 'Estratigrafía', 3, 8, ARRAY['G4222']::text[]),
('geologia', 'G4120', 'Sedimentología', 4, 8, ARRAY['G4110', 'G4222']::text[]),
('geologia', 'G5102', 'Geología Ambiental I', 3, 8, ARRAY['G0018', 'G0411', 
'G4112']::text[]),
('geologia', 'G5116', 'Geología de Campo II', 4, 8, ARRAY['G0411', 'G4110', 
'G4121']::text[]),
('geologia', 'G5120', 'Vulcanología', 4, 8, ARRAY['G0018', 'G0411', 'G4110']::text[]),

-- IX CICLO
('geologia', 'G0024', 'Geofísica Introductiva', 3, 9, ARRAY['G4110', 'G4113', 
'G5120']::text[]),
('geologia', 'G4118', 'Geología Histórica y Tectónica', 4, 9, ARRAY['G4113', 'G4120', 
'G5116']::text[]),
('geologia', 'G5216', 'Campaña Geológica', 8, 9, ARRAY['G4120', 'G5102', 'G5116', 
'G5120']::text[]),

-- X CICLO (Grado de Licenciatura)
('geologia', 'G5126', 'Manejo de Recursos Minerales', 4, 10, ARRAY['G5216']::text[]),
('geologia', 'G5127', 'Manejo de Recursos Hídricos', 4, 10, ARRAY['G4112', 
'G5216']::text[]),
('geologia', 'G5128', 'Cuencas Sedimentarias e Hidrocarburos', 4, 10, 
ARRAY['G5216']::text[]),
('geologia', 'OPT173', 'Bloque Optativo (II)', 3, 10, ARRAY[]::text[]),

-- XI CICLO
('geologia', 'G4213', 'Mecánica de Rocas', 4, 11, ARRAY['G5216']::text[]),
('geologia', 'G5129', 'Geología Ambiental II', 4, 11, ARRAY['G5216']::text[]),
('geologia', 'G5130', 'Proyectos Geológicos', 3, 11, ARRAY['G5216']::text[]),

-- XII, XIII, XIV CICLO (Bloques Finales / Trabajo Final de Graduación)
('geologia', 'G9500', 'Investigación Dirigida I', 0, 12, ARRAY[]::text[]),
('geologia', 'G9501', 'Investigación Dirigida II', 0, 13, ARRAY[]::text[]),
('geologia', 'G9502', 'Investigación Dirigida III', 0, 14, ARRAY[]::text[]),
('geologia', 'G9600', 'Seminario de Graduación I', 0, 12, ARRAY[]::text[]),
('geologia', 'G9601', 'Seminario de Graduación II', 0, 13, ARRAY[]::text[]),
('geologia', 'G9602', 'Seminario de Graduación III', 0, 14, ARRAY[]::text[]),
('geologia', 'G9700', 'Práctica Dirigida I', 0, 12, ARRAY[]::text[]),
('geologia', 'G9701', 'Práctica Dirigida II', 0, 13, ARRAY[]::text[]),
('geologia', 'G9702', 'Práctica Dirigida III', 0, 14, ARRAY[]::text[]),
('geologia', 'G9800', 'Proyecto de Graduación I', 0, 12, ARRAY[]::text[]),
('geologia', 'G9801', 'Proyecto de Graduación II', 0, 13, ARRAY[]::text[]),
('geologia', 'G9802', 'Proyecto de Graduación III', 0, 14, ARRAY[]::text[]),

-- ASIGNATURAS DE LOS BLOQUES OPTATIVOS (OPT172, OPT173, OPT174)
('geologia', 'CI0202', 'Principios de Informática', 4, 4, ARRAY['MA1001']::text[]),
('geologia', 'G0047', 'Sistemas de Información Geográfica Aplicados a la Geología', 3, 4, 
ARRAY['G3003', 'G0316']::text[]),
('geologia', 'MA1004', 'Álgebra Lineal', 3, 4, ARRAY[]::text[]),
('geologia', 'QU0200', 'Química Analítica Cuantitativa I', 3, 4, ARRAY['QU0102', 
'QU0103']::text[]),
('geologia', 'QU0201', 'Laboratorio de Química Analítica Cuantitativa I', 2, 4, 
ARRAY['QU0102', 'QU0103']::text[]),
('geologia', 'QU0210', 'Fundamentos de Química Orgánica', 4, 4, ARRAY['QU0114', 
'QU0115']::text[]),
('geologia', 'QU0211', 'Laboratorio de Fundamentos de Química Orgánica', 1, 4, 
ARRAY['QU0114', 'QU0115']::text[]),
('geologia', 'XE0156', 'Introducción a la Economía', 4, 4, ARRAY[]::text[]),
('geologia', 'XS0215', 'Estadística para Biociencias', 4, 4, ARRAY['MA1001']::text[]),
('geologia', 'G0016', 'Geoquímica Aplicada', 3, 10, ARRAY['G0018', 'G0411']::text[]),
('geologia', 'G0025', 'Sismología', 3, 10, ARRAY['G0024']::text[]),
('geologia', 'G0038', 'Micropaleontología', 3, 10, ARRAY['G0419']::text[]),
('geologia', 'G0040', 'Geotermia', 3, 10, ARRAY['G5120']::text[]),
('geologia', 'G0124', 'Geofísica Aplicada', 3, 10, ARRAY['G0024']::text[]),
('geologia', 'G4220', 'Técnicas de Perforación', 3, 10, ARRAY['G0024', 'G4112']::text[]),
('geologia', 'G5124', 'Seminario de Geología', 3, 10, ARRAY['G5216']::text[]),
('geologia', 'G5131', 'Temas Actuales de la Geología', 3, 10, ARRAY['G5216']::text[]),
('geologia', 'G5219', 'Economía Minera', 3, 10, ARRAY['G0411']::text[]),
('geologia', 'G0048', 'Manejo de Recursos no Metálicos (Recursos Materiales)', 3, 10, 
ARRAY['G4120', 'G5102']::text[]),
('geologia', 'G0049', 'Neotectónica', 3, 10, ARRAY['G5216']::text[]),
('geologia', 'XS0217', 'Probabilidades e Inferencia Estadística', 4, 10, 
ARRAY['MA1004']::text[]),
('geologia', 'MA1002', 'Cálculo II', 4, 2, ARRAY['MA1001']::text[]),
('geologia', 'MA2210', 'Ecuaciones Diferenciales Aplicadas', 3, 2, ARRAY['MA1001']::text[])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- INGENIERÍA TOPOGRÁFICA
-- carrera_id: 'ingenieriaTopografica' | Cursos: 76
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) 
VALUES
-- I CICLO
('ingenieriaTopografica', 'EF-', 'Actividad Deportiva', 0, 1, ARRAY[]::text[]),
('ingenieriaTopografica', 'EG-I', 'Curso Integrado de Humanidades I', 6, 1, ARRAY[]::text[]),
('ingenieriaTopografica', 'GF0215', 'Cartografía Básica', 3, 1, ARRAY[]::text[]),
('ingenieriaTopografica', 'IT1000', 'Introducción a la Ingeniería Topográfica', 2, 1, ARRAY[]::text[]),
('ingenieriaTopografica', 'IT1002', 'Dibujo Básico para Topografía', 3, 1, ARRAY[]::text[]),
('ingenieriaTopografica', 'MA0001', 'Precálculo', 0, 1, ARRAY[]::text[]),
('ingenieriaTopografica', 'MA1110', 'Trigonometría Plana y Esférica', 3, 1, ARRAY[]::text[]),

-- II CICLO
('ingenieriaTopografica', 'EG-', 'Curso de Arte', 2, 2, ARRAY[]::text[]),
('ingenieriaTopografica', 'EG-II', 'Curso Integrado de Humanidades II', 6, 2, 
ARRAY['EG-I']),
('ingenieriaTopografica', 'IT1003', 'Principios de Topografía', 3, 2, ARRAY['GF0215', 
'IT1002', 'MA1110']),
('ingenieriaTopografica', 'IT1004', 'Práctica de Principios de Topografía', 2, 2, 
ARRAY['GF0215', 'IT1002', 'MA1110']),
('ingenieriaTopografica', 'IT2005', 'Legislación para Topografía', 2, 2, ARRAY['IT1000']),
('ingenieriaTopografica', 'MA1001', 'Cálculo I', 3, 2, ARRAY['MA0001']),

-- III CICLO
('ingenieriaTopografica', 'FS0210', 'Física General I', 3, 3, ARRAY['MA1001']),
('ingenieriaTopografica', 'FS0211', 'Laboratorio de Física General I', 1, 3, 
ARRAY['MA1001']),
('ingenieriaTopografica', 'G0114', 'Geología para Topógrafos', 3, 3, ARRAY['IT1003', 
'IT1004']),
('ingenieriaTopografica', 'IT2002', 'Dibujo Topográfico', 3, 3, ARRAY['IT1003']),
('ingenieriaTopografica', 'IT2003', 'Ajustes e Instrumentos Topográficos', 3, 3, 
ARRAY['IT1003', 'MA1001']),
('ingenieriaTopografica', 'IT2004', 'Práctica de Ajustes e Instrumentos Topogr.', 2, 3, 
ARRAY['IT1003', 'IT1004', 'MA1001']),
('ingenieriaTopografica', 'RP-1', 'Repertorio', 3, 3, ARRAY[]::text[]),

-- IV CICLO
('ingenieriaTopografica', 'IT3005', 'Levantamiento Topográfico de Vías', 3, 4, 
ARRAY['FS0210', 'IT2003']),
('ingenieriaTopografica', 'IT3006', 'Práctica de Levantamiento Topográfico de Vías', 2, 4, 
ARRAY['FS0210', 'FS0211', 'IT2003', 'IT2004']),
('ingenieriaTopografica', 'IT4002', 'Principios de Geodesia', 3, 4, ARRAY['IT2003']),
('ingenieriaTopografica', 'IT4004', 'Levantamiento Catastral', 3, 4, ARRAY['IT2003']),
('ingenieriaTopografica', 'MA1002', 'Cálculo II', 4, 4, ARRAY['MA1001']),
('ingenieriaTopografica', 'SR-I', 'Seminario de Realidad Nacional I', 2, 4, ARRAY['EG-II']),

-- V CICLO
('ingenieriaTopografica', 'FS0310', 'Física General II', 3, 5, ARRAY['FS0210', 'FS0211', 
'MA1002']),
('ingenieriaTopografica', 'FS0311', 'Laboratorio de Física General II', 1, 5, 
ARRAY['FS0210', 'FS0211', 'MA1002']),
('ingenieriaTopografica', 'IT3002', 'Elementos de Hidrología', 3, 5, ARRAY['IT2002', 
'IT3005', 'IT3006', 'IT4002', 'MA1001']),
('ingenieriaTopografica', 'IT4005', 'Replanteo Topográfico y Construcción de Obras', 3, 5, 
ARRAY['IT3005', 'IT3006', 'IT4004', 'MA1002']),
('ingenieriaTopografica', 'IT4006', 'Práctica de Replanteo Topográfico y Const.', 2, 5, 
ARRAY['IT3005', 'IT3006', 'IT4004', 'MA1002']),
('ingenieriaTopografica', 'MA1004', 'Álgebra Lineal', 3, 5, ARRAY[]::text[]),
('ingenieriaTopografica', 'SR-II', 'Seminario de Realidad Nacional II', 2, 5, 
ARRAY['SR-I']),

-- VI CICLO
('ingenieriaTopografica', 'IT4003', 'Hidrometría', 3, 6, ARRAY['FS0210', 'FS0211', 
'IT3002']),
('ingenieriaTopografica', 'IT5001', 'Fotogrametría y Fotointerpretación Básica', 3, 6, 
ARRAY['IT3005', 'IT3006', 'IT4002']),
('ingenieriaTopografica', 'IT5004', 'Ingeniería del Terreno', 3, 6, ARRAY['IT3002', 
'IT4005']),
('ingenieriaTopografica', 'IT5005', 'Práctica de Ingeniería del Terreno', 2, 6, 
ARRAY['IT3002', 'IT4005', 'IT4006']),
('ingenieriaTopografica', 'MA2210', 'Ecuaciones Diferenciales Aplicadas', 3, 6, 
ARRAY['MA1001']),
('ingenieriaTopografica', 'XS0217', 'Probabilidades e Inferencia Estadística', 4, 6, 
ARRAY['MA1004']),
('ingenieriaTopografica', 'C10202', 'Principios de Informática', 4, 6, ARRAY['MA1001']),

-- VII CICLO
('ingenieriaTopografica', 'IT5002', 'Urbanismo', 4, 7, ARRAY['IT4003', 'IT5004']),
('ingenieriaTopografica', 'IT5003', 'Errores y Ajustes Geodésicos', 3, 7, ARRAY['IT3005', 
'IT4002', 'MA1004', 'XS0217']),
('ingenieriaTopografica', 'IT5007', 'Administración para Ingeniería Topográfica', 3, 7, 
ARRAY['IT4003', 'MA2210']),
('ingenieriaTopografica', 'IT6002', 'Fotogrametría y Fotointerpretación Aplicada', 3, 7, 
ARRAY['IT5001', 'IT5004']),

-- VIII CICLO
('ingenieriaTopografica', 'FS0312', 'Óptica Geométrica', 3, 8, ARRAY['FS0310', 'FS0311']),
('ingenieriaTopografica', 'IT5006', 'Control de Obras e Instrumentación', 3, 8, 
ARRAY['IT5003', 'IT5004']),
('ingenieriaTopografica', 'IT6001', 'Avalúo y Peritaje de Bienes', 3, 8, ARRAY['IT5007']),
('ingenieriaTopografica', 'IT6003', 'Ingeniería Municipal', 3, 8, ARRAY['IT5002', 
'XS0217']),
('ingenieriaTopografica', 'IT6004', 'Diseño Topográfico de Urbanizaciones', 4, 8, 
ARRAY['IT5002', 'IT5003']),

-- IX CICLO (Inicio de Licenciatura)
('ingenieriaTopografica', 'IT7001', 'Aplicación de Sistemas CAD', 4, 9, ARRAY['C10202', 
'FS0312', 'IT6004']),
('ingenieriaTopografica', 'IT7002', 'Hidrología Subterránea', 3, 9, ARRAY['IT6004', 
'XS0217']),
('ingenieriaTopografica', 'IT7003', 'Sistemas de Información Territorial y Geoc.', 4, 9, 
ARRAY['IT6003', 'XS0217']),
('ingenieriaTopografica', 'IT7004', 'Legislación Aplicada', 3, 9, ARRAY['IT6001']),
('ingenieriaTopografica', 'IT7005', 'Catastro Municipal', 3, 9, ARRAY['IT6003']),
('ingenieriaTopografica', 'IT7006', 'Métodos y Técnicas de Comunicación e Inves.', 2, 9, 
ARRAY['XS0217']),

-- X CICLO
('ingenieriaTopografica', 'IT8001', 'Sistemas de Posicionamiento Global (GPS)', 4, 10, 
ARRAY['IT7001']),
('ingenieriaTopografica', 'IT8003', 'Fotogrametría Digital', 4, 10, ARRAY['IT7001', 
'IT7003']),
('ingenieriaTopografica', 'IT8004', 'Metodologías de Avalúos de Terrenos y Edi.', 3, 10, 
ARRAY['IT7005']),
('ingenieriaTopografica', 'IT8005', 'Geodesia Superior', 3, 10, ARRAY['IT7005']),
('ingenieriaTopografica', 'OPT919', 'Optativos de la Licenciatura en Ingeniería T.', 3, 10, 
ARRAY[]::text[]),

-- XI CICLO (Bloque de Graduación TFG)
('ingenieriaTopografica', 'OPT1115', 'Bloque para TFG', 0, 11, ARRAY[]::text[]),
('ingenieriaTopografica', 'IT9500', 'Investigación Dirigida I', 0, 11, ARRAY[]::text[]),
('ingenieriaTopografica', 'IT9501', 'Investigación Dirigida II', 0, 11, ARRAY[]::text[]),
('ingenieriaTopografica', 'IT9502', 'Investigación Dirigida III', 0, 11, ARRAY[]::text[]),
('ingenieriaTopografica', 'IT9600', 'Seminario de Graduación', 0, 11, ARRAY[]::text[]),
('ingenieriaTopografica', 'IT9601', 'Seminario de Graduación II', 0, 11, ARRAY[]::text[]),
('ingenieriaTopografica', 'IT9602', 'Seminario de Graduación III', 0, 11, ARRAY[]::text[]),
('ingenieriaTopografica', 'IT9700', 'Práctica Dirigida I', 0, 11, ARRAY[]::text[]),
('ingenieriaTopografica', 'IT9701', 'Práctica Dirigida II', 0, 11, ARRAY[]::text[]),
('ingenieriaTopografica', 'IT9702', 'Práctica Dirigida III', 0, 11, ARRAY[]::text[]),
('ingenieriaTopografica', 'IT9800', 'Proyecto de Graduación I', 0, 11, ARRAY[]::text[]),
('ingenieriaTopografica', 'IT9801', 'Proyecto de Graduación II', 0, 11, ARRAY[]::text[]),
('ingenieriaTopografica', 'IT9802', 'Proyecto de Graduación III', 0, 11, ARRAY[]::text[]),

-- ASIGNATURAS DEL BLOQUE OPTATIVO (OPT919)
('ingenieriaTopografica', 'IT8006', 'Elementos de Ingeniería Ambiental para Topografía', 3, 
10, ARRAY['IT7002']),
('ingenieriaTopografica', 'IT8007', 'Taller Diag. y Diseño de Procesos de Capacitación', 3, 
10, ARRAY['IT7006']),
('ingenieriaTopografica', 'LM1030', 'Estrategias de Lectura en Inglés I', 4, 10, ARRAY[]::text[])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- LICENCIATURA EN INGENIERÍA ELÉCTRICA
-- carrera_id: 'licenciatura_electrica' | Cursos: 10
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) 
VALUES
-- CICLO IX (Grado Avanzado de Licenciatura)
('licenciatura_electrica', 'IE-0579', 'Administración de Sistemas', 4, 9, 
ARRAY['IE-0479']::text[]),
('licenciatura_electrica', 'IE-0613', 'Electrónica Industrial', 4, 9, 
ARRAY['IE-0413','IE-0315']::text[]),
('licenciatura_electrica', 'IE-0599', 'Anteproyecto de TFG', 4, 9, 
ARRAY['IE-0499']::text[]),
('licenciatura_electrica', 'IE-Optativa_L_I', 'Optativa I (Nivel Licenciatura)', 3, 9, 
ARRAY[]::text[]),
('licenciatura_electrica', 'IE-Optativa_L_II', 'Optativa II (Nivel Licenciatura)', 3, 9, 
ARRAY[]::text[]),

-- CICLO X (Bloque Conclusivo de Graduación)
('licenciatura_electrica', 'IE-0679', 'Ciencia de Datos para la Est. y Pron. de Eventos', 3, 
10, ARRAY['IE-0405','IE-0579']::text[]),
('licenciatura_electrica', 'IE-0541', 'Seguridad Ocupacional', 3, 10, 
ARRAY['IE-0501']::text[]),
('licenciatura_electrica', 'IE-Optativa_L_III', 'Optativa III (Nivel Licenciatura)', 3, 10, 
ARRAY[]::text[]),
('licenciatura_electrica', 'IE-Optativa_L_IV', 'Optativa IV (Nivel Licenciatura)', 3, 10, 
ARRAY[]::text[]),
('licenciatura_electrica', 'IE-TFG', 'Trabajo Final de Graduación (Tesis / Proyecto / 
Práctica)', 12, 10, ARRAY['IE-0599']::text[])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- ODONTOLOGÍA (LICENCIATURA)
-- carrera_id: 'odontologiaLic' | Cursos: 102
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) 
VALUES
-- I CICLO
('odontologiaLic', 'B0106', 'Biología General', 3, 1, ARRAY[]::text[]),
('odontologiaLic', 'B0107', 'Laboratorio de Biología General', 1, 1, ARRAY[]::text[]),
('odontologiaLic', 'EG-', 'Curso de Arte', 2, 1, ARRAY[]::text[]),
('odontologiaLic', 'EG-I', 'Curso Integrado de Humanidades I', 6, 1, ARRAY[]::text[]),
('odontologiaLic', 'MA0125', 'Matemática Elemental', 2, 1, ARRAY[]::text[]),
('odontologiaLic', 'QU0114', 'Química General Intensiva', 4, 1, ARRAY[]::text[]),
('odontologiaLic', 'QU0115', 'Laboratorio de Química General Intensiva', 1, 1, ARRAY[]::text[]),

-- II CICLO
('odontologiaLic', 'EF-', 'Actividad Deportiva', 0, 2, ARRAY[]::text[]),
('odontologiaLic', 'EG-II', 'Curso Integrado de Humanidades II', 6, 2, ARRAY['EG-I']::text[]),
('odontologiaLic', 'FS0121', 'Fundamentos de Física', 2, 2, ARRAY[]::text[]),
('odontologiaLic', 'MN0220', 'Anatomía Macroscópica', 4, 2, ARRAY['B0106', 'B0107']::text[]),

-- III CICLO
('odontologiaLic', 'F5011', 'Ética Profesional para Odontología', 1, 3, ARRAY[]::text[]),
('odontologiaLic', 'MN0116', 'Histología', 4, 3, ARRAY['MN0220']::text[]),
('odontologiaLic', 'O0221', 'Innovación y Emprendimiento en Odontología', 1, 3, ARRAY[]::text[]),
('odontologiaLic', 'O2000', 'Anatomía Dental Descriptiva y Funcional I', 4, 3, ARRAY['FS0121', 
'MN0220']::text[]),
('odontologiaLic', 'QU0210', 'Fundamentos de Química Orgánica', 4, 3, ARRAY['QU0114', 
'QU0115']::text[]),
('odontologiaLic', 'QU0211', 'Laboratorio de Fundamentos de Química Orgánica', 1, 3, 
ARRAY['QU0114', 'QU0115']::text[]),
('odontologiaLic', 'XS0235', 'Fundamentos de Bioestadística', 3, 3, ARRAY[]::text[]),

-- IV CICLO
('odontologiaLic', 'MN0100', 'Anatomía, Cabeza y Cuyo', 4, 4, ARRAY['MN0220', 
'O2000']::text[]),
('odontologiaLic', 'MQ0310', 'Bioquímica Dental', 4, 4, ARRAY['QU0210', 'QU0211']::text[]),
('odontologiaLic', 'O0222', 'Infectología para Odontología', 1, 4, ARRAY[]::text[]),
('odontologiaLic', 'O0223', 'Anatomía Dental Descriptiva y Funcional II', 1, 4, 
ARRAY['O2000']::text[]),
('odontologiaLic', 'O0441', 'Epidemiología y Ecología del Biofilme Dental', 3, 4, 
ARRAY['O2000', 'XS0235']::text[]),
('odontologiaLic', 'O3009', 'Patología General', 1, 4, ARRAY['MN0116', 'MN0220']::text[]),
('odontologiaLic', 'O3013', 'Radiología', 1, 4, ARRAY['O2000']::text[]),
('odontologiaLic', 'SR-I', 'Seminario de Realidad Nacional I', 2, 4, ARRAY['EG-II']::text[]),

-- V CICLO
('odontologiaLic', 'MF1000', 'Fisiología Humana', 6, 5, ARRAY['MQ0310']::text[]),
('odontologiaLic', 'O0224', 'Introducción a la Administración Clínica y Gestión de Servicios de 
Salud', 1, 5, ARRAY[]::text[]),
('odontologiaLic', 'O0247', 'Principios de Ciencias Diagnósticas', 5, 5, ARRAY['MN0100', 
'O0221', 'O0222', 'O3009', 'O3013']::text[]),
('odontologiaLic', 'O0248', 'Epidemiología, Ecología y Atención de la Caries Dental', 3, 5, 
ARRAY['O0223', 'O0441']::text[]),
('odontologiaLic', 'O0261', 'Interpretación Radiológica Oral y Maxilofacial', 1, 5, 
ARRAY['MN0100', 'O3013']::text[]),
('odontologiaLic', 'O0440', 'Fundamentos de Bio-materiales', 4, 5, ARRAY['MQ0310']::text[]),
('odontologiaLic', 'O3015', 'Anestesia', 2, 5, ARRAY['MN0100']::text[]),

-- VI CICLO
('odontologiaLic', 'FR0414', 'Farmacología para Odontología I', 2, 6, ARRAY['MF1000', 'MQ0310', 
'O0222']::text[]),
('odontologiaLic', 'O0225', 'Oclusión Dental', 1, 6, ARRAY['MF1000', 'O0223', 
'O0440']::text[]),
('odontologiaLic', 'O0226', 'Patología Oral I', 1, 6, ARRAY['O0261', 'O0247']::text[]),
('odontologiaLic', 'O0249', 'Exodoncia', 1, 6, ARRAY['O0261', 'O0247', 'O0223', 
'O3015']::text[]),
('odontologiaLic', 'O0360', 'Restaurativa Operatoria', 3, 6, ARRAY['O0261', 'O0440', 
'O0248']::text[]),
('odontologiaLic', 'O3002', 'Crecimiento Facial y Desarrollo de la Oclusión', 2, 6, 
ARRAY['MN0100']::text[]),
('odontologiaLic', 'RP-1', 'Repertorio', 3, 6, ARRAY[]::text[]),
('odontologiaLic', 'SR-II', 'Seminario de Realidad Nacional II', 2, 6, ARRAY['SR-I']::text[]),

-- VII CICLO
('odontologiaLic', 'FR0415', 'Farmacología para Odontología II', 2, 7, 
ARRAY['FR0414']::text[]),
('odontologiaLic', 'O0233', 'Periodoncia I', 2, 7, ARRAY['O0226']::text[]),
('odontologiaLic', 'O0239', 'Abordaje Comunitario y Epidemiológico de la Enfermedad Periodontal 
y Maloclusión', 1, 7, ARRAY['O0248']::text[]),
('odontologiaLic', 'O0250', 'Clínica de Exodoncia I', 1, 7, ARRAY['FR0414', 'O0226', 
'O0249']::text[]),
('odontologiaLic', 'O0252', 'Endodoncia I', 1, 7, ARRAY['O0360']::text[]),
('odontologiaLic', 'O0256', 'Métodos de Investigación', 2, 7, ARRAY['O0221', 
'XS0235']::text[]),
('odontologiaLic', 'O0319', 'Clínica Introductoria de Ciencias Restaurativas', 1, 7, 
ARRAY['O0225', 'O0360']::text[]),
('odontologiaLic', 'O0330', 'Restaurativa Protésica Removible I', 2, 7, 
ARRAY['O0360']::text[]),
('odontologiaLic', 'O0331', 'Restaurativa Protésica Fija I', 1, 7, ARRAY['O0360']::text[]),
('odontologiaLic', 'O4008', 'Odontología Infantil I', 2, 7, ARRAY['O0360']::text[]),
('odontologiaLic', 'O4013', 'Ortodoncia I', 1, 7, ARRAY['O3002']::text[]),
('odontologiaLic', 'O4019', 'Principios de Medicina', 1, 7, ARRAY['O0226']::text[]),

-- VIII CICLO
('odontologiaLic', 'O0230', 'Clínica de Ciencias Restaurativas I', 3, 8, ARRAY['O0319', 
'O0330', 'O0331']::text[]),
('odontologiaLic', 'O0251', 'Clínica de Exodoncia II', 1, 8, ARRAY['FR0415', 'O0250', 
'O4019']::text[]),
('odontologiaLic', 'O0253', 'Endodoncia II', 2, 8, ARRAY['O0252']::text[]),
('odontologiaLic', 'O0254', 'Periodoncia II', 2, 8, ARRAY['FR0415', 'O0233', 'O4019']::text[]),
('odontologiaLic', 'O0255', 'Medicina Oral', 2, 8, ARRAY['FR0415', 'O4019']::text[]),
('odontologiaLic', 'O0259', 'Restaurativa Protésica Removible II', 1, 8, ARRAY['O0319', 
'O0330']::text[]),
('odontologiaLic', 'O0260', 'Restaurativa Protésica Fija II', 2, 8, ARRAY['O0319', 
'O0331']::text[]),
('odontologiaLic', 'O0445', 'Proceso Salud-Enfermedad Oral en la Niñez y la Adolescencia', 1, 
8, ARRAY[]::text[]),
('odontologiaLic', 'O4000', 'Cirugía Oral I', 2, 8, ARRAY['O0250']::text[]),
('odontologiaLic', 'O4009', 'Odontología Infantil II', 2, 8, ARRAY['O4008']::text[]),
('odontologiaLic', 'O4025', 'Ortodoncia II', 2, 8, ARRAY['O4013']::text[]),
('odontologiaLic', 'O4026', 'Taller de Ortodoncia', 1, 8, ARRAY['O4025']::text[]),

-- IX CICLO
('odontologiaLic', 'O0236', 'Seminario de Oclusión', 1, 9, ARRAY['O0259', 'O0260']::text[]),
('odontologiaLic', 'O0262', 'Manejo de Emergencias Médicas en Odontología', 1, 9, 
ARRAY['FR0415', 'O4019']::text[]),
('odontologiaLic', 'O5001', 'Cirugía Oral II', 2, 9, ARRAY['FR0415', 'O0251', 
'O4000']::text[]),
('odontologiaLic', 'OPT1096', 'Bloque de Clínica de Diagnóstico', 2, 9, ARRAY[]::text[]),
('odontologiaLic', 'OPT1097', 'Bloque de Clínica de Periodoncia', 4, 9, ARRAY[]::text[]),
('odontologiaLic', 'OPT1098', 'Bloque de Clínica de Exodoncia y Cirugía', 2, 9, ARRAY[]::text[]),
('odontologiaLic', 'OPT1099', 'Bloque de Clínica de Ciencias Restaurativas', 8, 9, ARRAY[]::text[]),
('odontologiaLic', 'OPT1100', 'Bloque de Clínica de Endodoncia', 2, 9, ARRAY[]::text[]),
('odontologiaLic', 'OPT1101', 'Bloque de Clínica de Odontopediatría y Ortodoncia', 4, 9, ARRAY[]::text[]),

-- X CICLO
('odontologiaLic', 'O0246', 'Desórdenes Temporomandibulares y Dolor Orofacial', 2, 10, 
ARRAY['O0236']::text[]),
('odontologiaLic', 'O0447', 'Políticas Públicas del Sector Salud con Énfasis en Odontología', 
2, 10, ARRAY['O0445']::text[]),
('odontologiaLic', 'O0448', 'Odontología Geriátrica', 2, 10, ARRAY['O0255']::text[]),

-- XI CICLO
('odontologiaLic', 'O0258', 'Patología Oral II', 2, 11, ARRAY['O0246']::text[]),
('odontologiaLic', 'O0446', 'Administración de Servicios Odontológicos', 2, 11, 
ARRAY['O0447']::text[]),
('odontologiaLic', 'O0636', 'Seminario Integral', 2, 11, ARRAY[]::text[]),
('odontologiaLic', 'O6010', 'Clínica Integral', 4, 11, ARRAY['O0238', 'O0257']::text[]),
('odontologiaLic', 'O6011', 'Clínica de Énfasis', 3, 11, ARRAY['O0238']::text[]),
('odontologiaLic', 'O6012', 'Clínica de Odontopediatría y Ortodoncia III', 2, 11, 
ARRAY['O0263']::text[]),

-- XII CICLO
('odontologiaLic', 'O6004', 'Externado Clínico', 10, 12, ARRAY['O0263', 'O0238', 'O0257', 
'O0447', 'O0448']::text[]),

-- SEMINARIOS DE GRADUACIÓN / TFG (CICLOS XIII, XIV, XV)
('odontologiaLic', 'O9600', 'Seminario de Graduación 1', 0, 13, ARRAY[]::text[]),
('odontologiaLic', 'O9601', 'Seminario de Graduación 2', 0, 14, ARRAY[]::text[]),
('odontologiaLic', 'O9602', 'Seminario de Graduación 3', 0, 15, ARRAY[]::text[]),

-- ASIGNATURAS CONTENIDAS EN LOS BLOQUES CLÍNICOS OPTATIVOS (OPT1096 AL OPT1101)
('odontologiaLic', 'O0240', 'Clínica de Diagnóstico I', 1, 9, ARRAY['FR0415', 
'O0255']::text[]),
('odontologiaLic', 'O0241', 'Clínica de Diagnóstico II', 1, 9, ARRAY['O0240']::text[]),
('odontologiaLic', 'O0268', 'Clínica de Diagnóstico', 2, 9, ARRAY['FR0415', 'O0255']::text[]),
('odontologiaLic', 'O0242', 'Clínica de Periodoncia I', 2, 9, ARRAY['FR0415', 'O0254', 
'O0255']::text[]),
('odontologiaLic', 'O0243', 'Clínica de Periodoncia II', 2, 9, ARRAY['O0242']::text[]),
('odontologiaLic', 'O0267', 'Clínica de Periodoncia', 4, 9, ARRAY['FR0415', 'O0254', 
'O0255']::text[]),
('odontologiaLic', 'O0257', 'Clínica de Ciencias Restaurativas II', 4, 9, ARRAY['O0236', 
'O0237', 'O0541']::text[]),
('odontologiaLic', 'O0265', 'Clínica de Ciencias Restaurativas', 8, 9, ARRAY['FR0415', 'O0230', 
'O0231', 'O0232', 'O0253']::text[]),
('odontologiaLic', 'O0541', 'Clínica de Ciencias Restaurativas I', 4, 9, ARRAY['FR0415', 
'O0230', 'O0231', 'O0232', 'O0253']::text[]),
('odontologiaLic', 'O0237', 'Clínica de Endodoncia I', 1, 9, ARRAY['FR0415', 'O0230', 'O0231', 
'O0232', 'O0253']::text[]),
('odontologiaLic', 'O0238', 'Clínica de Endodoncia II', 1, 9, ARRAY['O0237', 'O0541']::text[]),
('odontologiaLic', 'O0264', 'Clínica de Endodoncia', 2, 9, ARRAY['FR0415', 'O0230', 'O0231', 
'O0232', 'O0253']::text[]),
('odontologiaLic', 'O0263', 'Clínica de Odontopediatría y Ortodoncia', 4, 9, ARRAY['FR0415', 
'O0445', 'O4009', 'O4025', 'O4026']::text[]),
('odontologiaLic', 'O0540', 'Clínica de Odontología Infantil y Ortodoncia I', 2, 9, 
ARRAY['FR0415', 'O0445', 'O4009', 'O4025', 'O4026']::text[]),
('odontologiaLic', 'O0543', 'Clínica de Odontología Infantil y Ortodoncia II', 2, 9, 
ARRAY['O0540']::text[])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- NUTRICIÓN
-- carrera_id: 'nutricion' | Cursos: 56
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) 
VALUES
-- I CICLO
('nutricion', 'CH1010', 'Introducción a la Nutrición Humana', 2, 1, ARRAY[]::text[]),
('nutricion', 'EG-I', 'Curso Integrado de Humanidades I', 6, 1, ARRAY[]::text[]),
('nutricion', 'MA0001', 'Precálculo', 0, 1, ARRAY[]::text[]),
('nutricion', 'QU0101', 'Química General I', 4, 1, ARRAY[]::text[]),
('nutricion', 'QU0103', 'Laboratorio de Química General I', 1, 1, ARRAY[]::text[]),

-- II CICLO
('nutricion', 'B0106', 'Biología General', 3, 2, ARRAY[]::text[]),
('nutricion', 'B0107', 'Laboratorio de Biología General', 1, 2, ARRAY[]::text[]),
('nutricion', 'EF-', 'Actividad Deportiva', 0, 2, ARRAY[]::text[]),
('nutricion', 'EG-II', 'Curso Integrado de Humanidades II', 6, 2, ARRAY['EG-I']),
('nutricion', 'QU0102', 'Química General II', 4, 2, ARRAY['QU0101', 'QU0103']),
('nutricion', 'QU0104', 'Laboratorio de Química General II', 1, 2, ARRAY['QU0101', 
'QU0103']),

-- III CICLO
('nutricion', 'AN2103', 'Anatomía Humana para Nutrición', 3, 3, ARRAY['B0106', 'B0107']),
('nutricion', 'NU1001', 'Fundamentos de la Ciencia de los Alimentos', 4, 3, ARRAY['QU0102', 
'QU0104']),
('nutricion', 'QU0210', 'Fundamentos de Química Orgánica', 3, 3, ARRAY['QU0102', 'QU0104']),
('nutricion', 'QU0211', 'Laboratorio de Química Orgánica', 1, 3, ARRAY['QU0102', 'QU0104']),
('nutricion', 'RP-1', 'Repertorio', 3, 3, ARRAY[]::text[]),

-- IV CICLO
('nutricion', 'BC0113', 'Bioquímica para Nutrición', 4, 4, ARRAY['QU0210', 'QU0211']),
('nutricion', 'FI2102', 'Fisiología Humana para Nutrición', 4, 4, ARRAY['AN2103']),
('nutricion', 'H2102', 'Histología Humana para Nutrición', 2, 4, ARRAY['AN2103']),
('nutricion', 'NU2001', 'Nutrición Humana I', 4, 4, ARRAY['NU1001', 'QU0210']),

-- V CICLO
('nutricion', 'MB1101', 'Microbiología General para Nutrición', 4, 5, ARRAY['BC0113']),
('nutricion', 'NU2002', 'Nutrición Humana II', 4, 5, ARRAY['NU2001', 'FI2102']),
('nutricion', 'NU2003', 'Economía y Disponibilidad Alimentaria', 3, 5, ARRAY['NU2001']),
('nutricion', 'NU2004', 'Preparación de Alimentos', 4, 5, ARRAY['NU1001', 'BC0113']),
('nutricion', 'SR-I', 'Seminario de Realidad Nacional I', 2, 5, ARRAY['EG-II']),

-- VI CICLO
('nutricion', 'FA1402', 'Farmacología para Nutrición', 3, 6, ARRAY['FI2102', 'BC0113']),
('nutricion', 'NU3001', 'Nutrición Clínica I', 4, 6, ARRAY['NU2002', 'MB1101']),
('nutricion', 'NU3002', 'Nutrición en el Ciclo Vital', 4, 6, ARRAY['NU2002']),
('nutricion', 'NU3003', 'Administración de Servicios de Alimentación I', 4, 6, 
ARRAY['NU2004']),
('nutricion', 'SR-II', 'Seminario de Realidad Nacional II', 2, 6, ARRAY['SR-I']),

-- VII CICLO
('nutricion', 'NU3004', 'Nutrición Clínica II', 4, 7, ARRAY['NU3001', 'FA1402']),
('nutricion', 'NU3005', 'Nutrición Pública I', 4, 7, ARRAY['NU2003', 'NU3002']),
('nutricion', 'NU3006', 'Administración de Servicios de Alimentación II', 4, 7, 
ARRAY['NU3003']),
('nutricion', 'NU3007', 'Metodología de la Investigación en Nutrición', 3, 7, 
ARRAY['NU3001', 'NU3002']),

-- VIII CICLO (Cierre del Grado de Bachillerato)
('nutricion', 'NU4001', 'Nutrición Clínica III', 4, 8, ARRAY['NU3004']),
('nutricion', 'NU4002', 'Nutrición Pública II', 4, 8, ARRAY['NU3005']),
('nutricion', 'NU4003', 'Educación y Comunicación en Nutrición', 4, 8, ARRAY['NU3005', 
'NU3007']),
('nutricion', 'NU4004', 'Práctica Bachillerato en Servicios de Alimentación', 3, 8, 
ARRAY['NU3006']),

-- IX CICLO (Grado de Licenciatura)
('nutricion', 'NU5001', 'Práctica Integral en Nutrición Clínica', 5, 9, ARRAY['NU4001']),
('nutricion', 'NU5002', 'Práctica Integral en Nutrición Pública', 5, 9, ARRAY['NU4002']),
('nutricion', 'NU5003', 'Gestión de Proyectos en Alimentación y Nutrición', 3, 9, 
ARRAY['NU4002', 'NU4003']),
('nutricion', 'NU5004', 'Seminario de Licenciatura', 2, 9, ARRAY['NU4003', 'NU4004']),

-- X CICLO (Bloques Finales de Trabajo Final de Graduación / TFG)
('nutricion', 'NU9500', 'Investigación Dirigida 1', 0, 10, ARRAY[]::text[]),
('nutricion', 'NU9501', 'Investigación Dirigida 2', 0, 10, ARRAY[]::text[]),
('nutricion', 'NU9502', 'Investigación Dirigida 3', 0, 10, ARRAY[]::text[]),
('nutricion', 'NU9600', 'Seminario de Graduación 1', 0, 10, ARRAY[]::text[]),
('nutricion', 'NU9601', 'Seminario de Graduación 2', 0, 10, ARRAY[]::text[]),
('nutricion', 'NU9602', 'Seminario de Graduación 3', 0, 10, ARRAY[]::text[]),
('nutricion', 'NU9700', 'Práctica Dirigida 1', 0, 10, ARRAY[]::text[]),
('nutricion', 'NU9701', 'Práctica Dirigida 2', 0, 10, ARRAY[]::text[]),
('nutricion', 'NU9702', 'Práctica Dirigida 3', 0, 10, ARRAY[]::text[]),

-- CURSOS OPTATIVOS DEL BLOQUE DE LA UNIDAD ACADÉMICA (OPT800)
('nutricion', 'NU0300', 'Tópicos Selectos en Alimentación y Nutrición I', 2, 7, 
ARRAY['NU2002']),
('nutricion', 'NU0301', 'Tópicos Selectos en Alimentación y Nutrición II', 3, 7, 
ARRAY['NU2002']),
('nutricion', 'NU0302', 'Nutrición y Deporte', 3, 7, ARRAY['NU2002', 'FI2102']),
('nutricion', 'NU0303', 'Antropología Alimentaria', 2, 7, ARRAY['NU2001']),
('nutricion', 'NU0304', 'Desarrollo de Nuevos Productos Alimenticios', 3, 7, ARRAY['NU2004', 
'BC0113'])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- ODONTOLOGÍA
-- carrera_id: 'odontologia' | Cursos: 73
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) VALUES
-- I CICLO
('odontologia', 'B0106', 'Biología General', 3, 1, ARRAY[]::text[]),
('odontologia', 'B0107', 'Laboratorio de Biología General', 1, 1, ARRAY[]::text[]),
('odontologia', 'EG-', 'Curso de Arte', 2, 1, ARRAY[]::text[]),
('odontologia', 'EG-1', 'Curso Integrado de Humanidades I', 6, 1, ARRAY[]::text[]),
('odontologia', 'MA0125', 'Matemática Elemental', 2, 1, ARRAY[]::text[]),
('odontologia', 'QU0114', 'Química General Intensiva', 4, 1, ARRAY[]::text[]),
('odontologia', 'QU0115', 'Laboratorio de Química General Intensiva', 1, 1, ARRAY[]::text[]),

-- II CICLO
('odontologia', 'AN2104', 'Anatomía Humana para Odontología', 4, 2, ARRAY['B0106', 'B0107']),
('odontologia', 'EF-', 'Actividad Deportiva', 0, 2, ARRAY[]::text[]),
('odontologia', 'EG-II', 'Curso Integrado de Humanidades II', 6, 2, ARRAY['EG-1']),
('odontologia', 'O0110', 'Introducción a la Odontología', 2, 2, ARRAY[]::text[]),
('odontologia', 'O0112', 'Morfología e Histología Dental', 3, 2, ARRAY['B0106', 'B0107']),
('odontologia', 'QU0212', 'Química Orgánica para Odontología', 3, 2, ARRAY['QU0114', 'QU0115']),

-- III CICLO
('odontologia', 'BC0111', 'Bioquímica para Odontología', 4, 3, ARRAY['QU0212']),
('odontologia', 'FI2103', 'Fisiología Humana para Odontología', 4, 3, ARRAY['AN2104']),
('odontologia', 'H2103', 'Histología Humana para Odontología', 3, 3, ARRAY['AN2104']),
('odontologia', 'O0118', 'Materiales Dentales', 3, 3, ARRAY['QU0114', 'O0110', 'O0112']),
('odontologia', 'O0119', 'Preclínica de Operatoria Dental I', 3, 3, ARRAY['O0110', 'O0112']),
('odontologia', 'RP-1', 'Repertorio', 3, 3, ARRAY[]::text[]),

-- IV CICLO
('odontologia', 'MB1104', 'Microbiología para Odontología', 4, 4, ARRAY['BC0111']),
('odontologia', 'O0123', 'Preclínica de Operatoria Dental II', 3, 4, ARRAY['O0118', 'O0119']),
('odontologia', 'O0124', 'Preclínica de Prótesis Total', 3, 4, ARRAY['O0118', 'O0119']),
('odontologia', 'O0126', 'Radiología Oral', 2, 4, ARRAY['AN2104', 'FI2103', 'O0112']),
('odontologia', 'O0127', 'Anatomía Patológica General', 3, 4, ARRAY['H2103', 'FI2103']),
('odontologia', 'SR-1', 'Seminario de Realidad Nacional I', 2, 4, ARRAY['EG-II']),

-- V CICLO
('odontologia', 'FA1401', 'Farmacología para Odontología', 4, 5, ARRAY['FI2103', 'BC0111']),
('odontologia', 'O0130', 'Oclusión', 3, 5, ARRAY['O0123', 'O0124']),
('odontologia', 'O0131', 'Diagnóstico y Medicina Oral I', 3, 5, ARRAY['O0126', 'O0127', 'MB1104']),
('odontologia', 'O0132', 'Preclínica de Prótesis Parcial Fija y Removible I', 3, 5, ARRAY['O0123', 'O0124']),
('odontologia', 'O0133', 'Preclínica de Cirugía y Anestesia Oral', 2, 5, ARRAY['AN2104', 'FI2103', 'MB1104']),
('odontologia', 'O0135', 'Periodoncia I', 2, 5, ARRAY['H2103', 'MB1104', 'O0123']),
('odontologia', 'SR-II', 'Seminario de Realidad Nacional II', 2, 5, ARRAY['SR-1']),

-- VI CICLO
('odontologia', 'O0136', 'Diagnóstico y Medicina Oral II', 2, 6, ARRAY['O0131']),
('odontologia', 'O0137', 'Preclínica de Prótesis Parcial Fija y Removible II', 3, 6, ARRAY['O0130', 'O0132']),
('odontologia', 'O0138', 'Clínica de Diagnóstico I', 2, 6, ARRAY['O0131']),
('odontologia', 'O0139', 'Clínica de Operatoria Dental I', 3, 6, ARRAY['O0123', 'FA1401']),
('odontologia', 'O0140', 'Clínica de Prótesis Total I', 3, 6, ARRAY['O0130']),
('odontologia', 'O0141', 'Cirugía Oral I', 2, 6, ARRAY['O0133', 'FA1401']),
('odontologia', 'O0143', 'Clínica de Periodoncia I', 2, 6, ARRAY['O0135', 'FA1401']),

-- VII CICLO
('odontologia', 'O0144', 'Clínica de Diagnóstico II', 2, 7, ARRAY['O0136', 'O0138']),
('odontologia', 'O0145', 'Clínica de Operatoria Dental II', 2, 7, ARRAY['O0139']),
('odontologia', 'O0146', 'Clínica de Prótesis Total II', 2, 7, ARRAY['O0140']),
('odontologia', 'O0147', 'Clínica de Prótesis Parcial Fija y Removible I', 3, 7, ARRAY['O0137']),
('odontologia', 'O0148', 'Cirugía Oral II', 2, 7, ARRAY['O0141']),
('odontologia', 'O0150', 'Clínica de Periodoncia II', 2, 7, ARRAY['O0143']),
('odontologia', 'O0229', 'Preclínica de Endodoncia', 2, 7, ARRAY['O0123']),
('odontologia', 'O0230', 'Odontopediatría I', 2, 7, ARRAY['O0136', 'O0139']),
('odontologia', 'O0231', 'Ortodoncia I', 2, 7, ARRAY['O0130', 'O0136']),

-- VIII CICLO
('odontologia', 'FR0415', 'Bioestadística y Demografía para Odontología', 2, 8, ARRAY['MA0125']),
('odontologia', 'O0151', 'Odontología Preventiva y Comunitaria I', 3, 8, ARRAY['O0136', 'O0143']),
('odontologia', 'O0232', 'Preclínica de Odontopediatría y Ortodoncia', 2, 8, ARRAY['O0230', 'O0231']),
('odontologia', 'O0233', 'Clínica de Operatoria Dental III', 2, 8, ARRAY['O0145']),
('odontologia', 'O0234', 'Clínica de Prótesis Parcial Fija y Removible II', 3, 8, ARRAY['O0147']),
('odontologia', 'O0235', 'Clínica de Cirugía Oral III', 2, 8, ARRAY['O0148']),
('odontologia', 'O0237', 'Clínica de Endodoncia I', 2, 8, ARRAY['O0229']),
('odontologia', 'O0541', 'Odontogeriatría', 2, 8, ARRAY['O0144', 'O0146', 'O0147', 'O0150']),

-- IX CICLO
('odontologia', 'O0238', 'Clínica de Endodoncia II', 1, 9, ARRAY['O0237', 'O0541']),
('odontologia', 'O0250', 'Odontología Preventiva y Comunitaria II', 2, 9, ARRAY['O0151', 'FR0415']),
('odontologia', 'O0251', 'Odontología Legal y Deontología', 2, 9, ARRAY['O0151']),
('odontologia', 'O0252', 'Administración de Consultorios', 2, 9, ARRAY['O0151']),
('odontologia', 'O0253', 'Clínica de Odontopediatría I', 2, 9, ARRAY['O0232']),
('odontologia', 'O0254', 'Clínica de Ortodoncia I', 2, 9, ARRAY['O0232']),
('odontologia', 'O0255', 'Clínica Integral del Adulto I', 4, 9, ARRAY['O0233', 'O0234', 'O0235']),

-- X CICLO
('odontologia', 'O0256', 'Odontología Preventiva y Comunitaria III', 3, 10, ARRAY['O0250']),
('odontologia', 'O0257', 'Clínica de Odontopediatría II', 2, 10, ARRAY['O0253']),
('odontologia', 'O0259', 'Clínica de Ortodoncia II', 2, 10, ARRAY['O0254']),
('odontologia', 'O0260', 'Clínica Integral del Adulto II', 4, 10, ARRAY['O0255']),
('odontologia', 'O0261', 'Seminario de Integración Clínica', 2, 10, ARRAY['O0255']),

-- XI CICLO (Bloques Especiales / TFG)
('odontologia', 'O0262', 'Internado Clínico en Odontología', 6, 11, ARRAY['O0256', 'O0257', 'O0259', 'O0260', 'O0261']),
('odontologia', 'O0264', 'Clínica de Endodoncia', 0, 11, ARRAY['FR0415', 'O0230', 'O0231', 'O0232']),

-- CURSOS DEL BLOQUE OPTATIVO OBLIGATORIO (OPT1100)
('odontologia', 'O0542', 'Seminario de Endodoncia', 1, 11, ARRAY['O0238']),
('odontologia', 'O0543', 'Tópicos Selectos de Endodoncia', 1, 11, ARRAY['O0238']),
('odontologia', 'O0544', 'Preclínica de Endodoncia Avanzada', 1, 11, ARRAY['O0238'])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- SISTEMAS DE ENERGÍA
-- carrera_id: 'sistemas_energia' | Cursos: 50
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) 
VALUES
-- CICLO I
('sistemas_energia', 'EG-I', 'Curso Integrado de Humanidades I', 6, 1, ARRAY[]::text[]),
('sistemas_energia', 'QU-0100', 'Química General I', 3, 1, ARRAY[]::text[]),
('sistemas_energia', 'QU-0101', 'Laboratorio de Química General I', 1, 1, ARRAY[]::text[]),
('sistemas_energia', 'MA-1101', 'Cálculo I', 3, 1, ARRAY[]::text[]),
('sistemas_energia', 'MA-1004', 'Álgebra Lineal', 3, 1, ARRAY[]::text[]),
('sistemas_energia', 'EF-', 'Actividad Deportiva', 0, 1, ARRAY[]::text[]),
('sistemas_energia', 'EG-', 'Curso de Arte', 2, 1, ARRAY[]::text[]),

-- CICLO II
('sistemas_energia', 'EG-II', 'Curso Integrado de Humanidades II', 6, 2, 
ARRAY['EG-I']::text[]),
('sistemas_energia', 'CI-0202', 'Principios de Informática', 4, 2, 
ARRAY['MA-1101']::text[]),
('sistemas_energia', 'MA-1002', 'Cálculo II', 4, 2, ARRAY['MA-1101']::text[]),
('sistemas_energia', 'FS-0210', 'Física General I', 3, 2, ARRAY['MA-1101']::text[]),
('sistemas_energia', 'FS-0211', 'Laboratorio de Física General I', 1, 2, 
ARRAY['MA-1101']::text[]),

-- CICLO III
('sistemas_energia', 'IM-0101', 'Gráfica', 3, 3, ARRAY['MA-1002']::text[]),
('sistemas_energia', 'IE-0209', 'Circuitos Lineales I', 3, 3, 
ARRAY['MA-1002','MA-1004','FS-0210','FS-0211']::text[]),
('sistemas_energia', 'MA-1003', 'Cálculo III', 4, 3, ARRAY['MA-1002','MA-1004']::text[]),
('sistemas_energia', 'FS-0310', 'Física General II', 3, 3, 
ARRAY['MA-1002','FS-0210','FS-0211']::text[]),
('sistemas_energia', 'FS-0311', 'Laboratorio de Física General II', 1, 3, 
ARRAY['MA-1002','FS-0210','FS-0211']::text[]),
('sistemas_energia', 'MA-1005', 'Ecuaciones Diferenciales', 4, 3, 
ARRAY['MA-1002','MA-1004']::text[]),

-- CICLO IV
('sistemas_energia', 'IM-0207', 'Mecánica I', 3, 4, 
ARRAY['FS-0210','FS-0211','MA-1002','IM-0101']::text[]),
('sistemas_energia', 'IE-0309', 'Circuitos Lineales II', 3, 4, 
ARRAY['IE-0209','MA-1005','FS-0310','FS-0311']::text[]),
('sistemas_energia', 'IE-0247', 'Señales y Sistemas I', 3, 4, 
ARRAY['IE-0209','MA-1005']::text[]),
('sistemas_energia', 'FS-0410', 'Física General III', 3, 4, 
ARRAY['MA-1003','FS-0310','FS-0311']::text[]),
('sistemas_energia', 'FS-0411', 'Laboratorio de Física General III', 1, 4, 
ARRAY['MA-1003','FS-0310','FS-0311']::text[]),
('sistemas_energia', 'IE-0313', 'Electrónica I', 3, 4, ARRAY['IE-0209']::text[]),
('sistemas_energia', 'SR-I', 'Seminario de Realidad Nacional I', 2, 4, 
ARRAY['EG-II']::text[]),

-- CICLO V
('sistemas_energia', 'IM-0307', 'Mecánica II', 3, 5, ARRAY['IM-0207']::text[]),
('sistemas_energia', 'IE-0323', 'Sistemas Digitales I', 4, 5, ARRAY['IE-0313']::text[]),
('sistemas_energia', 'IE-0347', 'Señales y Sistemas II', 3, 5, ARRAY['IE-0247']::text[]),
('sistemas_energia', 'IE-0307', 'Electromagnetismo I', 3, 5, 
ARRAY['FS-0410','FS-0411','IE-0247','IE-0313','MA-1003']::text[]),
('sistemas_energia', 'IE-0413', 'Electrónica II', 3, 5, ARRAY['IE-0247','IE-0313']::text[]),
('sistemas_energia', 'IE-0308', 'Laboratorio de Electrónica I', 3, 5, 
ARRAY['IE-0309','IE-0313']::text[]),

-- CICLO VI
('sistemas_energia', 'RP-', 'Repertorio', 3, 6, ARRAY[]::text[]),
('sistemas_energia', 'IE-0281', 'Termofluidos', 3, 6, 
ARRAY['FS-0310','FS-0311','QU-0100','QU-0101']::text[]),
('sistemas_energia', 'IE-0405', 'Modelos Probabilísticos de Señales y Sistemas', 3, 6, 
ARRAY['IE-0347']::text[]),
('sistemas_energia', 'IE-0315', 'Máquinas Eléctricas I', 3, 6, 
ARRAY['IE-0307','IE-0309']::text[]),
('sistemas_energia', 'IE-0316', 'Laboratorio de Máquinas Eléctricas I', 1, 6, 
ARRAY['IE-0307','IE-0309']::text[]),
('sistemas_energia', 'IE-0408', 'Laboratorio de Electrónica II', 3, 6, 
ARRAY['IE-0308','IE-0413']::text[]),
('sistemas_energia', 'IE-0501', 'Responsabilidad en el Ejercicio Profesional', 1, 6, 
ARRAY['IE-0307']::text[]),

-- CICLO VII
('sistemas_energia', 'IE-Optativa_I', 'Optativa I', 3, 7, ARRAY[]::text[]),
('sistemas_energia', 'IE-0365', 'Transmisión de Potencia', 3, 7, 
ARRAY['IE-0315','IE-0316']::text[]),
('sistemas_energia', 'IE-0431', 'Sistemas de Control', 3, 7, ARRAY['IE-0347']::text[]),
('sistemas_energia', 'IE-0615', 'Máquinas Eléctricas II', 3, 7, 
ARRAY['IE-0315','IE-0316','IE-0347']::text[]),
('sistemas_energia', 'IE-0616', 'Laboratorio de Máquinas Eléctricas II', 1, 7, 
ARRAY['IE-0315','IE-0316','IE-0347']::text[]),
('sistemas_energia', 'IE-0381', 'Ciencia de los Materiales', 3, 7, 
ARRAY['FS-0410','FS-0411','QU-0100','QU-0101']::text[]),
('sistemas_energia', 'SR-II', 'Seminario de Realidad Nacional II', 2, 7, 
ARRAY['SR-I']::text[]),

-- CICLO VIII
('sistemas_energia', 'IE-Optativa_II', 'Optativa II', 3, 8, ARRAY[]::text[]),
('sistemas_energia', 'IE-0469', 'Sistemas de Potencia I', 3, 8, 
ARRAY['IE-0365','IE-0615']::text[]),
('sistemas_energia', 'IE-0499', 'Proyecto Eléctrico', 3, 8, ARRAY['IE-0431']::text[]),
('sistemas_energia', 'IE-0471', 'Diseño Eléctrico Industrial I', 3, 8, 
ARRAY['IE-0315','IE-0316']::text[]),
('sistemas_energia', 'IE-0479', 'Ingeniería Económica', 3, 8, ARRAY['IE-0501']::text[])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

