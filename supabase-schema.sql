-- ============================================================
-- SUPABASE SCHEMA - CAMPUS VIRTUAL UCR v2.0
-- Ejecutar COMPLETO en: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Limpieza previa (orden inverso por dependencias)
DROP TABLE IF EXISTS public.user_courses CASCADE;
DROP TABLE IF EXISTS public.courses_catalog CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- ============================================================
-- 1. TABLA: profiles
-- ============================================================
CREATE TABLE public.profiles (
  id              uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       text,
  student_id      text,
  email           text,
  last_active_carrera text DEFAULT 'ingenieriaIndustrial',
  is_admin        boolean DEFAULT false,
  created_at      timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (id)
);

-- Si la tabla ya existe, agrega la columna con:
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
-- UPDATE public.profiles SET is_admin = true WHERE email = 'diegodengosoto@gmail.com';

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- ============================================================
-- 2. TABLA: courses_catalog  (catálogo estático de cursos)
-- ============================================================
CREATE TABLE public.courses_catalog (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  carrera_id  text NOT NULL,
  codigo      text NOT NULL,
  nombre      text NOT NULL,
  creditos    integer NOT NULL DEFAULT 0,
  nivel       integer NOT NULL,
  requisitos  text[] NOT NULL DEFAULT '{}',
  UNIQUE(carrera_id, codigo)
);

ALTER TABLE public.courses_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "catalog_public_read" ON public.courses_catalog FOR SELECT USING (true);


-- ============================================================
-- 3. TABLA: user_courses  (progreso por usuario)
-- ============================================================
CREATE TABLE public.user_courses (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  carrera_id  text NOT NULL,
  course_id   text NOT NULL,
  status      integer NOT NULL DEFAULT 0,
  updated_at  timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, carrera_id, course_id)
);

ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_courses_all" ON public.user_courses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 4. TRIGGER: auto-crear perfil al registrarse
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, student_id)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'student_id', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ============================================================
-- 4.5. RPC: Función para que un usuario pueda eliminar su propia cuenta
-- ============================================================
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void AS $$
BEGIN
  -- Verificar que el usuario que llama a la función está autenticado
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  -- Borrar el usuario de auth.users (la base de datos principal de Supabase Auth)
  -- NOTA: Como la tabla profiles tiene ON DELETE CASCADE, también se borrará el perfil
  -- y se liberará el nombre de usuario (username).
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;



-- ============================================================
-- 5. SEED: INGENIERÍA INDUSTRIAL
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) VALUES
-- I CICLO
('ingenieriaIndustrial','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('ingenieriaIndustrial','EG-','Curso de Arte',2,1,'{}'),
('ingenieriaIndustrial','EF-','Actividad Deportiva',0,1,'{}'),
('ingenieriaIndustrial','MA0001','Pre-Cálculo',0,1,'{}'),
('ingenieriaIndustrial','MA1004','Álgebra Lineal',3,1,'{}'),
('ingenieriaIndustrial','QU0114','Química General Intensiva',4,1,'{}'),
('ingenieriaIndustrial','QU0115','Lab. Química General Intensiva',1,1,'{}'),
('ingenieriaIndustrial','II1118','Introducción a la Ingeniería Industrial',2,1,'{}'),
-- II CICLO
('ingenieriaIndustrial','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('ingenieriaIndustrial','MA1001','Cálculo I',3,2,ARRAY['MA0001']),
('ingenieriaIndustrial','II1119','Fundamentos para Tecnologías Digitales',4,2,ARRAY['II1118']),
('ingenieriaIndustrial','II1121','Gestión de la Ingeniería',2,2,ARRAY['II1118']),
('ingenieriaIndustrial','II1120','Estadística para Ingeniería Industrial I',3,2,ARRAY['II1118']),
-- III CICLO
('ingenieriaIndustrial','FS0210','Física General I',3,3,ARRAY['MA1001']),
('ingenieriaIndustrial','FS0211','Lab. Física General I',1,3,ARRAY['MA1001']),
('ingenieriaIndustrial','MA1002','Cálculo II',4,3,ARRAY['MA1001']),
('ingenieriaIndustrial','II1122','Modelos de Optimización Industrial',3,3,ARRAY['MA1004','II1119']),
('ingenieriaIndustrial','II1124','Ingeniería Económica Industrial I',3,3,ARRAY['II1118']),
('ingenieriaIndustrial','II1123','Estadística para Ingeniería Industrial II',4,3,ARRAY['MA1001','II1120']),
-- IV CICLO
('ingenieriaIndustrial','LM1618','Inglés para Ingeniería Industrial I',0,4,'{}'),
('ingenieriaIndustrial','SR-I','Seminario Realidad Nacional I',2,4,ARRAY['EG-II']),
('ingenieriaIndustrial','FS0310','Física General II',3,4,ARRAY['FS0210','MA1002']),
('ingenieriaIndustrial','FS0311','Lab. Física General II',1,4,ARRAY['FS0210','MA1002']),
('ingenieriaIndustrial','MA1003','Cálculo III',4,4,ARRAY['MA1002']),
('ingenieriaIndustrial','II1126','Modelos Estocásticos y Heurísticos para la Industria',3,4,ARRAY['II1123']),
('ingenieriaIndustrial','II1127','Ingeniería Económica Industrial II',3,4,ARRAY['II1124']),
('ingenieriaIndustrial','II1125','Estadística para Ingeniería Industrial III',3,4,ARRAY['II1123']),
-- V CICLO
('ingenieriaIndustrial','LM1619','Inglés para Ingeniería Industrial II',0,5,ARRAY['LM1618']),
('ingenieriaIndustrial','IM0101','Gráfica',3,5,ARRAY['MA1002']),
('ingenieriaIndustrial','IM-','Curso en construcción (Mecánica)',3,5,ARRAY['FS0210']),
('ingenieriaIndustrial','MA1005','Ecuaciones Diferenciales',4,5,ARRAY['MA1003']),
('ingenieriaIndustrial','II1128','Simulación y Sistemas Dinámicos',3,5,ARRAY['II1126']),
('ingenieriaIndustrial','II1130','Ingeniería de la Sostenibilidad I',2,5,ARRAY['II1127']),
('ingenieriaIndustrial','II1129','Ingeniería de la Información',3,5,ARRAY['II1119']),
-- VI CICLO
('ingenieriaIndustrial','SR-II','Seminario Realidad Nacional II',2,6,ARRAY['SR-I']),
('ingenieriaIndustrial','II1133','Gestión de Proyectos',3,6,ARRAY['II1121','II1122']),
('ingenieriaIndustrial','II1134','Metrología Industrial',3,6,ARRAY['II1125']),
('ingenieriaIndustrial','II1131','Ergonomía y Factores Humanos, Seguridad y Salud en el Trabajo',4,6,ARRAY['II1126']),
('ingenieriaIndustrial','II1132','Diseño y Medición del Trabajo',3,6,ARRAY['II1126']),
('ingenieriaIndustrial','II1135','Analítica Industrial',3,6,ARRAY['II1125','II1128']),
-- VII CICLO
('ingenieriaIndustrial','II1139','Ingeniería Confiabilidad',3,7,ARRAY['II1134']),
('ingenieriaIndustrial','II1140','Desarrollo de Producto y Servicio',3,7,ARRAY['II1127','II1133']),
('ingenieriaIndustrial','II1141','Ingeniería de Sostenibilidad II',2,7,ARRAY['II1130']),
('ingenieriaIndustrial','II1137','Fundamentos para Manufactura',4,7,ARRAY['FS0310']),
('ingenieriaIndustrial','II1138','Ingeniería de Servicios',3,7,ARRAY['II1135']),
('ingenieriaIndustrial','II1136','Ingeniería de la Cadena de Suministro I',3,7,ARRAY['II1135']),
-- VIII CICLO
('ingenieriaIndustrial','LM1620','Inglés para Ingeniería Industrial III',3,8,ARRAY['LM1619']),
('ingenieriaIndustrial','II1145','Ingeniería de Calidad y Mejora Continua',4,8,ARRAY['II1139']),
('ingenieriaIndustrial','II1144','Sistemas de Manufactura',4,8,ARRAY['II1137']),
('ingenieriaIndustrial','II1143','Ingeniería de Operaciones',4,8,ARRAY['II1136']),
('ingenieriaIndustrial','II1142','Ingeniería de la Cadena de Suministro II',3,8,ARRAY['II1136']),
-- IX CICLO
('ingenieriaIndustrial','II1148','Gerencia y Sistemas de Gestión Integrados',3,9,ARRAY['II1121']),
('ingenieriaIndustrial','II1150','Taller de Investigación en Ingeniería',2,9,ARRAY['II1142','II1143','II1144','II1145','LM1620']),
('ingenieriaIndustrial','II1149','Gestión de la Estrategia Industrial',3,9,ARRAY['II1121']),
('ingenieriaIndustrial','II1147','Ingeniería de Instalaciones y de Energía',5,9,ARRAY['II1144','II1143']),
('ingenieriaIndustrial','II1146','Ingeniería de la Cadena de Suministro III',4,9,ARRAY['II1142']),
-- X CICLO
('ingenieriaIndustrial','LM1621','Inglés para Ingeniería Industrial IV',3,10,ARRAY['LM1620']),
('ingenieriaIndustrial','RP-','Repertorio',3,10,'{}'),
('ingenieriaIndustrial','II9500','Investigación Dirigida I',0,10,ARRAY['II1150']),
('ingenieriaIndustrial','II-OPT1','Bloque Optativo I',2,10,'{}'),
('ingenieriaIndustrial','II-OPT2','Bloque Optativo II',2,10,'{}'),
('ingenieriaIndustrial','II-OPT3','Bloque Optativo III',2,10,'{}');


-- ============================================================
-- 6. SEED: CONTADURÍA PÚBLICA
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) VALUES
-- I CICLO
('contaduriaPublica','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('contaduriaPublica','EG-','Curso de Arte',2,1,'{}'),
('contaduriaPublica','RP-','Repertorio',3,1,'{}'),
('contaduriaPublica','DN-0101','Introducción a la Administración de Negocios',3,1,'{}'),
('contaduriaPublica','MA0001','Pre-Cálculo',0,1,'{}'),
('contaduriaPublica','DN-0102','Aplicaciones Ofimáticas para la Toma de Decisiones',3,1,'{}'),
-- II CICLO
('contaduriaPublica','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('contaduriaPublica','EF-','Actividad Deportiva',0,2,'{}'),
('contaduriaPublica','DN-0104','Elementos Fundamentales de Legislación Empresarial',3,2,ARRAY['DN-0101']),
('contaduriaPublica','DN-0103','Administración de Proyectos y Herramientas para el Análisis de Datos',3,2,ARRAY['DN-0102']),
('contaduriaPublica','MA-1021','Cálculo para Ciencias Económicas',4,2,ARRAY['MA0001']),
-- III CICLO
('contaduriaPublica','PC-0200','Contabilidad Básica',4,3,ARRAY['DN-0101']),
('contaduriaPublica','PC-0240','Matemática Financiera',3,3,ARRAY['MA-1021','DN-0103']),
('contaduriaPublica','PC-0261','Legislación Comercial, Bancaria y Financiera',3,3,ARRAY['DN-0104']),
('contaduriaPublica','XS-0276','Estadística General I',4,3,ARRAY['MA-1021']),
('contaduriaPublica','MA-1022','Cálculo para Ciencias Económicas II',4,3,ARRAY['MA-1021']),
('contaduriaPublica','OPT-ING','Opcional I (Inglés)',0,3,ARRAY['DN-0101']),
-- IV CICLO
('contaduriaPublica','SR-I','Seminario de Realidad Nacional I',2,4,ARRAY['EG-II']),
('contaduriaPublica','PC-0260','Legislación Laboral',3,4,ARRAY['PC-0261']),
('contaduriaPublica','PC-0202','Contabilidad Intermedia I',3,4,ARRAY['PC-0200']),
('contaduriaPublica','DN-0123','Metodología de la Investigación',3,4,ARRAY['XS-0276']),
('contaduriaPublica','XS-0277','Estadística General II',4,4,ARRAY['XS-0276','MA-1022']),
('contaduriaPublica','DN-0340','Administración Financiera I',3,4,ARRAY['PC-0240','PC-0200']),
-- V CICLO
('contaduriaPublica','SR-II','Seminario de Realidad Nacional II',2,5,ARRAY['SR-I']),
('contaduriaPublica','PC-0304','Contabilidad Intermedia II',3,5,ARRAY['PC-0240','PC-0202']),
('contaduriaPublica','PC-0320','Auditoría Financiera I',3,5,ARRAY['PC-0202','XS-0276']),
('contaduriaPublica','PC-0241','Negocios y Entorno Económico',3,5,ARRAY['PC-0261']),
('contaduriaPublica','PC-0212','Gerencia y Liderazgo para Contadores',3,5,ARRAY['DN-0101']),
('contaduriaPublica','DN-0341','Administración Financiera II',3,5,ARRAY['DN-0340','XS-0277']),
-- VI CICLO
('contaduriaPublica','PC-0305','Contabilizaciones Especiales',3,6,ARRAY['PC-0304']),
('contaduriaPublica','PC-0321','Auditoría Financiera II',3,6,ARRAY['PC-0320']),
('contaduriaPublica','PC-0211','Muestreo Aplicado a la Auditoría',3,6,ARRAY['XS-0277','PC-0320']),
('contaduriaPublica','DN-0105','Métodos Cuantitativos para la Toma de Decisiones I',3,6,ARRAY['DN-0340','XS-0277','DN-0341','DN-0320']),
('contaduriaPublica','DN-0320','Principios de Mercadeo',3,6,ARRAY['PC-0200','XS-0276']),
('contaduriaPublica','PC-0242','Entorno, Gestión y Control',3,6,ARRAY['PC-0241']),
-- VII CICLO
('contaduriaPublica','PC-0407','Contabilidad Avanzada I',3,7,ARRAY['PC-0305']),
('contaduriaPublica','PC-0204','Laboratorio de Contabilidad',3,7,ARRAY['PC-0305']),
('contaduriaPublica','PC-0421','Auditoría Financiera III',3,7,ARRAY['PC-0321']),
('contaduriaPublica','PC-0462','Legislación Tributaria y Aduanera',3,7,ARRAY['PC-0304','PC-0260']),
('contaduriaPublica','PC-0306','Sistemas de Costeo Básico',3,7,ARRAY['PC-0304']),
('contaduriaPublica','PC-0344','Formulación y Evaluación de Proyectos I',3,7,ARRAY['DN-0341','DN-0110']),
-- VIII CICLO
('contaduriaPublica','PC-0409','Sistemas de Costeo Gerencial',3,8,ARRAY['PC-0306']),
('contaduriaPublica','PC-0410','Contabilidad Avanzada II',3,8,ARRAY['PC-0407']),
('contaduriaPublica','PC-0205','Contabilidad Gubernamental',3,8,ARRAY['PC-0407']),
('contaduriaPublica','PC-0531','Auditoría Financiera IV',3,8,ARRAY['PC-0421']),
('contaduriaPublica','DN-0110','Métodos Cuantitativos para la Toma de Decisiones II',3,8,ARRAY['DN-0105','PC-0344']),
('contaduriaPublica','DN-0525','Mercadeo de Servicios',3,8,ARRAY['DN-0320']),
-- IX CICLO
('contaduriaPublica','PC-0423','Auditoría Informática I',3,9,ARRAY['PC-0531']),
('contaduriaPublica','PC-0424','Laboratorio de Auditoría Informática I',1,9,ARRAY['PC-0531']),
('contaduriaPublica','PC-0425','Control Interno y Auditorías Especiales',3,9,ARRAY['PC-0531']),
('contaduriaPublica','PC-0528','Auditoría de Gestión I',4,9,ARRAY['PC-0531']),
('contaduriaPublica','OPT-2','Inteligencia Emocional en el Trabajo',3,9,ARRAY['DN-0104']),
('contaduriaPublica','DN-0114','Comunicación Intercultural de los Negocios',3,9,ARRAY['PC-0409']),
-- X CICLO
('contaduriaPublica','PC-0526','Auditoría Informática II',3,10,ARRAY['PC-0423','PC-0424']),
('contaduriaPublica','PC-0527','Laboratorio de Auditoría Informática II',1,10,ARRAY['PC-0423','PC-0424']),
('contaduriaPublica','PC-0529','Auditoría de Gestión II',4,10,ARRAY['PC-0528']),
('contaduriaPublica','OPT-3','Valoraciones, Fusiones y Adquisiciones de Empresas',3,10,ARRAY['DN-0104']),
('contaduriaPublica','DN-0115','Taller de Investigación',3,10,ARRAY['DN-0114']),
('contaduriaPublica','PC-0210','Auditoría Interna',3,10,ARRAY['PC-0425']);


-- ============================================================
-- 7. SEED: DIRECCIÓN DE EMPRESAS
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) VALUES
-- I CICLO
('direccionEmpresas','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('direccionEmpresas','EG-','Curso de Arte',2,1,'{}'),
('direccionEmpresas','RP-','Repertorio',3,1,'{}'),
('direccionEmpresas','DN-0101','Introducción a la Administración de Negocios',3,1,'{}'),
('direccionEmpresas','MA0001','Pre-Cálculo',0,1,'{}'),
('direccionEmpresas','XE-0156','Introducción a la Economía',4,1,'{}'),
-- II CICLO
('direccionEmpresas','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('direccionEmpresas','EF-','Actividad Deportiva',0,2,'{}'),
('direccionEmpresas','DN-0102','Aplicaciones Ofimáticas para la Toma de Decisiones',3,2,'{}'),
('direccionEmpresas','MA-1021','Cálculo para Ciencias Económicas I',4,2,ARRAY['MA0001']),
('direccionEmpresas','PC-0200','Contabilidad Básica',4,2,ARRAY['DN-0101||XE-0156']),
-- III CICLO
('direccionEmpresas','DN-0103','Adm. de Proyectos y Herramientas para Toma Dec.',3,3,ARRAY['DN-0102']),
('direccionEmpresas','PC-0240','Matemática Financiera',3,3,ARRAY['MA-1021']),
('direccionEmpresas','PC-0202','Contabilidad Intermedia I',3,3,ARRAY['PC-0200']),
('direccionEmpresas','MA-1022','Cálculo para Ciencias Económicas II',4,3,ARRAY['MA-1021']),
('direccionEmpresas','XS-0276','Estadística General I',4,3,ARRAY['MA-1021']),
('direccionEmpresas','OPT-ING','Opcional I (Inglés)',0,3,ARRAY['DN-0101']),
-- IV CICLO
('direccionEmpresas','XS-0277','Estadística General II',4,4,ARRAY['XS-0276','MA-1022']),
('direccionEmpresas','PC-0304','Contabilidad Intermedia II',3,4,ARRAY['PC-0202','PC-0240']),
('direccionEmpresas','DN-0104','Elementos Fundamentales de Legislación Empresarial',3,4,ARRAY['DN-0101']),
('direccionEmpresas','DN-0123','Metodología de la Investigación',3,4,ARRAY['XS-0276']),
('direccionEmpresas','DN-0340','Administración Financiera I',3,4,ARRAY['PC-0240','PC-0200']),
('direccionEmpresas','SR-I','Seminario de Realidad Nacional I',2,4,ARRAY['EG-II']),
-- V CICLO
('direccionEmpresas','DN-0105','Métodos Cuantitativos para la Toma de Decisiones I',3,5,ARRAY['DN-0340','XS-0277']),
('direccionEmpresas','DN-0341','Administración Financiera II',3,5,ARRAY['DN-0340','XS-0277']),
('direccionEmpresas','PC-0261','Legislación Comercial, Bancaria y Financiera',3,5,ARRAY['DN-0104']),
('direccionEmpresas','DN-0320','Principios de Mercadeo',3,5,ARRAY['PC-0200','XS-0276']),
('direccionEmpresas','DN-0202','Principios de Gerencia',3,5,ARRAY['DN-0340']),
('direccionEmpresas','DN-0107','Economía y Comercio Internacional',3,5,ARRAY['XE-0156','XS-0276']),
-- VI CICLO
('direccionEmpresas','DN-0106','Gestión del Talento y Conocimiento Humano',3,6,ARRAY['DN-0202']),
('direccionEmpresas','SR-II','Seminario de Realidad Nacional II',2,6,ARRAY['SR-I']),
('direccionEmpresas','DN-0110','Métodos Cuantitativos para la Toma de Decisiones II',3,6,ARRAY['DN-0105']),
('direccionEmpresas','PC-0260','Legislación Laboral',3,6,ARRAY['PC-0261']),
('direccionEmpresas','DN-0321','Publicidad y Promoción',3,6,ARRAY['DN-0320']),
('direccionEmpresas','DN-0442','Administración Financiera III',3,6,ARRAY['DN-0341']),
-- VII CICLO
('direccionEmpresas','DN-0496','Gerencia de Operaciones',3,7,ARRAY['DN-0110']),
('direccionEmpresas','DN-0405','Emprendimiento y Creación de Empresas',3,7,ARRAY['DN-0106']),
('direccionEmpresas','DN-0423','Investigación de Mercados',3,7,ARRAY['DN-0321']),
('direccionEmpresas','DN-0304','Liderazgo Gerencial',3,7,ARRAY['DN-0106']),
('direccionEmpresas','PC-0344','Formulación y Evaluación de Proyectos I',3,7,ARRAY['DN-0341']),
('direccionEmpresas','PC-0462','Legislación Tributaria y Aduanera',3,7,ARRAY['PC-0260']),
-- VIII CICLO
('direccionEmpresas','DN-0111','Gestión de la Innovación y Estrategia Competitiva',3,8,ARRAY['DN-0106']),
('direccionEmpresas','DN-0108','Mercados Bursátiles',4,8,ARRAY['PC-0344']),
('direccionEmpresas','DN-0109','Principios de Auditoría Financiera',3,8,ARRAY['PC-0304','DN-0442']),
('direccionEmpresas','DN-0112','Gerencia de la Calidad',3,8,ARRAY['DN-0496']),
('direccionEmpresas','DN-0322','Ventas y Distribución',3,8,ARRAY['DN-0423']),
-- IX CICLO
('direccionEmpresas','DN-0507','Estrategias y Tácticas de Negociación',3,9,ARRAY['DN-0111']),
('direccionEmpresas','DN-0113','Administración Mediada por Tecnologías de la Información',3,9,ARRAY['DN-0112']),
('direccionEmpresas','DN-OPT91','Curso Optativo III',3,9,'{}'),
('direccionEmpresas','DN-OPT92','Curso Optativo IV',3,9,'{}'),
('direccionEmpresas','DN-OPT93','Curso Optativo V',3,9,'{}'),
('direccionEmpresas','DN-OPT94','Curso Optativo VI',3,9,'{}'),
-- X CICLO
('direccionEmpresas','DN-0114','Comunicación Intercultural de los Negocios',3,10,ARRAY['DN-0113']),
('direccionEmpresas','DN-0115','Taller de Investigación',3,10,ARRAY['DN-0113']),
('direccionEmpresas','DN-OPTX1','Curso Optativo VII',3,10,'{}'),
('direccionEmpresas','DN-OPTX2','Curso Optativo VIII',3,10,'{}'),
('direccionEmpresas','DN-OPTX3','Curso Optativo IX',3,10,'{}'),
('direccionEmpresas','DN-OPTX4','Curso Optativo X',3,10,'{}');


-- ============================================================
-- VERIFICACIÓN FINAL
-- Ejecuta estas queries para confirmar que todo quedó bien:
--
--   SELECT carrera_id, COUNT(*) FROM courses_catalog GROUP BY carrera_id;
--   SELECT * FROM profiles LIMIT 5;
--   SELECT COUNT(*) FROM user_courses;
-- ============================================================

-- ============================================================
-- 5. TABLA: user_feedback (Retroalimentación e Ideas)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_feedback (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  message     text NOT NULL,
  status      text DEFAULT 'pending', -- pending, reviewed, implemented
  conversation jsonb DEFAULT '[]'::jsonb,
  has_unread_reply boolean DEFAULT false,
  created_at  timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- SCRIPT DE MIGRACIÓN PARA ACTUALIZAR TABLA EXISTENTE
-- (Correr en el editor SQL de Supabase si la tabla ya existe)
-- ALTER TABLE public.user_feedback 
-- ADD COLUMN IF NOT EXISTS conversation jsonb DEFAULT '[]'::jsonb,
-- ADD COLUMN IF NOT EXISTS has_unread_reply boolean DEFAULT false;
-- ============================================================

-- Habilitar RLS (Seguridad a Nivel de Fila)
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad para user_feedback
-- 1. Los usuarios pueden insertar su propio feedback
CREATE POLICY "Users can insert their own feedback"
ON public.user_feedback FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 2. Los usuarios pueden ver solo su propio feedback (Opcional, si quisieras mostrarles qué enviaron)
CREATE POLICY "Users can view their own feedback"
ON public.user_feedback FOR SELECT
USING (auth.uid() = user_id);

-- ============================================================
-- 6. VISTAS ÚTILES (Views)
-- ============================================================
-- Vista para que el administrador pueda leer el feedback junto con el nombre y correo del usuario
CREATE OR REPLACE VIEW public.vista_feedback_usuarios WITH (security_invoker = true) AS
SELECT 
  f.id AS feedback_id,
  p.full_name AS nombre_usuario,
  p.email AS correo,
  f.message AS mensaje,
  f.status AS estado,
  f.conversation AS conversation,
  f.has_unread_reply AS has_unread_reply,
  f.created_at AS fecha
FROM 
  public.user_feedback f
LEFT JOIN 
  public.profiles p ON f.user_id = p.id
ORDER BY 
  f.created_at DESC;

-- ============================================================
-- 7. TABLA: user_messages (Bandeja de Entrada / Notificaciones)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_messages (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_id   uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Puede ser null si el sistema envía
  message     text NOT NULL,
  is_read     boolean DEFAULT false,
  created_at  timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_messages ENABLE ROW LEVEL SECURITY;

-- 1. Los usuarios pueden ver SOLO los mensajes que les enviaron a ellos (receiver_id)
CREATE POLICY "Users can read their own messages"
ON public.user_messages FOR SELECT
USING (auth.uid() = receiver_id);

-- 2. Los usuarios pueden actualizar sus mensajes (marcar como leídos)
CREATE POLICY "Users can update their own messages"
ON public.user_messages FOR UPDATE
USING (auth.uid() = receiver_id);

-- 3. Cualquiera puede insertar (o el Admin, o el Sistema)
CREATE POLICY "Anyone can insert messages"
ON public.user_messages FOR INSERT
WITH CHECK (true);

-- ============================================================
-- 8. TRIGGERS AUTOMÁTICOS
-- ============================================================

-- Función para borrar feedback automáticamente cuando el status se cambie a 'X'
CREATE OR REPLACE FUNCTION public.delete_feedback_on_x()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'X' THEN
    -- Al retornar NULL en un trigger BEFORE, la operación de actualización original se cancela,
    -- pero aprovechamos para borrar la fila por completo.
    DELETE FROM public.user_feedback WHERE id = NEW.id;
    RETURN NULL; 
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_delete_feedback_on_x ON public.user_feedback;
CREATE TRIGGER trigger_delete_feedback_on_x
BEFORE UPDATE ON public.user_feedback
FOR EACH ROW
EXECUTE FUNCTION public.delete_feedback_on_x();

-- ============================================================
-- 9. TABLA: user_semesters (Historial de Promedios Ponderados)
-- ============================================================
CREATE TABLE public.user_semesters (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  semester_name   text NOT NULL, -- Ej: "I Ciclo"
  semester_year   text NOT NULL, -- Ej: "2026"
  gpa             numeric(4,2) NOT NULL DEFAULT 0.00,
  total_credits   integer NOT NULL DEFAULT 0,
  courses_json    jsonb NOT NULL DEFAULT '[]'::jsonb, -- Array de {name, credits, grade}
  created_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.user_semesters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_semesters_select" ON public.user_semesters 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_semesters_insert" ON public.user_semesters 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_semesters_delete" ON public.user_semesters 
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 9. TABLA: user_schedules (Historial del Generador de Horarios)
-- ============================================================
DROP TABLE IF EXISTS public.user_schedules CASCADE;

CREATE TABLE public.user_schedules (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  schedule_name   text NOT NULL, -- Ej: "I Semestre 2026"
  data            jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.user_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_schedules_select" ON public.user_schedules 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_schedules_insert" ON public.user_schedules 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_schedules_delete" ON public.user_schedules 
  FOR DELETE USING (auth.uid() = user_id);
-- ============================================================
-- SEED: CARRERAS RESTANTES
-- (Actuariales, Farmacia, Ing. Quimica, Economia, Medicina, Microbiologia)
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) VALUES
('cienciasActuariales','EC1100','Introducci├│n a la Econom├¡a',4,1,'{}'),
('cienciasActuariales','EF-','Actividad Deportiva',0,1,'{}'),
('cienciasActuariales','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('cienciasActuariales','MA0001','Pre-C├ílculo',0,1,'{}'),
('cienciasActuariales','MA0150','Principios de Matem├ítica',4,1,ARRAY['MA0001']),
('cienciasActuariales','RP-1','Repertorio',3,1,'{}'),
('cienciasActuariales','EG-','Curso de Arte',2,2,'{}'),
('cienciasActuariales','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('cienciasActuariales','LM1030','Estrategias de Lectura en Ingl├®s I',4,2,'{}'),
('cienciasActuariales','MA0250','C├ílculo en una Variable I',4,2,ARRAY['MA0150']),
('cienciasActuariales','CI0112','Programaci├│n I',4,3,ARRAY['MA0250']),
('cienciasActuariales','EC2100','Teor├¡a Microecon├│mica 1',4,3,ARRAY['EC1100','MA0250']),
('cienciasActuariales','MA0350','C├ílculo en una Variable II',4,3,ARRAY['MA0250']),
('cienciasActuariales','MA0360','├ülgebra Lineal I',4,3,ARRAY['MA0250']),
('cienciasActuariales','SR-I','Seminario de Realidad Nacional I',2,3,ARRAY['EG-II']),
('cienciasActuariales','CA0201','Teor├¡a Matem├ítica del Inter├®s',4,4,ARRAY['MA0350']),
('cienciasActuariales','CA0202','Herramientas de C├│mputo Actuarial',4,4,ARRAY['CI0112','MA0350']),
('cienciasActuariales','MA0450','C├ílculo en Varias Variables',4,4,ARRAY['MA0350']),
('cienciasActuariales','MA0460','├ülgebra Lineal II',4,4,ARRAY['MA0360']),
('cienciasActuariales','SR-II','Seminario de Realidad Nacional II',2,4,ARRAY['SR-I']),
('cienciasActuariales','CA0408','An├ílisis de Instrumentos de Inversi├│n',4,5,ARRAY['CA0201','CA0202']),
('cienciasActuariales','EC3200','Teor├¡a Macroecon├│mica I',4,5,ARRAY['EC2100','MA0450']),
('cienciasActuariales','MA0455','Ecuaciones Diferenciales Ordinarias',4,5,ARRAY['MA0450','MA0460']),
('cienciasActuariales','MA0720','Probabilidades I',5,5,ARRAY['MA0450','MA0460']),
('cienciasActuariales','CA0301','Matem├ítica Actuarial I',4,6,ARRAY['MA0455','MA0720']),
('cienciasActuariales','CA0302','Laboratorio Actuarial I',2,6,ARRAY['MA0455','MA0720']),
('cienciasActuariales','CA0303','Estad├¡stica Actuarial I',4,6,ARRAY['MA0720']),
('cienciasActuariales','CA0304','Fundamentos de Riesgos y Seguros',4,6,ARRAY['MA0720']),
('cienciasActuariales','MA0501','An├ílisis Num├®rico I',4,6,ARRAY['CI0112','MA0450','MA0455','MA0460']),
('cienciasActuariales','CA0401','Matem├íticas Actuariales II',4,7,ARRAY['CA0301','CA0302']),
('cienciasActuariales','CA0402','Laboratorio Actuarial II',2,7,ARRAY['CA0301','CA0302']),
('cienciasActuariales','CA0403','Estad├¡stica Actuarial II',4,7,ARRAY['CA0303']),
('cienciasActuariales','CA0406','Procesos Estoc├ísticos y Series Temporales',4,7,ARRAY['MA0455','MA0720']),
('cienciasActuariales','OPT787','Cursos Optativos',4,7,'{}'),
('cienciasActuariales','CA0404','Modelos Lineales',4,8,ARRAY['MA0455','MA0720']),
('cienciasActuariales','CA0405','Matem├íticas Actuariales III',4,8,ARRAY['CA0401','CA0402']),
('cienciasActuariales','CA0407','Pr├íctica Actuarial I',3,8,ARRAY['CA0401']),
('cienciasActuariales','CA0409','Distribuciones de P├®rdidas',4,8,ARRAY['CA0406']),
('cienciasActuariales','CA0410','Teor├¡a de Riesgos',4,8,ARRAY['CA0406']),
('cienciasActuariales','CA0501','Reg├¡menes de Pensiones',4,9,ARRAY['CA0405']),
('cienciasActuariales','CA0502','Laboratorio Actuarial III',3,9,ARRAY['CA0402','CA0405']),
('cienciasActuariales','CA0503','Modelos de Vida',4,9,ARRAY['CA0405']),
('cienciasActuariales','CA0504','Introducci├│n a la Optimizaci├│n',4,9,ARRAY['MA0450','MA0460']),
('cienciasActuariales','CA0506','An├ílisis de Datos',4,10,ARRAY['CA0403']),
('cienciasActuariales','CA0508','Pr├íctica Actuarial II',4,10,ARRAY['CA0504']),
('cienciasActuariales','CA0509','Teor├¡a de Credibilidad',4,10,ARRAY['CA0409','CA0410']),
('cienciasActuariales','CA0510','An├ílisis de Estados Financieros',4,10,ARRAY['CA0410']),
('cienciasActuariales','MA9500','Investigaci├│n Dirigida 1',0,11,'{}'),
('cienciasActuariales','MA9501','Investigaci├│n Dirigida 2',0,11,ARRAY['MA9500']),
('cienciasActuariales','MA9600','Seminario de Graduaci├│n 1',0,11,'{}'),
('cienciasActuariales','MA9700','Pr├íctica Dirigida 1',0,11,'{}'),
('farmacia','EG-','Curso de Arte',2,1,'{}'),
('farmacia','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('farmacia','FS0132','F├¡sica Aplicada a Farmacia',3,1,'{}'),
('farmacia','FS0133','Lab. F├¡sica Aplicada a Farmacia',1,1,'{}'),
('farmacia','MA1210','C├ílculo I',3,1,'{}'),
('farmacia','QU0100','Qu├¡mica General I',3,1,'{}'),
('farmacia','QU0101','Lab. Qu├¡mica General I',1,1,'{}'),
('farmacia','B0106','Biolog├¡a General',3,2,'{}'),
('farmacia','B0107','Lab. Biolog├¡a General',1,2,'{}'),
('farmacia','EF-','Actividad Deportiva',0,2,'{}'),
('farmacia','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('farmacia','MA2210','Ecuaciones Diferenciales Aplicadas',3,2,ARRAY['MA1210']),
('farmacia','QU0102','Qu├¡mica General II',3,2,ARRAY['QU0100','QU0101']),
('farmacia','QU0103','Lab. Qu├¡mica General II',1,2,ARRAY['QU0100','QU0101']),
('farmacia','FA2009','Introducci├│n a la Farmacia',3,3,'{}'),
('farmacia','MN0220','Anatom├¡a Macrosc├│pica',4,3,ARRAY['B0106','B0107']),
('farmacia','QU0212','Qu├¡mica Org├ínica General I',4,3,ARRAY['QU0102','QU0103']),
('farmacia','QU0213','Lab. Qu├¡mica Org├ínica General I',1,3,ARRAY['QU0102','QU0103']),
('farmacia','SR-I','Seminario de Realidad Nacional I',2,3,ARRAY['EG-II']),
('farmacia','XS0215','Estad├¡stica para Biociencias',4,3,ARRAY['MA1210']),
('farmacia','FA0217','Metodolog├¡a de la Investigaci├│n Farmac├®utica',3,4,ARRAY['FA2009','XS0215']),
('farmacia','FA0335','Fisicoqu├¡mica Farmac├®utica I',4,4,ARRAY['FS0132','FS0133','MA2210','QU0212','QU0213','XS0215']),
('farmacia','FA3030','Conferencia General I',0,4,'{}'),
('farmacia','QU0214','Qu├¡mica Org├ínica General II',4,4,ARRAY['QU0212','QU0213']),
('farmacia','QU0215','Lab. Qu├¡mica Org├ínica General II',1,4,ARRAY['QU0212','QU0213']),
('farmacia','RP-1','Repertorio',3,4,'{}'),
('farmacia','SR-II','Seminario de Realidad Nacional II',2,4,ARRAY['SR-I']),
('farmacia','FA0218','An├ílisis de Medicamentos I',5,5,ARRAY['FS0132','FS0133','QU0214','QU0215','XS0215']),
('farmacia','FA0336','Fisicoqu├¡mica Farmac├®utica II',4,5,ARRAY['FA0335']),
('farmacia','FA0337','Elementos de Salud P├║blica',2,5,ARRAY['FA0217','FA3030']),
('farmacia','MQ0208','Bioqu├¡mica para Farmacia',4,5,ARRAY['B0106','B0107','QU0214','QU0215']),
('farmacia','OPT1043','Cursos Optativos del V Ciclo',2,5,'{}'),
('farmacia','FA0219','Elementos de Fisiopatolog├¡a y Terape├║tica',2,6,ARRAY['MN0220']),
('farmacia','FA0222','An├ílisis de Medicamentos II',4,6,ARRAY['FA0218']),
('farmacia','FA0223','Fundamentos de Inmunolog├¡a',3,6,ARRAY['MQ0208']),
('farmacia','FA0338','Biofarmacia y Farmacocin├®tica',4,6,ARRAY['FA0336']),
('farmacia','MF1000','Fisiolog├¡a Humana',6,6,ARRAY['MQ0208']),
('farmacia','F5001','├ëtica Profesional Farmace├║tica',1,7,ARRAY['FA0337']),
('farmacia','FA0224','Microbiolog├¡a Cl├¡nica y Terape├║tica',3,7,ARRAY['FA0219','FA0223','MF1000']),
('farmacia','FA0225','Farmacolog├¡a I',3,7,ARRAY['FA0223','FA0338','MF1000']),
('farmacia','FA0226','Laboratorio de Farmacolog├¡a I',1,7,ARRAY['FA0225']),
('farmacia','FA0227','An├ílisis de Medicamentos III',4,7,ARRAY['FA0222']),
('farmacia','FA0228','Farmacognosia',2,7,ARRAY['MQ0208']),
('farmacia','FA0229','Laboratorio de Farmacognosia',2,7,ARRAY['FA0217','FA0228']),
('farmacia','FA0230','Fundamentos de Biotecnolog├¡a Farmace├║tica',2,7,ARRAY['FA0219','FA0223','FA0338']),
('farmacia','FA0231','Farmacolog├¡a II',3,8,ARRAY['FA0219','FA0224','FA0225']),
('farmacia','FA0232','Laboratorio de Farmacolog├¡a II',1,8,ARRAY['FA0226','FA0231']),
('farmacia','FA0233','Tecnolog├¡a Farmace├║tica I',4,8,ARRAY['FA0227','FA0338']),
('farmacia','FA0234','Atenci├│n Farmace├║tica I',4,8,ARRAY['F5001','FA0225']),
('farmacia','FA0235','Farmacia de Comunidad',2,8,ARRAY['FA2009','FA0234']),
('farmacia','FA0310','Qu├¡mica Medicinal I',3,8,ARRAY['FA0228','FA0338']),
('farmacia','OPT1064','Optativos del Ciclo VIII',2,8,'{}'),
('farmacia','FA0215','Gesti├│n de la Innovaci├│n en el ├ürea de Salud',2,9,ARRAY['FA0217','FA2009']),
('farmacia','FA0236','Qu├¡mica Medicinal II',3,9,ARRAY['FA0224','FA0310']),
('farmacia','FA0237','Farmacolog├¡a III',3,9,ARRAY['FA0223','FA0225']),
('farmacia','FA0238','Laboratorio de Farmacolog├¡a III',1,9,ARRAY['FA0237']),
('farmacia','FA0239','Atenci├│n Farmace├║tica II',4,9,ARRAY['FA0231','FA0234']),
('farmacia','FA0315','Tecnolog├¡a Farmace├║tica II',4,9,ARRAY['FA0227','FA0338']),
('farmacia','OPT1065','Optativos del Ciclo IX',2,9,'{}'),
('farmacia','FA0316','Administraci├│n de Establecimientos Farmace├║ticos',2,10,ARRAY['FA0215']),
('farmacia','FA0317','Farmacia Industrial',2,10,ARRAY['FA0233','FA0315']),
('farmacia','FA0339','Legislaci├│n y Deontolog├¡a Farmac├®utica',2,10,ARRAY['F5001','FA0235','FA0317']),
('farmacia','FA0341','Farmacia de Hospital',4,10,ARRAY['FA0237','FA0239']),
('farmacia','FA5026','Toxicolog├¡a',3,10,ARRAY['FA0237']),
('farmacia','OPT1044','Optativos Ciclo 10, Bloque A',2,10,'{}'),
('farmacia','OPT1045','Optativos Ciclo 10, Bloque B',3,10,'{}'),
('farmacia','FA9500','Investigaci├│n Dirigida 1',0,11,'{}'),
('farmacia','FA9501','Investigaci├│n Dirigida 2',0,11,ARRAY['FA9500']),
('farmacia','FA9502','Investigaci├│n Dirigida 3',0,11,ARRAY['FA9501']),
('farmacia','FA9700','Pr├íctica Dirigida I',0,11,'{}'),
('farmacia','FA9701','Pr├íctica Dirigida II',0,11,ARRAY['FA9700']),
('farmacia','FA9702','Pr├íctica Dirigida III',0,11,ARRAY['FA9701']),
('farmacia','FA9800','Proyecto de Graduaci├│n I',0,11,'{}'),
('farmacia','FA9801','Proyecto de Graduaci├│n II',0,11,ARRAY['FA9800']),
('farmacia','FA9802','Proyecto de Graduaci├│n III',0,11,ARRAY['FA9801']),
('ingenieriaQuimica','EG-','Curso de Arte',2,1,'{}'),
('ingenieriaQuimica','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('ingenieriaQuimica','LM1030','Estrategias de Lectura en Ingl├®s I',4,1,'{}'),
('ingenieriaQuimica','MA0001','Prec├ílculo',0,1,'{}'),
('ingenieriaQuimica','MA1001','C├ílculo I',3,1,ARRAY['MA0001']),
('ingenieriaQuimica','QU0100','Qu├¡mica General I',3,1,'{}'),
('ingenieriaQuimica','QU0101','Laboratorio de Qu├¡mica General I',1,1,'{}'),
('ingenieriaQuimica','EF-','Actividad Deportiva',0,2,'{}'),
('ingenieriaQuimica','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('ingenieriaQuimica','FS0210','F├¡sica General I',3,2,ARRAY['MA1001']),
('ingenieriaQuimica','FS0211','Laboratorio de F├¡sica General I',1,2,ARRAY['MA1001']),
('ingenieriaQuimica','MA1002','C├ílculo II',4,2,ARRAY['MA1001']),
('ingenieriaQuimica','QU0102','Qu├¡mica General II',3,2,ARRAY['QU0100','QU0101']),
('ingenieriaQuimica','QU0103','Laboratorio de Qu├¡mica General II',1,2,ARRAY['QU0100','QU0101']),
('ingenieriaQuimica','FS0310','F├¡sica General II',3,3,ARRAY['FS0210','FS0211','MA1002']),
('ingenieriaQuimica','FS0311','Laboratorio de F├¡sica General II',1,3,ARRAY['FS0210','FS0211','MA1002']),
('ingenieriaQuimica','IQ0200','An├ílisis Gr├ífico para Ing. Qu├¡mica',3,3,ARRAY['FS0210','MA1002','QU0102']),
('ingenieriaQuimica','MA1003','C├ílculo III',4,3,ARRAY['MA1002']),
('ingenieriaQuimica','MA1004','├ülgebra Lineal',3,3,'{}'),
('ingenieriaQuimica','QU0200','Qu├¡mica Anal├¡tica Cuantitativa I',3,3,ARRAY['QU0102','QU0103']),
('ingenieriaQuimica','QU0201','Lab. Qu├¡mica Anal├¡tica Cuantitativa I',2,3,ARRAY['QU0102','QU0103']),
('ingenieriaQuimica','CI0202','Principios de Inform├ítica',4,4,ARRAY['MA1001']),
('ingenieriaQuimica','FS0410','F├¡sica General III',3,4,ARRAY['FS0310','FS0311','MA1003']),
('ingenieriaQuimica','FS0411','Laboratorio de F├¡sica General III',1,4,ARRAY['FS0310','FS0311','MA1003']),
('ingenieriaQuimica','IQ0332','An├ílisis de Procesos I',4,4,ARRAY['FS0310','IQ0200']),
('ingenieriaQuimica','MA1005','Ecuaciones Diferenciales',4,4,ARRAY['MA1002','MA1004']),
('ingenieriaQuimica','QU0260','F├¡sico Qu├¡mica para Ing. Qu├¡mica',4,4,ARRAY['FS0310','FS0311','MA1002','QU0102','QU0103']),
('ingenieriaQuimica','IQ0312','Mec├ínica I',4,5,ARRAY['FS0210','FS0211','MA1003','MA1004']),
('ingenieriaQuimica','IQ0333','An├ílisis de Procesos II',3,5,ARRAY['CI0202','IQ0332','MA1003','MA1005']),
('ingenieriaQuimica','IQ0334','Termodin├ímica I',3,5,ARRAY['IQ0332','MA1005','QU0260']),
('ingenieriaQuimica','QU0212','Qu├¡mica Org├ínica General I',4,5,ARRAY['QU0102','QU0103']),
('ingenieriaQuimica','QU0213','Lab. Qu├¡mica Org├ínica General I',1,5,ARRAY['QU0102','QU0103']),
('ingenieriaQuimica','XS0217','Probabilidades e Inferencia Estad├¡stica',4,5,ARRAY['MA1004||MA1005']),
('ingenieriaQuimica','IE0303','Electrotecnia I',3,6,ARRAY['FS0310','FS0311','MA1003']),
('ingenieriaQuimica','IQ0313','Fen├│menos de Transferencia',4,6,ARRAY['IQ0333','IQ0334']),
('ingenieriaQuimica','IQ0331','Medici├│n y Tratamiento de Datos Exp.',3,6,ARRAY['FS0410','IQ0332','XS0217']),
('ingenieriaQuimica','IQ0335','Termodin├ímica II',3,6,ARRAY['CI0202','IQ0334','MA1003','QU0212']),
('ingenieriaQuimica','QU0214','Qu├¡mica Org├ínica General II',4,6,ARRAY['QU0212','QU0213']),
('ingenieriaQuimica','QU0215','Lab. Qu├¡mica Org├ínica General II',1,6,ARRAY['QU0212','QU0213']),
('ingenieriaQuimica','IQ0415','Ingenier├¡a de los Materiales',3,7,ARRAY['IQ0312','IQ0335']),
('ingenieriaQuimica','IQ0423','Operac. Transferencia Fluidos y Calor',3,7,ARRAY['IQ0313']),
('ingenieriaQuimica','IQ0432','Lab. Operac. Transferencia Fluidos y Calor',3,7,ARRAY['IQ0313']),
('ingenieriaQuimica','IQ0451','Planeamiento de la Producci├│n',3,7,ARRAY['XS0217']),
('ingenieriaQuimica','SR-I','Seminario de Realidad Nacional I',2,7,ARRAY['EG-II']),
('ingenieriaQuimica','IQ0416','Cin├®tica y Reactores Qu├¡micos',3,8,ARRAY['IQ0415','IQ0423','QU0214']),
('ingenieriaQuimica','IQ0424','Operaciones por Separaci├│n de Fases',3,8,ARRAY['IQ0335','IQ0423']),
('ingenieriaQuimica','IQ0433','Lab. Operaciones por Separaci├│n de Fases',2,8,ARRAY['IQ0335']),
('ingenieriaQuimica','IQ0452','Control de la Producci├│n',3,8,ARRAY['IQ0451']),
('ingenieriaQuimica','RP-1','Repertorio',3,8,'{}'),
('ingenieriaQuimica','SR-II','Seminario de Realidad Nacional II',2,8,ARRAY['SR-I']),
('ingenieriaQuimica','IQ0517','Control e Instrumentaci├│n de Procesos',3,9,ARRAY['IE0303','IQ0416','IQ0424']),
('ingenieriaQuimica','IQ0525','Operac. Separaci├│n M├®todos Difusionales',3,9,ARRAY['IQ0424']),
('ingenieriaQuimica','IQ0534','Lab. Operac. Separaci├│n M├®todos Difus.',2,9,ARRAY['IQ0424']),
('ingenieriaQuimica','IQ0553','Evaluaci├│n de Proyectos',3,9,ARRAY['IQ0424','IQ0452']),
('ingenieriaQuimica','IQ0590','Seminario para Proyectos de Graduaci├│n',2,9,ARRAY['IQ0424','IQ0452']),
('ingenieriaQuimica','IQ0526','Procesos y Operaciones Integradas',3,10,ARRAY['IQ0525','IQ0553']),
('ingenieriaQuimica','IQ0551','Dise├▒o de Procesos Qu├¡micos',3,10,ARRAY['IQ0416','IQ0525','IQ0553']),
('ingenieriaQuimica','IQ0556','Principios de Administraci├│n Industrial',3,10,ARRAY['IQ0525','IQ0553']),
('ingenieriaQuimica','IQ9500','Investigaci├│n Dirigida I',0,10,ARRAY['IQ0590']),
('ingenieriaQuimica','IQ9700','Pr├íctica Dirigida I',0,10,'{}'),
('ingenieriaQuimica','IQ9800','Proyecto de Graduaci├│n I',0,10,'{}'),
('economia','EC1100','Introducci├│n a la Econom├¡a',4,1,'{}'),
('economia','EC4101','Datos Econ├│micos',3,1,'{}'),
('economia','MA1001','C├ílculo I',3,1,ARRAY['MA0001']),
('economia','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('economia','EC2100','Teor├¡a Microecon├│mica I',4,2,ARRAY['EC1100','MA1001']),
('economia','MA1004','├ülgebra Lineal',3,2,'{}'),
('economia','MA1023','C├ílculo con Optimizaci├│n',4,2,ARRAY['MA1001']),
('economia','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('economia','EC2200','Teor├¡a Microecon├│mica II',4,3,ARRAY['EC2100','MA1023']),
('economia','EC3200','Teor├¡a Macroecon├│mica I',4,3,ARRAY['EC2100','MA1023']),
('economia','MA1005','Ecuaciones Diferenciales',4,3,ARRAY['MA1002','MA1004']),
('economia','MA1030','Introducci├│n a la Probabilidad',4,3,ARRAY['MA1023']),
('economia','LM0303','Ingl├®s para Econom├¡a I',3,3,ARRAY['EC2100']),
('economia','EC2201','Teor├¡a de Juegos e Informaci├│n',3,4,ARRAY['EC2200','MA1030']),
('economia','EC3201','Teor├¡a Macroecon├│mica II',4,4,ARRAY['EC2200','EC3200','MA1005']),
('economia','XS0100','Fundamentos de Teor├¡a Estad├¡stica',3,4,ARRAY['EC4101','MA1030']),
('economia','CI0108','Computaci├│n para Economistas',4,4,ARRAY['MA1001','MA1004']),
('economia','EC4200','Econometr├¡a',3,5,ARRAY['MA1004','XS0100']),
('economia','EC2300','Comercio Internacional',3,5,ARRAY['EC2201']),
('economia','EC3300','Crecimiento y Ciclos',3,5,ARRAY['EC3201']),
('economia','FL2076','Redacci├│n para Econom├¡a',3,5,ARRAY['EC2201','EC3201']),
('economia','EC2301','Econom├¡a Financiera',3,6,ARRAY['EC2201','EC4200']),
('economia','EC4300','Microeconometr├¡a',3,6,ARRAY['CI0108','EC2200','EC4200']),
('economia','EC4301','Macroeconometr├¡a',3,6,ARRAY['CI0108','EC3201','EC4200']),
('economia','EC3302','Econom├¡a Monetaria',3,6,ARRAY['EC3300','EC4200']),
('economia','EC1300','Historia del Pensamiento Econ├│mico',3,7,ARRAY['EC3201','HA1415']),
('economia','EC1400','Seminario de Investigaci├│n Econ├│mica I',3,7,ARRAY['EC2301','EC3300','EC4300','EC4301']),
('economia','EC1401','Seminario de Investigaci├│n Econ├│mica II',3,8,ARRAY['EC1400']),
('economia','EC1001','Econom├¡a Urbana y Regional',3,8,ARRAY['EC2201','EC3300','EC4200']),
('economia','EC1005','Econom├¡a Ambiental y de Recursos Naturales',3,8,ARRAY['EC2201','EC3300','EC4200']),
('economia','EC2003','Derivados Financieros',3,8,ARRAY['EC2301','EC3300','EC4200']),
('economia','EC2011','Microeconom├¡a Avanzada',3,8,ARRAY['EC2201','EC3300','EC4200']),
('medicina','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('medicina','QU0114','Qu├¡mica General Intensiva',4,1,'{}'),
('medicina','QU0115','Lab. Qu├¡mica General Intensiva',1,1,'{}'),
('medicina','EG-','Curso de Arte',2,1,'{}'),
('medicina','EF-','Actividad Deportiva',0,1,'{}'),
('medicina','MA1210','C├ílculo I',3,1,'{}'),
('medicina','LM1030','Estrategias de Lectura en Ingl├®s I',4,1,'{}'),
('medicina','HA1009','Historia de la Medicina',2,1,'{}'),
('medicina','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('medicina','FS0208','F├¡sica para Ciencias M├®dicas',3,2,ARRAY['MA1210||MA1001']),
('medicina','FS0204','Lab. F├¡sica para Ciencias M├®dicas',1,2,'{}'),
('medicina','QU0210','Fundamentos de Qu├¡mica Org├ínica',4,2,ARRAY['QU0114','QU0115']),
('medicina','QU0211','Lab. Fundamentos de Qu├¡mica Org├ínica',1,2,ARRAY['QU0114','QU0115']),
('medicina','B0106','Biolog├¡a General',3,2,'{}'),
('medicina','B0107','Lab. Biolog├¡a General',1,2,'{}'),
('medicina','ME0410','Fundamentos de Psiquiatr├¡a',2,3,ARRAY['B0106','B0107']),
('medicina','ME0411','Histolog├¡a',5,3,ARRAY['QU0210','QU0211']),
('medicina','ME0412','Anatom├¡a Descriptiva',5,3,ARRAY['B0106','B0107','FS0204','FS0208','LM1030']),
('medicina','ME0421','Embriolog├¡a',2,3,ARRAY['B0106','B0107']),
('medicina','ME0117','Bioqu├¡mica para Medicina',6,3,ARRAY['LM1030','QU0210']),
('medicina','ME0113','Lab. Bioqu├¡mica para Medicina',2,3,ARRAY['LM1030','QU0210','QU0211']),
('medicina','SR-I','Seminario de Realidad Nacional I',2,3,ARRAY['EG-II']),
('medicina','ME2012','Fisiolog├¡a',10,4,ARRAY['ME0411','ME0412','ME0421','ME0113','ME0117']),
('medicina','ME0422','Neuroanatom├¡a',3,4,ARRAY['ME0421','ME0113','ME0117']),
('medicina','SR-II','Seminario de Realidad Nacional II',2,4,ARRAY['SR-I']),
('medicina','RP-','Repertorio',3,4,'{}'),
('medicina','ME0414','Anatom├¡a Topogr├ífica Radiol├│gica y Quir├║rgica',5,4,ARRAY['ME0411','ME0412','ME0421','ME0113','ME0117']),
('medicina','OPT-MED1','Optativo Bloque I',1,4,'{}'),
('medicina','F0008','Seminario ├ëtica, Medicina y Sociedad',0,5,ARRAY['ME2012','ME0414']),
('medicina','XS0215','Estad├¡stica para Biociencias',4,5,ARRAY['MA1210||MA1001']),
('medicina','ME0109','Patolog├¡a Humana I',5,5,ARRAY['ME2012','ME0414','ME0422']),
('medicina','ME3103','Fisiopatolog├¡a y Semiolog├¡a',10,5,ARRAY['ME2012','ME0414','ME0422']),
('medicina','ME0104','Enfermedades Infecciosas I',4,5,ARRAY['ME2012','ME0414']),
('medicina','ME0108','Patolog├¡a Humana II',5,6,ARRAY['ME0109','ME3103','ME0104']),
('medicina','ME3005','Medicina Interna I',10,6,ARRAY['ME0109','ME0104','ME3103']),
('medicina','ME0107','Enfermedades Infecciosas II',4,6,ARRAY['ME0104','ME0109','ME3103']),
('medicina','ME2200','Proped├®utica Psiqui├ítrica',2,6,ARRAY['ME0410','ME2012','ME0422']),
('medicina','ME0313','Medicina Integral y Comunitaria I',2,7,ARRAY['ME3005','ME0107']),
('medicina','ME0306','Farmacolog├¡a B├ísica I',3,7,ARRAY['ME0108','ME3005','ME0107']),
('medicina','ME4012','Obstetricia',6,7,ARRAY['ME0108','ME3005','ME0107']),
('medicina','ME4013','Ginecolog├¡a',6,7,ARRAY['ME0108','ME3005','ME0107']),
('medicina','ME4014','Medicina Legal',4,7,ARRAY['ME0108','ME3005','ME0107']),
('medicina','ME1007','Introducci├│n a la Investigaci├│n en Medicina',2,8,ARRAY['XS0215']),
('medicina','ME0310','Farmacolog├¡a B├ísica II',3,8,ARRAY['ME0306']),
('medicina','ME4015','Pediatr├¡a',10,8,ARRAY['ME0108','ME3005','ME0107']),
('medicina','ME4016','Psiquiatr├¡a',4,8,ARRAY['ME2200','ME3005','ME0107','ME0108']),
('medicina','ME1009','Gen├®tica M├®dica',2,8,ARRAY['ME3005','ME0108','ME0107']),
('medicina','ME0314','Medicina Integral y Comunitaria II',2,9,ARRAY['ME0313','ME0310','ME1007']),
('medicina','ME0315','Geriatr├¡a y Gerontolog├¡a I',2,9,ARRAY['ME0310','ME4013']),
('medicina','ME5000','Medicina Interna II',10,9,ARRAY['ME0310','ME4012','ME4013','ME4015']),
('medicina','ME0308','Farmacolog├¡a Cl├¡nica I',2,9,ARRAY['ME0310','ME4012','ME4013','ME4015']),
('medicina','ME0420','Toxicolog├¡a Cl├¡nica',2,9,ARRAY['ME0310','ME4012','ME4013','ME4015']),
('medicina','ME0316','Geriatr├¡a y Gerontolog├¡a II',2,10,ARRAY['ME0315','ME5000']),
('medicina','ME5001','Cirug├¡a',10,10,ARRAY['ME5000']),
('medicina','ME0311','Radiolog├¡a',2,10,ARRAY['ME4012','ME4013','ME4015']),
('medicina','ME0309','Farmacolog├¡a Cl├¡nica II',2,10,ARRAY['ME0308']),
('medicina','OPT-MED2','Optativo Bloque II',1,10,'{}'),
('medicina','ME6001','Internado de Cirug├¡a',10,11,ARRAY['ME5001']),
('medicina','ME6002','Internado de Pediatr├¡a',10,11,ARRAY['ME5001']),
('medicina','ME6003','Internado Gineco-Obstetricia',10,11,ARRAY['ME5001']),
('medicina','ME6004','Internado de Medicina Interna',10,12,ARRAY['ME5001']),
('medicina','ME6005','Salud Comunitaria y Familiar',8,12,ARRAY['ME5001']),
('microbiologia','B0103','Biolog├¡a General',3,1,'{}'),
('microbiologia','B0104','Laboratorio de Biolog├¡a General',1,1,ARRAY['B0103']),
('microbiologia','MA1001','C├ílculo I',4,1,'{}'),
('microbiologia','QU0100','Qu├¡mica General I',3,1,'{}'),
('microbiologia','QU0101','Laboratorio de Qu├¡mica General I',1,1,ARRAY['QU0100']),
('microbiologia','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('microbiologia','B0105','Laboratorio de Biolog├¡a Sistem├ítica',1,2,ARRAY['B0103','B0104']),
('microbiologia','FS0210','F├¡sica para Ciencias de la Vida I',3,2,ARRAY['MA1001']),
('microbiologia','FS0211','Lab. F├¡sica para Ciencias de la Vida I',1,2,ARRAY['MA1001','FS0210']),
('microbiologia','QU0102','Qu├¡mica General II',3,2,ARRAY['QU0100']),
('microbiologia','QU0103','Laboratorio de Qu├¡mica General II',1,2,ARRAY['QU0101','QU0102']),
('microbiologia','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('microbiologia','FS0310','F├¡sica para Ciencias de la Vida II',3,3,ARRAY['FS0210']),
('microbiologia','FS0311','Lab. F├¡sica para Ciencias de la Vida II',1,3,ARRAY['FS0211','FS0310']),
('microbiologia','QU0200','Qu├¡mica Org├ínica I',3,3,ARRAY['QU0102']),
('microbiologia','QU0201','Laboratorio de Qu├¡mica Org├ínica I',1,3,ARRAY['QU0103','QU0200']),
('microbiologia','QU0250','Qu├¡mica Anal├¡tica Cuantitativa',3,3,ARRAY['QU0102']),
('microbiologia','QU0251','Lab. Qu├¡mica Anal├¡tica Cuantitativa',1,3,ARRAY['QU0103','QU0250']),
('microbiologia','SR-I','Seminario de Realidad Nacional I',2,3,ARRAY['EG-II']),
('microbiologia','MQ0201','Anatom├¡a y Fisiolog├¡a Humanas I',4,4,ARRAY['B0105','QU0200']),
('microbiologia','QU0202','Qu├¡mica Org├ínica II',3,4,ARRAY['QU0200']),
('microbiologia','QU0203','Laboratorio de Qu├¡mica Org├ínica II',1,4,ARRAY['QU0201','QU0202']),
('microbiologia','QU0252','An├ílisis Instrumental',3,4,ARRAY['QU0250']),
('microbiologia','QU0253','Laboratorio de An├ílisis Instrumental',1,4,ARRAY['QU0251','QU0252']),
('microbiologia','SR-II','Seminario de Realidad Nacional II',2,4,ARRAY['SR-I']),
('microbiologia','RP-','Repertorio',3,4,'{}'),
('microbiologia','BC0210','Bioqu├¡mica para Microbiolog├¡a',4,5,ARRAY['QU0202']),
('microbiologia','MQ0301','Anatom├¡a y Fisiolog├¡a Humanas II',4,5,ARRAY['MQ0201']),
('microbiologia','MQ0314','Parasitolog├¡a General',4,5,ARRAY['B0105']),
('microbiologia','MQ0318','Micolog├¡a',3,5,ARRAY['B0105']),
('microbiologia','MQ0319','Histolog├¡a Humana',3,5,ARRAY['MQ0201']),
('microbiologia','MQ0414','Microbiolog├¡a General',5,6,ARRAY['BC0210','MQ0314','MQ0318']),
('microbiologia','MQ0415','Inmunolog├¡a General',4,6,ARRAY['BC0210','MQ0319']),
('microbiologia','MQ0416','Virolog├¡a General',3,6,ARRAY['BC0210','MQ0319']),
('microbiologia','MQ0417','Gen├®tica Bacteriana',3,6,ARRAY['BC0210']),
('microbiologia','EF-','Actividad Deportiva',0,6,'{}'),
('microbiologia','MQ0511','Hematolog├¡a I',4,7,ARRAY['MQ0415','MQ0414']),
('microbiologia','MQ0513','Bacteriolog├¡a M├®dica I',4,7,ARRAY['MQ0414','MQ0415']),
('microbiologia','MQ0515','Inmunolog├¡a Cl├¡nica',4,7,ARRAY['MQ0415']),
('microbiologia','MQ0517','Protozoolog├¡a M├®dica',4,7,ARRAY['MQ0414','MQ0415']),
('microbiologia','MQ0512','Hematolog├¡a II',4,8,ARRAY['MQ0511']),
('microbiologia','MQ0514','Bacteriolog├¡a M├®dica II',4,8,ARRAY['MQ0513']),
('microbiologia','MQ0516','Qu├¡mica Cl├¡nica I',4,8,ARRAY['MQ0414','MQ0415']),
('microbiologia','MQ0518','Helmintolog├¡a M├®dica',4,8,ARRAY['MQ0517']),
('microbiologia','MQ0611','Banco de Sangre',3,9,ARRAY['MQ0512','MQ0515']),
('microbiologia','MQ0613','Qu├¡mica Cl├¡nica II',4,9,ARRAY['MQ0516']),
('microbiologia','MQ0614','Endocrinolog├¡a Cl├¡nica',3,9,ARRAY['MQ0516']),
('microbiologia','MQ0615','Situaci├│n de Salud Nacional',3,9,ARRAY['MQ0513','MQ0517']),
('microbiologia','MQ0616','Virolog├¡a Cl├¡nica',3,9,ARRAY['MQ0416','MQ0513','MQ0515']),
('microbiologia','MQ0617','Gesti├│n de la Calidad',3,9,ARRAY['MQ0513','MQ0516','MQ0517']),
('microbiologia','MQ0612','Administraci├│n de Laboratorios',3,10,ARRAY['MQ0617']),
('microbiologia','MQ0618','M├®todos de Investigaci├│n',3,10,ARRAY['MQ0615']),
('microbiologia','MQ0619','Toxicolog├¡a y An├ílisis de Drogas',3,10,ARRAY['MQ0613']),
('microbiologia','MQ0620','Microbiolog├¡a de Alimentos y Aguas',4,10,ARRAY['MQ0514','MQ0613']),
('microbiologia','MQ0621','├ëtica y Deontolog├¡a',2,10,'{}'),
('microbiologia','MQ0701','Internado Cl├¡nico',15,11,ARRAY['MQ0612','MQ0618','MQ0619','MQ0620','MQ0621','MQ0611','MQ0614','MQ0616'])
ON CONFLICT (carrera_id, codigo) DO NOTHING;


-- ============================================================
-- SEED: CARRERAS RESTANTES
-- (Actuariales, Farmacia, Ing. Quimica, Economia, Medicina, Microbiologia)
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) VALUES
('cienciasActuariales','EC1100','Introducci├│n a la Econom├¡a',4,1,'{}'),
('cienciasActuariales','EF-','Actividad Deportiva',0,1,'{}'),
('cienciasActuariales','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('cienciasActuariales','MA0001','Pre-C├ílculo',0,1,'{}'),
('cienciasActuariales','MA0150','Principios de Matem├ítica',4,1,ARRAY['MA0001']),
('cienciasActuariales','RP-1','Repertorio',3,1,'{}'),
('cienciasActuariales','EG-','Curso de Arte',2,2,'{}'),
('cienciasActuariales','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('cienciasActuariales','LM1030','Estrategias de Lectura en Ingl├®s I',4,2,'{}'),
('cienciasActuariales','MA0250','C├ílculo en una Variable I',4,2,ARRAY['MA0150']),
('cienciasActuariales','CI0112','Programaci├│n I',4,3,ARRAY['MA0250']),
('cienciasActuariales','EC2100','Teor├¡a Microecon├│mica 1',4,3,ARRAY['EC1100','MA0250']),
('cienciasActuariales','MA0350','C├ílculo en una Variable II',4,3,ARRAY['MA0250']),
('cienciasActuariales','MA0360','├ülgebra Lineal I',4,3,ARRAY['MA0250']),
('cienciasActuariales','SR-I','Seminario de Realidad Nacional I',2,3,ARRAY['EG-II']),
('cienciasActuariales','CA0201','Teor├¡a Matem├ítica del Inter├®s',4,4,ARRAY['MA0350']),
('cienciasActuariales','CA0202','Herramientas de C├│mputo Actuarial',4,4,ARRAY['CI0112','MA0350']),
('cienciasActuariales','MA0450','C├ílculo en Varias Variables',4,4,ARRAY['MA0350']),
('cienciasActuariales','MA0460','├ülgebra Lineal II',4,4,ARRAY['MA0360']),
('cienciasActuariales','SR-II','Seminario de Realidad Nacional II',2,4,ARRAY['SR-I']),
('cienciasActuariales','CA0408','An├ílisis de Instrumentos de Inversi├│n',4,5,ARRAY['CA0201','CA0202']),
('cienciasActuariales','EC3200','Teor├¡a Macroecon├│mica I',4,5,ARRAY['EC2100','MA0450']),
('cienciasActuariales','MA0455','Ecuaciones Diferenciales Ordinarias',4,5,ARRAY['MA0450','MA0460']),
('cienciasActuariales','MA0720','Probabilidades I',5,5,ARRAY['MA0450','MA0460']),
('cienciasActuariales','CA0301','Matem├ítica Actuarial I',4,6,ARRAY['MA0455','MA0720']),
('cienciasActuariales','CA0302','Laboratorio Actuarial I',2,6,ARRAY['MA0455','MA0720']),
('cienciasActuariales','CA0303','Estad├¡stica Actuarial I',4,6,ARRAY['MA0720']),
('cienciasActuariales','CA0304','Fundamentos de Riesgos y Seguros',4,6,ARRAY['MA0720']),
('cienciasActuariales','MA0501','An├ílisis Num├®rico I',4,6,ARRAY['CI0112','MA0450','MA0455','MA0460']),
('cienciasActuariales','CA0401','Matem├íticas Actuariales II',4,7,ARRAY['CA0301','CA0302']),
('cienciasActuariales','CA0402','Laboratorio Actuarial II',2,7,ARRAY['CA0301','CA0302']),
('cienciasActuariales','CA0403','Estad├¡stica Actuarial II',4,7,ARRAY['CA0303']),
('cienciasActuariales','CA0406','Procesos Estoc├ísticos y Series Temporales',4,7,ARRAY['MA0455','MA0720']),
('cienciasActuariales','OPT787','Cursos Optativos',4,7,'{}'),
('cienciasActuariales','CA0404','Modelos Lineales',4,8,ARRAY['MA0455','MA0720']),
('cienciasActuariales','CA0405','Matem├íticas Actuariales III',4,8,ARRAY['CA0401','CA0402']),
('cienciasActuariales','CA0407','Pr├íctica Actuarial I',3,8,ARRAY['CA0401']),
('cienciasActuariales','CA0409','Distribuciones de P├®rdidas',4,8,ARRAY['CA0406']),
('cienciasActuariales','CA0410','Teor├¡a de Riesgos',4,8,ARRAY['CA0406']),
('cienciasActuariales','CA0501','Reg├¡menes de Pensiones',4,9,ARRAY['CA0405']),
('cienciasActuariales','CA0502','Laboratorio Actuarial III',3,9,ARRAY['CA0402','CA0405']),
('cienciasActuariales','CA0503','Modelos de Vida',4,9,ARRAY['CA0405']),
('cienciasActuariales','CA0504','Introducci├│n a la Optimizaci├│n',4,9,ARRAY['MA0450','MA0460']),
('cienciasActuariales','CA0506','An├ílisis de Datos',4,10,ARRAY['CA0403']),
('cienciasActuariales','CA0508','Pr├íctica Actuarial II',4,10,ARRAY['CA0504']),
('cienciasActuariales','CA0509','Teor├¡a de Credibilidad',4,10,ARRAY['CA0409','CA0410']),
('cienciasActuariales','CA0510','An├ílisis de Estados Financieros',4,10,ARRAY['CA0410']),
('cienciasActuariales','MA9500','Investigaci├│n Dirigida 1',0,11,'{}'),
('cienciasActuariales','MA9501','Investigaci├│n Dirigida 2',0,11,ARRAY['MA9500']),
('cienciasActuariales','MA9600','Seminario de Graduaci├│n 1',0,11,'{}'),
('cienciasActuariales','MA9700','Pr├íctica Dirigida 1',0,11,'{}'),
('farmacia','EG-','Curso de Arte',2,1,'{}'),
('farmacia','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('farmacia','FS0132','F├¡sica Aplicada a Farmacia',3,1,'{}'),
('farmacia','FS0133','Lab. F├¡sica Aplicada a Farmacia',1,1,'{}'),
('farmacia','MA1210','C├ílculo I',3,1,'{}'),
('farmacia','QU0100','Qu├¡mica General I',3,1,'{}'),
('farmacia','QU0101','Lab. Qu├¡mica General I',1,1,'{}'),
('farmacia','B0106','Biolog├¡a General',3,2,'{}'),
('farmacia','B0107','Lab. Biolog├¡a General',1,2,'{}'),
('farmacia','EF-','Actividad Deportiva',0,2,'{}'),
('farmacia','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('farmacia','MA2210','Ecuaciones Diferenciales Aplicadas',3,2,ARRAY['MA1210']),
('farmacia','QU0102','Qu├¡mica General II',3,2,ARRAY['QU0100','QU0101']),
('farmacia','QU0103','Lab. Qu├¡mica General II',1,2,ARRAY['QU0100','QU0101']),
('farmacia','FA2009','Introducci├│n a la Farmacia',3,3,'{}'),
('farmacia','MN0220','Anatom├¡a Macrosc├│pica',4,3,ARRAY['B0106','B0107']),
('farmacia','QU0212','Qu├¡mica Org├ínica General I',4,3,ARRAY['QU0102','QU0103']),
('farmacia','QU0213','Lab. Qu├¡mica Org├ínica General I',1,3,ARRAY['QU0102','QU0103']),
('farmacia','SR-I','Seminario de Realidad Nacional I',2,3,ARRAY['EG-II']),
('farmacia','XS0215','Estad├¡stica para Biociencias',4,3,ARRAY['MA1210']),
('farmacia','FA0217','Metodolog├¡a de la Investigaci├│n Farmac├®utica',3,4,ARRAY['FA2009','XS0215']),
('farmacia','FA0335','Fisicoqu├¡mica Farmac├®utica I',4,4,ARRAY['FS0132','FS0133','MA2210','QU0212','QU0213','XS0215']),
('farmacia','FA3030','Conferencia General I',0,4,'{}'),
('farmacia','QU0214','Qu├¡mica Org├ínica General II',4,4,ARRAY['QU0212','QU0213']),
('farmacia','QU0215','Lab. Qu├¡mica Org├ínica General II',1,4,ARRAY['QU0212','QU0213']),
('farmacia','RP-1','Repertorio',3,4,'{}'),
('farmacia','SR-II','Seminario de Realidad Nacional II',2,4,ARRAY['SR-I']),
('farmacia','FA0218','An├ílisis de Medicamentos I',5,5,ARRAY['FS0132','FS0133','QU0214','QU0215','XS0215']),
('farmacia','FA0336','Fisicoqu├¡mica Farmac├®utica II',4,5,ARRAY['FA0335']),
('farmacia','FA0337','Elementos de Salud P├║blica',2,5,ARRAY['FA0217','FA3030']),
('farmacia','MQ0208','Bioqu├¡mica para Farmacia',4,5,ARRAY['B0106','B0107','QU0214','QU0215']),
('farmacia','OPT1043','Cursos Optativos del V Ciclo',2,5,'{}'),
('farmacia','FA0219','Elementos de Fisiopatolog├¡a y Terape├║tica',2,6,ARRAY['MN0220']),
('farmacia','FA0222','An├ílisis de Medicamentos II',4,6,ARRAY['FA0218']),
('farmacia','FA0223','Fundamentos de Inmunolog├¡a',3,6,ARRAY['MQ0208']),
('farmacia','FA0338','Biofarmacia y Farmacocin├®tica',4,6,ARRAY['FA0336']),
('farmacia','MF1000','Fisiolog├¡a Humana',6,6,ARRAY['MQ0208']),
('farmacia','F5001','├ëtica Profesional Farmace├║tica',1,7,ARRAY['FA0337']),
('farmacia','FA0224','Microbiolog├¡a Cl├¡nica y Terape├║tica',3,7,ARRAY['FA0219','FA0223','MF1000']),
('farmacia','FA0225','Farmacolog├¡a I',3,7,ARRAY['FA0223','FA0338','MF1000']),
('farmacia','FA0226','Laboratorio de Farmacolog├¡a I',1,7,ARRAY['FA0225']),
('farmacia','FA0227','An├ílisis de Medicamentos III',4,7,ARRAY['FA0222']),
('farmacia','FA0228','Farmacognosia',2,7,ARRAY['MQ0208']),
('farmacia','FA0229','Laboratorio de Farmacognosia',2,7,ARRAY['FA0217','FA0228']),
('farmacia','FA0230','Fundamentos de Biotecnolog├¡a Farmace├║tica',2,7,ARRAY['FA0219','FA0223','FA0338']),
('farmacia','FA0231','Farmacolog├¡a II',3,8,ARRAY['FA0219','FA0224','FA0225']),
('farmacia','FA0232','Laboratorio de Farmacolog├¡a II',1,8,ARRAY['FA0226','FA0231']),
('farmacia','FA0233','Tecnolog├¡a Farmace├║tica I',4,8,ARRAY['FA0227','FA0338']),
('farmacia','FA0234','Atenci├│n Farmace├║tica I',4,8,ARRAY['F5001','FA0225']),
('farmacia','FA0235','Farmacia de Comunidad',2,8,ARRAY['FA2009','FA0234']),
('farmacia','FA0310','Qu├¡mica Medicinal I',3,8,ARRAY['FA0228','FA0338']),
('farmacia','OPT1064','Optativos del Ciclo VIII',2,8,'{}'),
('farmacia','FA0215','Gesti├│n de la Innovaci├│n en el ├ürea de Salud',2,9,ARRAY['FA0217','FA2009']),
('farmacia','FA0236','Qu├¡mica Medicinal II',3,9,ARRAY['FA0224','FA0310']),
('farmacia','FA0237','Farmacolog├¡a III',3,9,ARRAY['FA0223','FA0225']),
('farmacia','FA0238','Laboratorio de Farmacolog├¡a III',1,9,ARRAY['FA0237']),
('farmacia','FA0239','Atenci├│n Farmace├║tica II',4,9,ARRAY['FA0231','FA0234']),
('farmacia','FA0315','Tecnolog├¡a Farmace├║tica II',4,9,ARRAY['FA0227','FA0338']),
('farmacia','OPT1065','Optativos del Ciclo IX',2,9,'{}'),
('farmacia','FA0316','Administraci├│n de Establecimientos Farmace├║ticos',2,10,ARRAY['FA0215']),
('farmacia','FA0317','Farmacia Industrial',2,10,ARRAY['FA0233','FA0315']),
('farmacia','FA0339','Legislaci├│n y Deontolog├¡a Farmac├®utica',2,10,ARRAY['F5001','FA0235','FA0317']),
('farmacia','FA0341','Farmacia de Hospital',4,10,ARRAY['FA0237','FA0239']),
('farmacia','FA5026','Toxicolog├¡a',3,10,ARRAY['FA0237']),
('farmacia','OPT1044','Optativos Ciclo 10, Bloque A',2,10,'{}'),
('farmacia','OPT1045','Optativos Ciclo 10, Bloque B',3,10,'{}'),
('farmacia','FA9500','Investigaci├│n Dirigida 1',0,11,'{}'),
('farmacia','FA9501','Investigaci├│n Dirigida 2',0,11,ARRAY['FA9500']),
('farmacia','FA9502','Investigaci├│n Dirigida 3',0,11,ARRAY['FA9501']),
('farmacia','FA9700','Pr├íctica Dirigida I',0,11,'{}'),
('farmacia','FA9701','Pr├íctica Dirigida II',0,11,ARRAY['FA9700']),
('farmacia','FA9702','Pr├íctica Dirigida III',0,11,ARRAY['FA9701']),
('farmacia','FA9800','Proyecto de Graduaci├│n I',0,11,'{}'),
('farmacia','FA9801','Proyecto de Graduaci├│n II',0,11,ARRAY['FA9800']),
('farmacia','FA9802','Proyecto de Graduaci├│n III',0,11,ARRAY['FA9801']),
('ingenieriaQuimica','EG-','Curso de Arte',2,1,'{}'),
('ingenieriaQuimica','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('ingenieriaQuimica','LM1030','Estrategias de Lectura en Ingl├®s I',4,1,'{}'),
('ingenieriaQuimica','MA0001','Prec├ílculo',0,1,'{}'),
('ingenieriaQuimica','MA1001','C├ílculo I',3,1,ARRAY['MA0001']),
('ingenieriaQuimica','QU0100','Qu├¡mica General I',3,1,'{}'),
('ingenieriaQuimica','QU0101','Laboratorio de Qu├¡mica General I',1,1,'{}'),
('ingenieriaQuimica','EF-','Actividad Deportiva',0,2,'{}'),
('ingenieriaQuimica','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('ingenieriaQuimica','FS0210','F├¡sica General I',3,2,ARRAY['MA1001']),
('ingenieriaQuimica','FS0211','Laboratorio de F├¡sica General I',1,2,ARRAY['MA1001']),
('ingenieriaQuimica','MA1002','C├ílculo II',4,2,ARRAY['MA1001']),
('ingenieriaQuimica','QU0102','Qu├¡mica General II',3,2,ARRAY['QU0100','QU0101']),
('ingenieriaQuimica','QU0103','Laboratorio de Qu├¡mica General II',1,2,ARRAY['QU0100','QU0101']),
('ingenieriaQuimica','FS0310','F├¡sica General II',3,3,ARRAY['FS0210','FS0211','MA1002']),
('ingenieriaQuimica','FS0311','Laboratorio de F├¡sica General II',1,3,ARRAY['FS0210','FS0211','MA1002']),
('ingenieriaQuimica','IQ0200','An├ílisis Gr├ífico para Ing. Qu├¡mica',3,3,ARRAY['FS0210','MA1002','QU0102']),
('ingenieriaQuimica','MA1003','C├ílculo III',4,3,ARRAY['MA1002']),
('ingenieriaQuimica','MA1004','├ülgebra Lineal',3,3,'{}'),
('ingenieriaQuimica','QU0200','Qu├¡mica Anal├¡tica Cuantitativa I',3,3,ARRAY['QU0102','QU0103']),
('ingenieriaQuimica','QU0201','Lab. Qu├¡mica Anal├¡tica Cuantitativa I',2,3,ARRAY['QU0102','QU0103']),
('ingenieriaQuimica','CI0202','Principios de Inform├ítica',4,4,ARRAY['MA1001']),
('ingenieriaQuimica','FS0410','F├¡sica General III',3,4,ARRAY['FS0310','FS0311','MA1003']),
('ingenieriaQuimica','FS0411','Laboratorio de F├¡sica General III',1,4,ARRAY['FS0310','FS0311','MA1003']),
('ingenieriaQuimica','IQ0332','An├ílisis de Procesos I',4,4,ARRAY['FS0310','IQ0200']),
('ingenieriaQuimica','MA1005','Ecuaciones Diferenciales',4,4,ARRAY['MA1002','MA1004']),
('ingenieriaQuimica','QU0260','F├¡sico Qu├¡mica para Ing. Qu├¡mica',4,4,ARRAY['FS0310','FS0311','MA1002','QU0102','QU0103']),
('ingenieriaQuimica','IQ0312','Mec├ínica I',4,5,ARRAY['FS0210','FS0211','MA1003','MA1004']),
('ingenieriaQuimica','IQ0333','An├ílisis de Procesos II',3,5,ARRAY['CI0202','IQ0332','MA1003','MA1005']),
('ingenieriaQuimica','IQ0334','Termodin├ímica I',3,5,ARRAY['IQ0332','MA1005','QU0260']),
('ingenieriaQuimica','QU0212','Qu├¡mica Org├ínica General I',4,5,ARRAY['QU0102','QU0103']),
('ingenieriaQuimica','QU0213','Lab. Qu├¡mica Org├ínica General I',1,5,ARRAY['QU0102','QU0103']),
('ingenieriaQuimica','XS0217','Probabilidades e Inferencia Estad├¡stica',4,5,ARRAY['MA1004||MA1005']),
('ingenieriaQuimica','IE0303','Electrotecnia I',3,6,ARRAY['FS0310','FS0311','MA1003']),
('ingenieriaQuimica','IQ0313','Fen├│menos de Transferencia',4,6,ARRAY['IQ0333','IQ0334']),
('ingenieriaQuimica','IQ0331','Medici├│n y Tratamiento de Datos Exp.',3,6,ARRAY['FS0410','IQ0332','XS0217']),
('ingenieriaQuimica','IQ0335','Termodin├ímica II',3,6,ARRAY['CI0202','IQ0334','MA1003','QU0212']),
('ingenieriaQuimica','QU0214','Qu├¡mica Org├ínica General II',4,6,ARRAY['QU0212','QU0213']),
('ingenieriaQuimica','QU0215','Lab. Qu├¡mica Org├ínica General II',1,6,ARRAY['QU0212','QU0213']),
('ingenieriaQuimica','IQ0415','Ingenier├¡a de los Materiales',3,7,ARRAY['IQ0312','IQ0335']),
('ingenieriaQuimica','IQ0423','Operac. Transferencia Fluidos y Calor',3,7,ARRAY['IQ0313']),
('ingenieriaQuimica','IQ0432','Lab. Operac. Transferencia Fluidos y Calor',3,7,ARRAY['IQ0313']),
('ingenieriaQuimica','IQ0451','Planeamiento de la Producci├│n',3,7,ARRAY['XS0217']),
('ingenieriaQuimica','SR-I','Seminario de Realidad Nacional I',2,7,ARRAY['EG-II']),
('ingenieriaQuimica','IQ0416','Cin├®tica y Reactores Qu├¡micos',3,8,ARRAY['IQ0415','IQ0423','QU0214']),
('ingenieriaQuimica','IQ0424','Operaciones por Separaci├│n de Fases',3,8,ARRAY['IQ0335','IQ0423']),
('ingenieriaQuimica','IQ0433','Lab. Operaciones por Separaci├│n de Fases',2,8,ARRAY['IQ0335']),
('ingenieriaQuimica','IQ0452','Control de la Producci├│n',3,8,ARRAY['IQ0451']),
('ingenieriaQuimica','RP-1','Repertorio',3,8,'{}'),
('ingenieriaQuimica','SR-II','Seminario de Realidad Nacional II',2,8,ARRAY['SR-I']),
('ingenieriaQuimica','IQ0517','Control e Instrumentaci├│n de Procesos',3,9,ARRAY['IE0303','IQ0416','IQ0424']),
('ingenieriaQuimica','IQ0525','Operac. Separaci├│n M├®todos Difusionales',3,9,ARRAY['IQ0424']),
('ingenieriaQuimica','IQ0534','Lab. Operac. Separaci├│n M├®todos Difus.',2,9,ARRAY['IQ0424']),
('ingenieriaQuimica','IQ0553','Evaluaci├│n de Proyectos',3,9,ARRAY['IQ0424','IQ0452']),
('ingenieriaQuimica','IQ0590','Seminario para Proyectos de Graduaci├│n',2,9,ARRAY['IQ0424','IQ0452']),
('ingenieriaQuimica','IQ0526','Procesos y Operaciones Integradas',3,10,ARRAY['IQ0525','IQ0553']),
('ingenieriaQuimica','IQ0551','Dise├▒o de Procesos Qu├¡micos',3,10,ARRAY['IQ0416','IQ0525','IQ0553']),
('ingenieriaQuimica','IQ0556','Principios de Administraci├│n Industrial',3,10,ARRAY['IQ0525','IQ0553']),
('ingenieriaQuimica','IQ9500','Investigaci├│n Dirigida I',0,10,ARRAY['IQ0590']),
('ingenieriaQuimica','IQ9700','Pr├íctica Dirigida I',0,10,'{}'),
('ingenieriaQuimica','IQ9800','Proyecto de Graduaci├│n I',0,10,'{}'),
('economia','EC1100','Introducci├│n a la Econom├¡a',4,1,'{}'),
('economia','EC4101','Datos Econ├│micos',3,1,'{}'),
('economia','MA1001','C├ílculo I',3,1,ARRAY['MA0001']),
('economia','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('economia','EC2100','Teor├¡a Microecon├│mica I',4,2,ARRAY['EC1100','MA1001']),
('economia','MA1004','├ülgebra Lineal',3,2,'{}'),
('economia','MA1023','C├ílculo con Optimizaci├│n',4,2,ARRAY['MA1001']),
('economia','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('economia','EC2200','Teor├¡a Microecon├│mica II',4,3,ARRAY['EC2100','MA1023']),
('economia','EC3200','Teor├¡a Macroecon├│mica I',4,3,ARRAY['EC2100','MA1023']),
('economia','MA1005','Ecuaciones Diferenciales',4,3,ARRAY['MA1002','MA1004']),
('economia','MA1030','Introducci├│n a la Probabilidad',4,3,ARRAY['MA1023']),
('economia','LM0303','Ingl├®s para Econom├¡a I',3,3,ARRAY['EC2100']),
('economia','EC2201','Teor├¡a de Juegos e Informaci├│n',3,4,ARRAY['EC2200','MA1030']),
('economia','EC3201','Teor├¡a Macroecon├│mica II',4,4,ARRAY['EC2200','EC3200','MA1005']),
('economia','XS0100','Fundamentos de Teor├¡a Estad├¡stica',3,4,ARRAY['EC4101','MA1030']),
('economia','CI0108','Computaci├│n para Economistas',4,4,ARRAY['MA1001','MA1004']),
('economia','EC4200','Econometr├¡a',3,5,ARRAY['MA1004','XS0100']),
('economia','EC2300','Comercio Internacional',3,5,ARRAY['EC2201']),
('economia','EC3300','Crecimiento y Ciclos',3,5,ARRAY['EC3201']),
('economia','FL2076','Redacci├│n para Econom├¡a',3,5,ARRAY['EC2201','EC3201']),
('economia','EC2301','Econom├¡a Financiera',3,6,ARRAY['EC2201','EC4200']),
('economia','EC4300','Microeconometr├¡a',3,6,ARRAY['CI0108','EC2200','EC4200']),
('economia','EC4301','Macroeconometr├¡a',3,6,ARRAY['CI0108','EC3201','EC4200']),
('economia','EC3302','Econom├¡a Monetaria',3,6,ARRAY['EC3300','EC4200']),
('economia','EC1300','Historia del Pensamiento Econ├│mico',3,7,ARRAY['EC3201','HA1415']),
('economia','EC1400','Seminario de Investigaci├│n Econ├│mica I',3,7,ARRAY['EC2301','EC3300','EC4300','EC4301']),
('economia','EC1401','Seminario de Investigaci├│n Econ├│mica II',3,8,ARRAY['EC1400']),
('economia','EC1001','Econom├¡a Urbana y Regional',3,8,ARRAY['EC2201','EC3300','EC4200']),
('economia','EC1005','Econom├¡a Ambiental y de Recursos Naturales',3,8,ARRAY['EC2201','EC3300','EC4200']),
('economia','EC2003','Derivados Financieros',3,8,ARRAY['EC2301','EC3300','EC4200']),
('economia','EC2011','Microeconom├¡a Avanzada',3,8,ARRAY['EC2201','EC3300','EC4200']),
('medicina','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('medicina','QU0114','Qu├¡mica General Intensiva',4,1,'{}'),
('medicina','QU0115','Lab. Qu├¡mica General Intensiva',1,1,'{}'),
('medicina','EG-','Curso de Arte',2,1,'{}'),
('medicina','EF-','Actividad Deportiva',0,1,'{}'),
('medicina','MA1210','C├ílculo I',3,1,'{}'),
('medicina','LM1030','Estrategias de Lectura en Ingl├®s I',4,1,'{}'),
('medicina','HA1009','Historia de la Medicina',2,1,'{}'),
('medicina','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('medicina','FS0208','F├¡sica para Ciencias M├®dicas',3,2,ARRAY['MA1210||MA1001']),
('medicina','FS0204','Lab. F├¡sica para Ciencias M├®dicas',1,2,'{}'),
('medicina','QU0210','Fundamentos de Qu├¡mica Org├ínica',4,2,ARRAY['QU0114','QU0115']),
('medicina','QU0211','Lab. Fundamentos de Qu├¡mica Org├ínica',1,2,ARRAY['QU0114','QU0115']),
('medicina','B0106','Biolog├¡a General',3,2,'{}'),
('medicina','B0107','Lab. Biolog├¡a General',1,2,'{}'),
('medicina','ME0410','Fundamentos de Psiquiatr├¡a',2,3,ARRAY['B0106','B0107']),
('medicina','ME0411','Histolog├¡a',5,3,ARRAY['QU0210','QU0211']),
('medicina','ME0412','Anatom├¡a Descriptiva',5,3,ARRAY['B0106','B0107','FS0204','FS0208','LM1030']),
('medicina','ME0421','Embriolog├¡a',2,3,ARRAY['B0106','B0107']),
('medicina','ME0117','Bioqu├¡mica para Medicina',6,3,ARRAY['LM1030','QU0210']),
('medicina','ME0113','Lab. Bioqu├¡mica para Medicina',2,3,ARRAY['LM1030','QU0210','QU0211']),
('medicina','SR-I','Seminario de Realidad Nacional I',2,3,ARRAY['EG-II']),
('medicina','ME2012','Fisiolog├¡a',10,4,ARRAY['ME0411','ME0412','ME0421','ME0113','ME0117']),
('medicina','ME0422','Neuroanatom├¡a',3,4,ARRAY['ME0421','ME0113','ME0117']),
('medicina','SR-II','Seminario de Realidad Nacional II',2,4,ARRAY['SR-I']),
('medicina','RP-','Repertorio',3,4,'{}'),
('medicina','ME0414','Anatom├¡a Topogr├ífica Radiol├│gica y Quir├║rgica',5,4,ARRAY['ME0411','ME0412','ME0421','ME0113','ME0117']),
('medicina','OPT-MED1','Optativo Bloque I',1,4,'{}'),
('medicina','F0008','Seminario ├ëtica, Medicina y Sociedad',0,5,ARRAY['ME2012','ME0414']),
('medicina','XS0215','Estad├¡stica para Biociencias',4,5,ARRAY['MA1210||MA1001']),
('medicina','ME0109','Patolog├¡a Humana I',5,5,ARRAY['ME2012','ME0414','ME0422']),
('medicina','ME3103','Fisiopatolog├¡a y Semiolog├¡a',10,5,ARRAY['ME2012','ME0414','ME0422']),
('medicina','ME0104','Enfermedades Infecciosas I',4,5,ARRAY['ME2012','ME0414']),
('medicina','ME0108','Patolog├¡a Humana II',5,6,ARRAY['ME0109','ME3103','ME0104']),
('medicina','ME3005','Medicina Interna I',10,6,ARRAY['ME0109','ME0104','ME3103']),
('medicina','ME0107','Enfermedades Infecciosas II',4,6,ARRAY['ME0104','ME0109','ME3103']),
('medicina','ME2200','Proped├®utica Psiqui├ítrica',2,6,ARRAY['ME0410','ME2012','ME0422']),
('medicina','ME0313','Medicina Integral y Comunitaria I',2,7,ARRAY['ME3005','ME0107']),
('medicina','ME0306','Farmacolog├¡a B├ísica I',3,7,ARRAY['ME0108','ME3005','ME0107']),
('medicina','ME4012','Obstetricia',6,7,ARRAY['ME0108','ME3005','ME0107']),
('medicina','ME4013','Ginecolog├¡a',6,7,ARRAY['ME0108','ME3005','ME0107']),
('medicina','ME4014','Medicina Legal',4,7,ARRAY['ME0108','ME3005','ME0107']),
('medicina','ME1007','Introducci├│n a la Investigaci├│n en Medicina',2,8,ARRAY['XS0215']),
('medicina','ME0310','Farmacolog├¡a B├ísica II',3,8,ARRAY['ME0306']),
('medicina','ME4015','Pediatr├¡a',10,8,ARRAY['ME0108','ME3005','ME0107']),
('medicina','ME4016','Psiquiatr├¡a',4,8,ARRAY['ME2200','ME3005','ME0107','ME0108']),
('medicina','ME1009','Gen├®tica M├®dica',2,8,ARRAY['ME3005','ME0108','ME0107']),
('medicina','ME0314','Medicina Integral y Comunitaria II',2,9,ARRAY['ME0313','ME0310','ME1007']),
('medicina','ME0315','Geriatr├¡a y Gerontolog├¡a I',2,9,ARRAY['ME0310','ME4013']),
('medicina','ME5000','Medicina Interna II',10,9,ARRAY['ME0310','ME4012','ME4013','ME4015']),
('medicina','ME0308','Farmacolog├¡a Cl├¡nica I',2,9,ARRAY['ME0310','ME4012','ME4013','ME4015']),
('medicina','ME0420','Toxicolog├¡a Cl├¡nica',2,9,ARRAY['ME0310','ME4012','ME4013','ME4015']),
('medicina','ME0316','Geriatr├¡a y Gerontolog├¡a II',2,10,ARRAY['ME0315','ME5000']),
('medicina','ME5001','Cirug├¡a',10,10,ARRAY['ME5000']),
('medicina','ME0311','Radiolog├¡a',2,10,ARRAY['ME4012','ME4013','ME4015']),
('medicina','ME0309','Farmacolog├¡a Cl├¡nica II',2,10,ARRAY['ME0308']),
('medicina','OPT-MED2','Optativo Bloque II',1,10,'{}'),
('medicina','ME6001','Internado de Cirug├¡a',10,11,ARRAY['ME5001']),
('medicina','ME6002','Internado de Pediatr├¡a',10,11,ARRAY['ME5001']),
('medicina','ME6003','Internado Gineco-Obstetricia',10,11,ARRAY['ME5001']),
('medicina','ME6004','Internado de Medicina Interna',10,12,ARRAY['ME5001']),
('medicina','ME6005','Salud Comunitaria y Familiar',8,12,ARRAY['ME5001']),
('microbiologia','B0103','Biolog├¡a General',3,1,'{}'),
('microbiologia','B0104','Laboratorio de Biolog├¡a General',1,1,ARRAY['B0103']),
('microbiologia','MA1001','C├ílculo I',4,1,'{}'),
('microbiologia','QU0100','Qu├¡mica General I',3,1,'{}'),
('microbiologia','QU0101','Laboratorio de Qu├¡mica General I',1,1,ARRAY['QU0100']),
('microbiologia','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('microbiologia','B0105','Laboratorio de Biolog├¡a Sistem├ítica',1,2,ARRAY['B0103','B0104']),
('microbiologia','FS0210','F├¡sica para Ciencias de la Vida I',3,2,ARRAY['MA1001']),
('microbiologia','FS0211','Lab. F├¡sica para Ciencias de la Vida I',1,2,ARRAY['MA1001','FS0210']),
('microbiologia','QU0102','Qu├¡mica General II',3,2,ARRAY['QU0100']),
('microbiologia','QU0103','Laboratorio de Qu├¡mica General II',1,2,ARRAY['QU0101','QU0102']),
('microbiologia','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('microbiologia','FS0310','F├¡sica para Ciencias de la Vida II',3,3,ARRAY['FS0210']),
('microbiologia','FS0311','Lab. F├¡sica para Ciencias de la Vida II',1,3,ARRAY['FS0211','FS0310']),
('microbiologia','QU0200','Qu├¡mica Org├ínica I',3,3,ARRAY['QU0102']),
('microbiologia','QU0201','Laboratorio de Qu├¡mica Org├ínica I',1,3,ARRAY['QU0103','QU0200']),
('microbiologia','QU0250','Qu├¡mica Anal├¡tica Cuantitativa',3,3,ARRAY['QU0102']),
('microbiologia','QU0251','Lab. Qu├¡mica Anal├¡tica Cuantitativa',1,3,ARRAY['QU0103','QU0250']),
('microbiologia','SR-I','Seminario de Realidad Nacional I',2,3,ARRAY['EG-II']),
('microbiologia','MQ0201','Anatom├¡a y Fisiolog├¡a Humanas I',4,4,ARRAY['B0105','QU0200']),
('microbiologia','QU0202','Qu├¡mica Org├ínica II',3,4,ARRAY['QU0200']),
('microbiologia','QU0203','Laboratorio de Qu├¡mica Org├ínica II',1,4,ARRAY['QU0201','QU0202']),
('microbiologia','QU0252','An├ílisis Instrumental',3,4,ARRAY['QU0250']),
('microbiologia','QU0253','Laboratorio de An├ílisis Instrumental',1,4,ARRAY['QU0251','QU0252']),
('microbiologia','SR-II','Seminario de Realidad Nacional II',2,4,ARRAY['SR-I']),
('microbiologia','RP-','Repertorio',3,4,'{}'),
('microbiologia','BC0210','Bioqu├¡mica para Microbiolog├¡a',4,5,ARRAY['QU0202']),
('microbiologia','MQ0301','Anatom├¡a y Fisiolog├¡a Humanas II',4,5,ARRAY['MQ0201']),
('microbiologia','MQ0314','Parasitolog├¡a General',4,5,ARRAY['B0105']),
('microbiologia','MQ0318','Micolog├¡a',3,5,ARRAY['B0105']),
('microbiologia','MQ0319','Histolog├¡a Humana',3,5,ARRAY['MQ0201']),
('microbiologia','MQ0414','Microbiolog├¡a General',5,6,ARRAY['BC0210','MQ0314','MQ0318']),
('microbiologia','MQ0415','Inmunolog├¡a General',4,6,ARRAY['BC0210','MQ0319']),
('microbiologia','MQ0416','Virolog├¡a General',3,6,ARRAY['BC0210','MQ0319']),
('microbiologia','MQ0417','Gen├®tica Bacteriana',3,6,ARRAY['BC0210']),
('microbiologia','EF-','Actividad Deportiva',0,6,'{}'),
('microbiologia','MQ0511','Hematolog├¡a I',4,7,ARRAY['MQ0415','MQ0414']),
('microbiologia','MQ0513','Bacteriolog├¡a M├®dica I',4,7,ARRAY['MQ0414','MQ0415']),
('microbiologia','MQ0515','Inmunolog├¡a Cl├¡nica',4,7,ARRAY['MQ0415']),
('microbiologia','MQ0517','Protozoolog├¡a M├®dica',4,7,ARRAY['MQ0414','MQ0415']),
('microbiologia','MQ0512','Hematolog├¡a II',4,8,ARRAY['MQ0511']),
('microbiologia','MQ0514','Bacteriolog├¡a M├®dica II',4,8,ARRAY['MQ0513']),
('microbiologia','MQ0516','Qu├¡mica Cl├¡nica I',4,8,ARRAY['MQ0414','MQ0415']),
('microbiologia','MQ0518','Helmintolog├¡a M├®dica',4,8,ARRAY['MQ0517']),
('microbiologia','MQ0611','Banco de Sangre',3,9,ARRAY['MQ0512','MQ0515']),
('microbiologia','MQ0613','Qu├¡mica Cl├¡nica II',4,9,ARRAY['MQ0516']),
('microbiologia','MQ0614','Endocrinolog├¡a Cl├¡nica',3,9,ARRAY['MQ0516']),
('microbiologia','MQ0615','Situaci├│n de Salud Nacional',3,9,ARRAY['MQ0513','MQ0517']),
('microbiologia','MQ0616','Virolog├¡a Cl├¡nica',3,9,ARRAY['MQ0416','MQ0513','MQ0515']),
('microbiologia','MQ0617','Gesti├│n de la Calidad',3,9,ARRAY['MQ0513','MQ0516','MQ0517']),
('microbiologia','MQ0612','Administraci├│n de Laboratorios',3,10,ARRAY['MQ0617']),
('microbiologia','MQ0618','M├®todos de Investigaci├│n',3,10,ARRAY['MQ0615']),
('microbiologia','MQ0619','Toxicolog├¡a y An├ílisis de Drogas',3,10,ARRAY['MQ0613']),
('microbiologia','MQ0620','Microbiolog├¡a de Alimentos y Aguas',4,10,ARRAY['MQ0514','MQ0613']),
('microbiologia','MQ0621','├ëtica y Deontolog├¡a',2,10,'{}'),
('microbiologia','MQ0701','Internado Cl├¡nico',15,11,ARRAY['MQ0612','MQ0618','MQ0619','MQ0620','MQ0621','MQ0611','MQ0614','MQ0616'])
ON CONFLICT (carrera_id, codigo) DO NOTHING;
