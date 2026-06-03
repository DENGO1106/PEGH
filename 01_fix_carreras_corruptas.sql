-- ============================================================
-- INSERCIÓN LIMPIA: 6 CARRERAS CON ENCODING CORREGIDO
-- Ciencias Actuariales, Farmacia, Ing. Química, Economía, Medicina, Microbiología
-- Ejecutar en Supabase Dashboard > SQL Editor
-- ============================================================

-- Borrar los datos corruptos existentes primero
DELETE FROM public.courses_catalog WHERE carrera_id IN (
  'cienciasActuariales', 'farmacia', 'ingenieriaQuimica',
  'economia', 'medicina', 'microbiologia'
);

-- ============================================================
-- CIENCIAS ACTUARIALES
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) VALUES
-- I CICLO
('cienciasActuariales','EC1100','Introducción a la Economía',4,1,'{}'),
('cienciasActuariales','EF-','Actividad Deportiva',0,1,'{}'),
('cienciasActuariales','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('cienciasActuariales','MA0001','Pre-Cálculo',0,1,'{}'),
('cienciasActuariales','MA0150','Principios de Matemática',4,1,ARRAY['MA0001']),
('cienciasActuariales','RP-1','Repertorio',3,1,'{}'),
-- II CICLO
('cienciasActuariales','EG-','Curso de Arte',2,2,'{}'),
('cienciasActuariales','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('cienciasActuariales','LM1030','Estrategias de Lectura en Inglés I',4,2,'{}'),
('cienciasActuariales','MA0250','Cálculo en una Variable I',4,2,ARRAY['MA0150']),
-- III CICLO
('cienciasActuariales','CI0112','Programación I',4,3,ARRAY['MA0250']),
('cienciasActuariales','EC2100','Teoría Microeconómica 1',4,3,ARRAY['EC1100','MA0250']),
('cienciasActuariales','MA0350','Cálculo en una Variable II',4,3,ARRAY['MA0250']),
('cienciasActuariales','MA0360','Álgebra Lineal I',4,3,ARRAY['MA0250']),
('cienciasActuariales','SR-I','Seminario de Realidad Nacional I',2,3,ARRAY['EG-II']),
-- IV CICLO
('cienciasActuariales','CA0201','Teoría Matemática del Interés',4,4,ARRAY['MA0350']),
('cienciasActuariales','CA0202','Herramientas de Cómputo Actuarial',4,4,ARRAY['CI0112','MA0350']),
('cienciasActuariales','MA0450','Cálculo en Varias Variables',4,4,ARRAY['MA0350']),
('cienciasActuariales','MA0460','Álgebra Lineal II',4,4,ARRAY['MA0360']),
('cienciasActuariales','SR-II','Seminario de Realidad Nacional II',2,4,ARRAY['SR-I']),
-- V CICLO
('cienciasActuariales','CA0408','Análisis de Instrumentos de Inversión',4,5,ARRAY['CA0201','CA0202']),
('cienciasActuariales','EC3200','Teoría Macroeconómica I',4,5,ARRAY['EC2100','MA0450']),
('cienciasActuariales','MA0455','Ecuaciones Diferenciales Ordinarias',4,5,ARRAY['MA0450','MA0460']),
('cienciasActuariales','MA0720','Probabilidades I',5,5,ARRAY['MA0450','MA0460']),
-- VI CICLO
('cienciasActuariales','CA0301','Matemática Actuarial I',4,6,ARRAY['MA0455','MA0720']),
('cienciasActuariales','CA0302','Laboratorio Actuarial I',2,6,ARRAY['MA0455','MA0720']),
('cienciasActuariales','CA0303','Estadística Actuarial I',4,6,ARRAY['MA0720']),
('cienciasActuariales','CA0304','Fundamentos de Riesgos y Seguros',4,6,ARRAY['MA0720']),
('cienciasActuariales','MA0501','Análisis Numérico I',4,6,ARRAY['CI0112','MA0450','MA0455','MA0460']),
-- VII CICLO
('cienciasActuariales','CA0401','Matemáticas Actuariales II',4,7,ARRAY['CA0301','CA0302']),
('cienciasActuariales','CA0402','Laboratorio Actuarial II',2,7,ARRAY['CA0301','CA0302']),
('cienciasActuariales','CA0403','Estadística Actuarial II',4,7,ARRAY['CA0303']),
('cienciasActuariales','CA0406','Procesos Estocásticos y Series Temporales',4,7,ARRAY['MA0455','MA0720']),
('cienciasActuariales','OPT787','Cursos Optativos',4,7,'{}'),
-- VIII CICLO
('cienciasActuariales','CA0404','Modelos Lineales',4,8,ARRAY['MA0455','MA0720']),
('cienciasActuariales','CA0405','Matemáticas Actuariales III',4,8,ARRAY['CA0401','CA0402']),
('cienciasActuariales','CA0407','Práctica Actuarial I',3,8,ARRAY['CA0401']),
('cienciasActuariales','CA0409','Distribuciones de Pérdidas',4,8,ARRAY['CA0406']),
('cienciasActuariales','CA0410','Teoría de Riesgos',4,8,ARRAY['CA0406']),
-- IX CICLO
('cienciasActuariales','CA0501','Regímenes de Pensiones',4,9,ARRAY['CA0405']),
('cienciasActuariales','CA0502','Laboratorio Actuarial III',3,9,ARRAY['CA0402','CA0405']),
('cienciasActuariales','CA0503','Modelos de Vida',4,9,ARRAY['CA0405']),
('cienciasActuariales','CA0504','Introducción a la Optimización',4,9,ARRAY['MA0450','MA0460']),
-- X CICLO
('cienciasActuariales','CA0506','Análisis de Datos',4,10,ARRAY['CA0403']),
('cienciasActuariales','CA0508','Práctica Actuarial II',4,10,ARRAY['CA0504']),
('cienciasActuariales','CA0509','Teoría de Credibilidad',4,10,ARRAY['CA0409','CA0410']),
('cienciasActuariales','CA0510','Análisis de Estados Financieros',4,10,ARRAY['CA0410']),
-- XI CICLO (Graduación - varias modalidades)
('cienciasActuariales','MA9500','Investigación Dirigida 1',0,11,'{}'),
('cienciasActuariales','MA9501','Investigación Dirigida 2',0,11,ARRAY['MA9500']),
('cienciasActuariales','MA9600','Seminario de Graduación 1',0,11,'{}'),
('cienciasActuariales','MA9700','Práctica Dirigida 1',0,11,'{}')
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- FARMACIA
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) VALUES
-- I CICLO
('farmacia','EG-','Curso de Arte',2,1,'{}'),
('farmacia','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('farmacia','FS0132','Física Aplicada a Farmacia',3,1,'{}'),
('farmacia','FS0133','Lab. Física Aplicada a Farmacia',1,1,'{}'),
('farmacia','MA1210','Cálculo I',3,1,'{}'),
('farmacia','QU0100','Química General I',3,1,'{}'),
('farmacia','QU0101','Lab. Química General I',1,1,'{}'),
-- II CICLO
('farmacia','B0106','Biología General',3,2,'{}'),
('farmacia','B0107','Lab. Biología General',1,2,'{}'),
('farmacia','EF-','Actividad Deportiva',0,2,'{}'),
('farmacia','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('farmacia','MA2210','Ecuaciones Diferenciales Aplicadas',3,2,ARRAY['MA1210']),
('farmacia','QU0102','Química General II',3,2,ARRAY['QU0100','QU0101']),
('farmacia','QU0103','Lab. Química General II',1,2,ARRAY['QU0100','QU0101']),
-- III CICLO
('farmacia','FA2009','Introducción a la Farmacia',3,3,'{}'),
('farmacia','MN0220','Anatomía Macroscópica',4,3,ARRAY['B0106','B0107']),
('farmacia','QU0212','Química Orgánica General I',4,3,ARRAY['QU0102','QU0103']),
('farmacia','QU0213','Lab. Química Orgánica General I',1,3,ARRAY['QU0102','QU0103']),
('farmacia','SR-I','Seminario de Realidad Nacional I',2,3,ARRAY['EG-II']),
('farmacia','XS0215','Estadística para Biociencias',4,3,ARRAY['MA1210']),
-- IV CICLO
('farmacia','FA0217','Metodología de la Investigación Farmacéutica',3,4,ARRAY['FA2009','XS0215']),
('farmacia','FA0335','Fisicoquímica Farmacéutica I',4,4,ARRAY['FS0132','FS0133','MA2210','QU0212','QU0213','XS0215']),
('farmacia','FA3030','Conferencia General I',0,4,'{}'),
('farmacia','QU0214','Química Orgánica General II',4,4,ARRAY['QU0212','QU0213']),
('farmacia','QU0215','Lab. Química Orgánica General II',1,4,ARRAY['QU0212','QU0213']),
('farmacia','RP-1','Repertorio',3,4,'{}'),
('farmacia','SR-II','Seminario de Realidad Nacional II',2,4,ARRAY['SR-I']),
-- V CICLO
('farmacia','FA0218','Análisis de Medicamentos I',5,5,ARRAY['FS0132','FS0133','QU0214','QU0215','XS0215']),
('farmacia','FA0336','Fisicoquímica Farmacéutica II',4,5,ARRAY['FA0335']),
('farmacia','FA0337','Elementos de Salud Pública',2,5,ARRAY['FA0217','FA3030']),
('farmacia','MQ0208','Bioquímica para Farmacia',4,5,ARRAY['B0106','B0107','QU0214','QU0215']),
('farmacia','OPT1043','Cursos Optativos del V Ciclo',2,5,'{}'),
-- VI CICLO
('farmacia','FA0219','Elementos de Fisiopatología y Terapéutica',2,6,ARRAY['MN0220']),
('farmacia','FA0222','Análisis de Medicamentos II',4,6,ARRAY['FA0218']),
('farmacia','FA0223','Fundamentos de Inmunología',3,6,ARRAY['MQ0208']),
('farmacia','FA0338','Biofarmacia y Farmacocinética',4,6,ARRAY['FA0336']),
('farmacia','MF1000','Fisiología Humana',6,6,ARRAY['MQ0208']),
-- VII CICLO
('farmacia','F5001','Ética Profesional Farmacéutica',1,7,ARRAY['FA0337']),
('farmacia','FA0224','Microbiología Clínica y Terapéutica',3,7,ARRAY['FA0219','FA0223','MF1000']),
('farmacia','FA0225','Farmacología I',3,7,ARRAY['FA0223','FA0338','MF1000']),
('farmacia','FA0226','Laboratorio de Farmacología I',1,7,ARRAY['FA0225']),
('farmacia','FA0227','Análisis de Medicamentos III',4,7,ARRAY['FA0222']),
('farmacia','FA0228','Farmacognosia',2,7,ARRAY['MQ0208']),
('farmacia','FA0229','Laboratorio de Farmacognosia',2,7,ARRAY['FA0217','FA0228']),
('farmacia','FA0230','Fundamentos de Biotecnología Farmacéutica',2,7,ARRAY['FA0219','FA0223','FA0338']),
-- VIII CICLO
('farmacia','FA0231','Farmacología II',3,8,ARRAY['FA0219','FA0224','FA0225']),
('farmacia','FA0232','Laboratorio de Farmacología II',1,8,ARRAY['FA0226','FA0231']),
('farmacia','FA0233','Tecnología Farmacéutica I',4,8,ARRAY['FA0227','FA0338']),
('farmacia','FA0234','Atención Farmacéutica I',4,8,ARRAY['F5001','FA0225']),
('farmacia','FA0235','Farmacia de Comunidad',2,8,ARRAY['FA2009','FA0234']),
('farmacia','FA0310','Química Medicinal I',3,8,ARRAY['FA0228','FA0338']),
('farmacia','OPT1064','Optativos del Ciclo VIII',2,8,'{}'),
-- IX CICLO
('farmacia','FA0215','Gestión de la Innovación en el Área de Salud',2,9,ARRAY['FA0217','FA2009']),
('farmacia','FA0236','Química Medicinal II',3,9,ARRAY['FA0224','FA0310']),
('farmacia','FA0237','Farmacología III',3,9,ARRAY['FA0223','FA0225']),
('farmacia','FA0238','Laboratorio de Farmacología III',1,9,ARRAY['FA0237']),
('farmacia','FA0239','Atención Farmacéutica II',4,9,ARRAY['FA0231','FA0234']),
('farmacia','FA0315','Tecnología Farmacéutica II',4,9,ARRAY['FA0227','FA0338']),
('farmacia','OPT1065','Optativos del Ciclo IX',2,9,'{}'),
-- X CICLO
('farmacia','FA0316','Administración de Establecimientos Farmacéuticos',2,10,ARRAY['FA0215']),
('farmacia','FA0317','Farmacia Industrial',2,10,ARRAY['FA0233','FA0315']),
('farmacia','FA0339','Legislación y Deontología Farmacéutica',2,10,ARRAY['F5001','FA0235','FA0317']),
('farmacia','FA0341','Farmacia de Hospital',4,10,ARRAY['FA0237','FA0239']),
('farmacia','FA5026','Toxicología',3,10,ARRAY['FA0237']),
('farmacia','OPT1044','Optativos Ciclo 10, Bloque A',2,10,'{}'),
('farmacia','OPT1045','Optativos Ciclo 10, Bloque B',3,10,'{}'),
-- XI CICLO (Graduación)
('farmacia','FA9500','Investigación Dirigida 1',0,11,'{}'),
('farmacia','FA9501','Investigación Dirigida 2',0,11,ARRAY['FA9500']),
('farmacia','FA9502','Investigación Dirigida 3',0,11,ARRAY['FA9501']),
('farmacia','FA9700','Práctica Dirigida I',0,11,'{}'),
('farmacia','FA9701','Práctica Dirigida II',0,11,ARRAY['FA9700']),
('farmacia','FA9702','Práctica Dirigida III',0,11,ARRAY['FA9701']),
('farmacia','FA9800','Proyecto de Graduación I',0,11,'{}'),
('farmacia','FA9801','Proyecto de Graduación II',0,11,ARRAY['FA9800']),
('farmacia','FA9802','Proyecto de Graduación III',0,11,ARRAY['FA9801'])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- INGENIERÍA QUÍMICA
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) VALUES
-- I CICLO
('ingenieriaQuimica','EG-','Curso de Arte',2,1,'{}'),
('ingenieriaQuimica','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('ingenieriaQuimica','LM1030','Estrategias de Lectura en Inglés I',4,1,'{}'),
('ingenieriaQuimica','MA0001','Precálculo',0,1,'{}'),
('ingenieriaQuimica','MA1001','Cálculo I',3,1,ARRAY['MA0001']),
('ingenieriaQuimica','QU0100','Química General I',3,1,'{}'),
('ingenieriaQuimica','QU0101','Laboratorio de Química General I',1,1,'{}'),
-- II CICLO
('ingenieriaQuimica','EF-','Actividad Deportiva',0,2,'{}'),
('ingenieriaQuimica','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('ingenieriaQuimica','FS0210','Física General I',3,2,ARRAY['MA1001']),
('ingenieriaQuimica','FS0211','Laboratorio de Física General I',1,2,ARRAY['MA1001']),
('ingenieriaQuimica','MA1002','Cálculo II',4,2,ARRAY['MA1001']),
('ingenieriaQuimica','QU0102','Química General II',3,2,ARRAY['QU0100','QU0101']),
('ingenieriaQuimica','QU0103','Laboratorio de Química General II',1,2,ARRAY['QU0100','QU0101']),
-- III CICLO
('ingenieriaQuimica','FS0310','Física General II',3,3,ARRAY['FS0210','FS0211','MA1002']),
('ingenieriaQuimica','FS0311','Laboratorio de Física General II',1,3,ARRAY['FS0210','FS0211','MA1002']),
('ingenieriaQuimica','IQ0200','Análisis Gráfico para Ing. Química',3,3,ARRAY['FS0210','MA1002','QU0102']),
('ingenieriaQuimica','MA1003','Cálculo III',4,3,ARRAY['MA1002']),
('ingenieriaQuimica','MA1004','Álgebra Lineal',3,3,'{}'),
('ingenieriaQuimica','QU0200','Química Analítica Cuantitativa I',3,3,ARRAY['QU0102','QU0103']),
('ingenieriaQuimica','QU0201','Lab. Química Analítica Cuantitativa I',2,3,ARRAY['QU0102','QU0103']),
-- IV CICLO
('ingenieriaQuimica','CI0202','Principios de Informática',4,4,ARRAY['MA1001']),
('ingenieriaQuimica','FS0410','Física General III',3,4,ARRAY['FS0310','FS0311','MA1003']),
('ingenieriaQuimica','FS0411','Laboratorio de Física General III',1,4,ARRAY['FS0310','FS0311','MA1003']),
('ingenieriaQuimica','IQ0332','Análisis de Procesos I',4,4,ARRAY['FS0310','IQ0200']),
('ingenieriaQuimica','MA1005','Ecuaciones Diferenciales',4,4,ARRAY['MA1002','MA1004']),
('ingenieriaQuimica','QU0260','Físico Química para Ing. Química',4,4,ARRAY['FS0310','FS0311','MA1002','QU0102','QU0103']),
-- V CICLO
('ingenieriaQuimica','IQ0312','Mecánica I',4,5,ARRAY['FS0210','FS0211','MA1003','MA1004']),
('ingenieriaQuimica','IQ0333','Análisis de Procesos II',3,5,ARRAY['CI0202','IQ0332','MA1003','MA1005']),
('ingenieriaQuimica','IQ0334','Termodinámica I',3,5,ARRAY['IQ0332','MA1005','QU0260']),
('ingenieriaQuimica','QU0212','Química Orgánica General I',4,5,ARRAY['QU0102','QU0103']),
('ingenieriaQuimica','QU0213','Lab. Química Orgánica General I',1,5,ARRAY['QU0102','QU0103']),
('ingenieriaQuimica','XS0217','Probabilidades e Inferencia Estadística',4,5,ARRAY['MA1004||MA1005']),
-- VI CICLO
('ingenieriaQuimica','IE0303','Electrotecnia I',3,6,ARRAY['FS0310','FS0311','MA1003']),
('ingenieriaQuimica','IQ0313','Fenómenos de Transferencia',4,6,ARRAY['IQ0333','IQ0334']),
('ingenieriaQuimica','IQ0331','Medición y Tratamiento de Datos Exp.',3,6,ARRAY['FS0410','IQ0332','XS0217']),
('ingenieriaQuimica','IQ0335','Termodinámica II',3,6,ARRAY['CI0202','IQ0334','MA1003','QU0212']),
('ingenieriaQuimica','QU0214','Química Orgánica General II',4,6,ARRAY['QU0212','QU0213']),
('ingenieriaQuimica','QU0215','Lab. Química Orgánica General II',1,6,ARRAY['QU0212','QU0213']),
-- VII CICLO
('ingenieriaQuimica','IQ0415','Ingeniería de los Materiales',3,7,ARRAY['IQ0312','IQ0335']),
('ingenieriaQuimica','IQ0423','Operac. Transferencia Fluidos y Calor',3,7,ARRAY['IQ0313']),
('ingenieriaQuimica','IQ0432','Lab. Operac. Transferencia Fluidos y Calor',3,7,ARRAY['IQ0313']),
('ingenieriaQuimica','IQ0451','Planeamiento de la Producción',3,7,ARRAY['XS0217']),
('ingenieriaQuimica','SR-I','Seminario de Realidad Nacional I',2,7,ARRAY['EG-II']),
-- VIII CICLO
('ingenieriaQuimica','IQ0416','Cinética y Reactores Químicos',3,8,ARRAY['IQ0415','IQ0423','QU0214']),
('ingenieriaQuimica','IQ0424','Operaciones por Separación de Fases',3,8,ARRAY['IQ0335','IQ0423']),
('ingenieriaQuimica','IQ0433','Lab. Operaciones por Separación de Fases',2,8,ARRAY['IQ0335']),
('ingenieriaQuimica','IQ0452','Control de la Producción',3,8,ARRAY['IQ0451']),
('ingenieriaQuimica','RP-1','Repertorio',3,8,'{}'),
('ingenieriaQuimica','SR-II','Seminario de Realidad Nacional II',2,8,ARRAY['SR-I']),
-- IX CICLO
('ingenieriaQuimica','IQ0517','Control e Instrumentación de Procesos',3,9,ARRAY['IE0303','IQ0416','IQ0424']),
('ingenieriaQuimica','IQ0525','Operac. Separación Métodos Difusionales',3,9,ARRAY['IQ0424']),
('ingenieriaQuimica','IQ0534','Lab. Operac. Separación Métodos Difus.',2,9,ARRAY['IQ0424']),
('ingenieriaQuimica','IQ0553','Evaluación de Proyectos',3,9,ARRAY['IQ0424','IQ0452']),
('ingenieriaQuimica','IQ0590','Seminario para Proyectos de Graduación',2,9,ARRAY['IQ0424','IQ0452']),
-- X CICLO
('ingenieriaQuimica','IQ0526','Procesos y Operaciones Integradas',3,10,ARRAY['IQ0525','IQ0553']),
('ingenieriaQuimica','IQ0551','Diseño de Procesos Químicos',3,10,ARRAY['IQ0416','IQ0525','IQ0553']),
('ingenieriaQuimica','IQ0556','Principios de Administración Industrial',3,10,ARRAY['IQ0525','IQ0553']),
('ingenieriaQuimica','IQ9500','Investigación Dirigida I',0,10,ARRAY['IQ0590']),
('ingenieriaQuimica','IQ9700','Práctica Dirigida I',0,10,'{}'),
('ingenieriaQuimica','IQ9800','Proyecto de Graduación I',0,10,'{}')
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- ECONOMÍA
-- Nota: Se elimina el requisito "HA1415" que no estaba definido en el plan.
-- El curso EC1300 ahora solo requiere EC3201 como prerequisito directo.
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) VALUES
-- I CICLO
('economia','EC1100','Introducción a la Economía',4,1,'{}'),
('economia','EC4101','Datos Económicos',3,1,'{}'),
('economia','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('economia','MA0001','Precálculo',0,1,'{}'),
('economia','MA1001','Cálculo I',3,1,ARRAY['MA0001']),
-- II CICLO
('economia','EC2100','Teoría Microeconómica I',4,2,ARRAY['EC1100','MA1001']),
('economia','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('economia','MA1004','Álgebra Lineal',3,2,'{}'),
('economia','MA1023','Cálculo con Optimización',4,2,ARRAY['MA1001']),
-- III CICLO
('economia','EC2200','Teoría Microeconómica II',4,3,ARRAY['EC2100','MA1023']),
('economia','EC3200','Teoría Macroeconómica I',4,3,ARRAY['EC2100','MA1023']),
('economia','LM0303','Inglés para Economía I',3,3,ARRAY['EC2100']),
('economia','MA1002','Cálculo II',4,3,ARRAY['MA1023']),
('economia','MA1005','Ecuaciones Diferenciales',4,3,ARRAY['MA1002','MA1004']),
('economia','MA1030','Introducción a la Probabilidad',4,3,ARRAY['MA1023']),
-- IV CICLO
('economia','CI0108','Computación para Economistas',4,4,ARRAY['MA1001','MA1004']),
('economia','EC2201','Teoría de Juegos e Información',3,4,ARRAY['EC2200','MA1030']),
('economia','EC3201','Teoría Macroeconómica II',4,4,ARRAY['EC2200','EC3200','MA1005']),
('economia','SR-I','Seminario de Realidad Nacional I',2,4,ARRAY['EG-II']),
('economia','XS0100','Fundamentos de Teoría Estadística',3,4,ARRAY['EC4101','MA1030']),
-- V CICLO
('economia','EC2300','Comercio Internacional',3,5,ARRAY['EC2201']),
('economia','EC3300','Crecimiento y Ciclos',3,5,ARRAY['EC3201']),
('economia','EC4200','Econometría',3,5,ARRAY['MA1004','XS0100']),
('economia','FL2076','Redacción para Economía',3,5,ARRAY['EC2201','EC3201']),
('economia','SR-II','Seminario de Realidad Nacional II',2,5,ARRAY['SR-I']),
-- VI CICLO
('economia','EC2301','Economía Financiera',3,6,ARRAY['EC2201','EC4200']),
('economia','EC3302','Economía Monetaria',3,6,ARRAY['EC3300','EC4200']),
('economia','EC4300','Microeconometría',3,6,ARRAY['CI0108','EC2200','EC4200']),
('economia','EC4301','Macroeconometría',3,6,ARRAY['CI0108','EC3201','EC4200']),
-- VII CICLO (NOTA: HA1415 eliminado - no estaba definido en el plan)
('economia','EC1300','Historia del Pensamiento Económico',3,7,ARRAY['EC3201']),
('economia','EC1400','Seminario de Investigación Económica I',3,7,ARRAY['EC2301','EC3300','EC4300','EC4301']),
-- VIII CICLO
('economia','EC1001','Economía Urbana y Regional',3,8,ARRAY['EC2201','EC3300','EC4200']),
('economia','EC1005','Economía Ambiental y de Recursos Naturales',3,8,ARRAY['EC2201','EC3300','EC4200']),
('economia','EC1401','Seminario de Investigación Económica II',3,8,ARRAY['EC1400']),
('economia','EC2003','Derivados Financieros',3,8,ARRAY['EC2301','EC3300','EC4200']),
('economia','EC2011','Microeconomía Avanzada',3,8,ARRAY['EC2201','EC3300','EC4200'])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- MEDICINA
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) VALUES
-- I CICLO
('medicina','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('medicina','QU0114','Química General Intensiva',4,1,'{}'),
('medicina','QU0115','Lab. Química General Intensiva',1,1,'{}'),
('medicina','EG-','Curso de Arte',2,1,'{}'),
('medicina','EF-','Actividad Deportiva',0,1,'{}'),
('medicina','MA1210','Cálculo I',3,1,'{}'),
('medicina','LM1030','Estrategias de Lectura en Inglés I',4,1,'{}'),
('medicina','HA1009','Historia de la Medicina',2,1,'{}'),
-- II CICLO
('medicina','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('medicina','FS0208','Física para Ciencias Médicas',3,2,ARRAY['MA1210||MA1001']),
('medicina','FS0204','Lab. Física para Ciencias Médicas',1,2,'{}'),
('medicina','QU0210','Fundamentos de Química Orgánica',4,2,ARRAY['QU0114','QU0115']),
('medicina','QU0211','Lab. Fundamentos de Química Orgánica',1,2,ARRAY['QU0114','QU0115']),
('medicina','B0106','Biología General',3,2,'{}'),
('medicina','B0107','Lab. Biología General',1,2,'{}'),
-- III CICLO
('medicina','ME0410','Fundamentos de Psiquiatría',2,3,ARRAY['B0106','B0107']),
('medicina','ME0411','Histología',5,3,ARRAY['QU0210','QU0211']),
('medicina','ME0412','Anatomía Descriptiva',5,3,ARRAY['B0106','B0107','FS0204','FS0208','LM1030']),
('medicina','ME0421','Embriología',2,3,ARRAY['B0106','B0107']),
('medicina','ME0117','Bioquímica para Medicina',6,3,ARRAY['LM1030','QU0210']),
('medicina','ME0113','Lab. Bioquímica para Medicina',2,3,ARRAY['LM1030','QU0210','QU0211']),
('medicina','SR-I','Seminario de Realidad Nacional I',2,3,ARRAY['EG-II']),
-- IV CICLO
('medicina','ME2012','Fisiología',10,4,ARRAY['ME0411','ME0412','ME0421','ME0113','ME0117']),
('medicina','ME0422','Neuroanatomía',3,4,ARRAY['ME0421','ME0113','ME0117']),
('medicina','SR-II','Seminario de Realidad Nacional II',2,4,ARRAY['SR-I']),
('medicina','RP-','Repertorio',3,4,'{}'),
('medicina','ME0414','Anatomía Topográfica Radiológica y Quirúrgica',5,4,ARRAY['ME0411','ME0412','ME0421','ME0113','ME0117']),
('medicina','OPT-MED1','Optativo Bloque I',1,4,'{}'),
-- V CICLO
('medicina','F0008','Seminario Ética, Medicina y Sociedad',0,5,ARRAY['ME2012','ME0414']),
('medicina','XS0215','Estadística para Biociencias',4,5,ARRAY['MA1210||MA1001']),
('medicina','ME0109','Patología Humana I',5,5,ARRAY['ME2012','ME0414','ME0422']),
('medicina','ME3103','Fisiopatología y Semiología',10,5,ARRAY['ME2012','ME0414','ME0422']),
('medicina','ME0104','Enfermedades Infecciosas I',4,5,ARRAY['ME2012','ME0414']),
-- VI CICLO
('medicina','ME0108','Patología Humana II',5,6,ARRAY['ME0109','ME3103','ME0104']),
('medicina','ME3005','Medicina Interna I',10,6,ARRAY['ME0109','ME0104','ME3103']),
('medicina','ME0107','Enfermedades Infecciosas II',4,6,ARRAY['ME0104','ME0109','ME3103']),
('medicina','ME2200','Propedéutica Psiquiátrica',2,6,ARRAY['ME0410','ME2012','ME0422']),
-- VII CICLO
('medicina','ME0313','Medicina Integral y Comunitaria I',2,7,ARRAY['ME3005','ME0107']),
('medicina','ME0306','Farmacología Básica I',3,7,ARRAY['ME0108','ME3005','ME0107']),
('medicina','ME4012','Obstetricia',6,7,ARRAY['ME0108','ME3005','ME0107']),
('medicina','ME4013','Ginecología',6,7,ARRAY['ME0108','ME3005','ME0107']),
('medicina','ME4014','Medicina Legal',4,7,ARRAY['ME0108','ME3005','ME0107']),
-- VIII CICLO
('medicina','ME1007','Introducción a la Investigación en Medicina',2,8,ARRAY['XS0215']),
('medicina','ME0310','Farmacología Básica II',3,8,ARRAY['ME0306']),
('medicina','ME4015','Pediatría',10,8,ARRAY['ME0108','ME3005','ME0107']),
('medicina','ME4016','Psiquiatría',4,8,ARRAY['ME2200','ME3005','ME0107','ME0108']),
('medicina','ME1009','Genética Médica',2,8,ARRAY['ME3005','ME0108','ME0107']),
-- IX CICLO
('medicina','ME0314','Medicina Integral y Comunitaria II',2,9,ARRAY['ME0313','ME0310','ME1007']),
('medicina','ME0315','Geriatría y Gerontología I',2,9,ARRAY['ME0310','ME4013']),
('medicina','ME5000','Medicina Interna II',10,9,ARRAY['ME0310','ME4012','ME4013','ME4015']),
('medicina','ME0308','Farmacología Clínica I',2,9,ARRAY['ME0310','ME4012','ME4013','ME4015']),
('medicina','ME0420','Toxicología Clínica',2,9,ARRAY['ME0310','ME4012','ME4013','ME4015']),
-- X CICLO
('medicina','ME0316','Geriatría y Gerontología II',2,10,ARRAY['ME0315','ME5000']),
('medicina','ME5001','Cirugía',10,10,ARRAY['ME5000']),
('medicina','ME0311','Radiología',2,10,ARRAY['ME4012','ME4013','ME4015']),
('medicina','ME0309','Farmacología Clínica II',2,10,ARRAY['ME0308']),
('medicina','OPT-MED2','Optativo Bloque II',1,10,'{}'),
-- XI CICLO (Internados)
('medicina','ME6001','Internado de Cirugía',10,11,ARRAY['ME5001']),
('medicina','ME6002','Internado de Pediatría',10,11,ARRAY['ME5001']),
('medicina','ME6003','Internado Gineco-Obstetricia',10,11,ARRAY['ME5001']),
-- XII CICLO
('medicina','ME6004','Internado de Medicina Interna',10,12,ARRAY['ME5001']),
('medicina','ME6005','Salud Comunitaria y Familiar',8,12,ARRAY['ME5001'])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;

-- ============================================================
-- MICROBIOLOGÍA Y QUÍMICA CLÍNICA
-- ============================================================
INSERT INTO public.courses_catalog (carrera_id, codigo, nombre, creditos, nivel, requisitos) VALUES
-- I CICLO
('microbiologia','B0103','Biología General',3,1,'{}'),
('microbiologia','B0104','Laboratorio de Biología General',1,1,ARRAY['B0103']),
('microbiologia','EG-I','Curso Integrado de Humanidades I',6,1,'{}'),
('microbiologia','MA1001','Cálculo I',4,1,'{}'),
('microbiologia','QU0100','Química General I',3,1,'{}'),
('microbiologia','QU0101','Laboratorio de Química General I',1,1,ARRAY['QU0100']),
-- II CICLO
('microbiologia','B0105','Laboratorio de Biología Sistemática',1,2,ARRAY['B0103','B0104']),
('microbiologia','EG-II','Curso Integrado de Humanidades II',6,2,ARRAY['EG-I']),
('microbiologia','FS0210','Física para Ciencias de la Vida I',3,2,ARRAY['MA1001']),
('microbiologia','FS0211','Lab. Física para Ciencias de la Vida I',1,2,ARRAY['MA1001','FS0210']),
('microbiologia','QU0102','Química General II',3,2,ARRAY['QU0100']),
('microbiologia','QU0103','Laboratorio de Química General II',1,2,ARRAY['QU0101','QU0102']),
-- III CICLO
('microbiologia','FS0310','Física para Ciencias de la Vida II',3,3,ARRAY['FS0210']),
('microbiologia','FS0311','Lab. Física para Ciencias de la Vida II',1,3,ARRAY['FS0211','FS0310']),
('microbiologia','QU0200','Química Orgánica I',3,3,ARRAY['QU0102']),
('microbiologia','QU0201','Laboratorio de Química Orgánica I',1,3,ARRAY['QU0103','QU0200']),
('microbiologia','QU0250','Química Analítica Cuantitativa',3,3,ARRAY['QU0102']),
('microbiologia','QU0251','Lab. Química Analítica Cuantitativa',1,3,ARRAY['QU0103','QU0250']),
('microbiologia','SR-I','Seminario de Realidad Nacional I',2,3,ARRAY['EG-II']),
-- IV CICLO
('microbiologia','MQ0201','Anatomía y Fisiología Humanas I',4,4,ARRAY['B0105','QU0200']),
('microbiologia','QU0202','Química Orgánica II',3,4,ARRAY['QU0200']),
('microbiologia','QU0203','Laboratorio de Química Orgánica II',1,4,ARRAY['QU0201','QU0202']),
('microbiologia','QU0252','Análisis Instrumental',3,4,ARRAY['QU0250']),
('microbiologia','QU0253','Laboratorio de Análisis Instrumental',1,4,ARRAY['QU0251','QU0252']),
('microbiologia','SR-II','Seminario de Realidad Nacional II',2,4,ARRAY['SR-I']),
('microbiologia','RP-','Repertorio',3,4,'{}'),
-- V CICLO
('microbiologia','BC0210','Bioquímica para Microbiología',4,5,ARRAY['QU0202']),
('microbiologia','MQ0301','Anatomía y Fisiología Humanas II',4,5,ARRAY['MQ0201']),
('microbiologia','MQ0314','Parasitología General',4,5,ARRAY['B0105']),
('microbiologia','MQ0318','Micología',3,5,ARRAY['B0105']),
('microbiologia','MQ0319','Histología Humana',3,5,ARRAY['MQ0201']),
-- VI CICLO
('microbiologia','EF-','Actividad Deportiva',0,6,'{}'),
('microbiologia','MQ0414','Microbiología General',5,6,ARRAY['BC0210','MQ0314','MQ0318']),
('microbiologia','MQ0415','Inmunología General',4,6,ARRAY['BC0210','MQ0319']),
('microbiologia','MQ0416','Virología General',3,6,ARRAY['BC0210','MQ0319']),
('microbiologia','MQ0417','Genética Bacteriana',3,6,ARRAY['BC0210']),
-- VII CICLO
('microbiologia','MQ0511','Hematología I',4,7,ARRAY['MQ0415','MQ0414']),
('microbiologia','MQ0513','Bacteriología Médica I',4,7,ARRAY['MQ0414','MQ0415']),
('microbiologia','MQ0515','Inmunología Clínica',4,7,ARRAY['MQ0415']),
('microbiologia','MQ0517','Protozoología Médica',4,7,ARRAY['MQ0414','MQ0415']),
-- VIII CICLO
('microbiologia','MQ0512','Hematología II',4,8,ARRAY['MQ0511']),
('microbiologia','MQ0514','Bacteriología Médica II',4,8,ARRAY['MQ0513']),
('microbiologia','MQ0516','Química Clínica I',4,8,ARRAY['MQ0414','MQ0415']),
('microbiologia','MQ0518','Helmintología Médica',4,8,ARRAY['MQ0517']),
-- IX CICLO
('microbiologia','MQ0611','Banco de Sangre',3,9,ARRAY['MQ0512','MQ0515']),
('microbiologia','MQ0613','Química Clínica II',4,9,ARRAY['MQ0516']),
('microbiologia','MQ0614','Endocrinología Clínica',3,9,ARRAY['MQ0516']),
('microbiologia','MQ0615','Situación de Salud Nacional',3,9,ARRAY['MQ0513','MQ0517']),
('microbiologia','MQ0616','Virología Clínica',3,9,ARRAY['MQ0416','MQ0513','MQ0515']),
('microbiologia','MQ0617','Gestión de la Calidad',3,9,ARRAY['MQ0513','MQ0516','MQ0517']),
-- X CICLO
('microbiologia','MQ0612','Administración de Laboratorios',3,10,ARRAY['MQ0617']),
('microbiologia','MQ0618','Métodos de Investigación',3,10,ARRAY['MQ0615']),
('microbiologia','MQ0619','Toxicología y Análisis de Drogas',3,10,ARRAY['MQ0613']),
('microbiologia','MQ0620','Microbiología de Alimentos y Aguas',4,10,ARRAY['MQ0514','MQ0613']),
('microbiologia','MQ0621','Ética y Deontología',2,10,'{}'),
-- XI CICLO (Internado Clínico)
('microbiologia','MQ0701','Internado Clínico',15,11,ARRAY['MQ0612','MQ0618','MQ0619','MQ0620','MQ0621','MQ0611','MQ0614','MQ0616'])
ON CONFLICT (carrera_id, codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  creditos = EXCLUDED.creditos,
  nivel = EXCLUDED.nivel,
  requisitos = EXCLUDED.requisitos;
