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
  created_at      timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (id)
);

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
  created_at  timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

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
