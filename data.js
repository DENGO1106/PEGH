// ===================================
// ESTRUCTURA DE DATOS - PLANES DE ESTUDIO
// ===================================

const CARRERAS = {
  ingenieriaIndustrial: {
    nombre: "Ingeniería Industrial",
    codigo: "II",
    descripcion: "Resolución VD-13491-2025 - Escuela de Ingeniería Industrial",
    cursos: [
      // ============ I CICLO ============
      { codigo: "EG-I", nombre: "Curso Integrado de Humanidades I", creditos: 6, nivel: 1, requisitos: [], estado: 0 },
      { codigo: "EG-", nombre: "Curso de Arte", creditos: 2, nivel: 1, requisitos: [], estado: 0 },
      { codigo: "EF-", nombre: "Actividad Deportiva", creditos: 0, nivel: 1, requisitos: [], estado: 0 },
      { codigo: "MA0001", nombre: "Pre-Cálculo", creditos: 0, nivel: 1, requisitos: [], estado: 0 },
      { codigo: "MA1004", nombre: "Álgebra Lineal", creditos: 3, nivel: 1, requisitos: [], estado: 0 },
      { codigo: "QU0114", nombre: "Química General Intensiva", creditos: 4, nivel: 1, requisitos: [], estado: 0 },
      { codigo: "QU0115", nombre: "Lab. Química General Intensiva", creditos: 1, nivel: 1, requisitos: [], estado: 0 },
      { codigo: "II1118", nombre: "Introducción a la Ingeniería Industrial", creditos: 2, nivel: 1, requisitos: [], estado: 0 },

      // ============ II CICLO ============
      { codigo: "EG-II", nombre: "Curso Integrado de Humanidades II", creditos: 6, nivel: 2, requisitos: ["EG-I"], estado: 0 },
      { codigo: "MA1001", nombre: "Cálculo I", creditos: 3, nivel: 2, requisitos: ["MA0001"], estado: 0 },
      { codigo: "II1119", nombre: "Fundamentos para Tecnologías Digitales", creditos: 4, nivel: 2, requisitos: ["II1118"], estado: 0 },
      { codigo: "II1121", nombre: "Gestión de la Ingeniería", creditos: 2, nivel: 2, requisitos: ["II1118"], estado: 0 },
      { codigo: "II1120", nombre: "Estadística para Ingeniería Industrial I", creditos: 3, nivel: 2, requisitos: ["II1118"], estado: 0 },

      // ============ III CICLO ============
      { codigo: "FS0210", nombre: "Física General I", creditos: 3, nivel: 3, requisitos: ["MA1001"], estado: 0 },
      { codigo: "FS0211", nombre: "Lab. Física General I", creditos: 1, nivel: 3, requisitos: ["MA1001"], estado: 0 },
      { codigo: "MA1002", nombre: "Cálculo II", creditos: 4, nivel: 3, requisitos: ["MA1001"], estado: 0 },
      { codigo: "II1122", nombre: "Modelos de Optimización Industrial", creditos: 3, nivel: 3, requisitos: ["MA1004", "II1119"], estado: 0 },
      { codigo: "II1124", nombre: "Ingeniería Económica Industrial I", creditos: 3, nivel: 3, requisitos: ["II1118"], estado: 0 },
      { codigo: "II1123", nombre: "Estadística para Ingeniería Industrial II", creditos: 4, nivel: 3, requisitos: ["MA1001", "II1120"], estado: 0 },

      // ============ IV CICLO ============
      { codigo: "LM1618", nombre: "Inglés para Ingeniería Industrial I", creditos: 0, nivel: 4, requisitos: [], estado: 0 },
      { codigo: "SR-I", nombre: "Seminario Realidad Nacional I", creditos: 2, nivel: 4, requisitos: ["EG-II"], estado: 0 },
      { codigo: "FS0310", nombre: "Física General II", creditos: 3, nivel: 4, requisitos: ["FS0210", "MA1002"], estado: 0 },
      { codigo: "FS0311", nombre: "Lab. Física General II", creditos: 1, nivel: 4, requisitos: ["FS0210", "MA1002"], estado: 0 },
      { codigo: "MA1003", nombre: "Cálculo III", creditos: 4, nivel: 4, requisitos: ["MA1002"], estado: 0 },
      { codigo: "II1126", nombre: "Modelos Estocásticos y Heurísticos para la Industria", creditos: 3, nivel: 4, requisitos: ["II1123"], estado: 0 },
      { codigo: "II1127", nombre: "Ingeniería Económica Industrial II", creditos: 3, nivel: 4, requisitos: ["II1124"], estado: 0 },
      { codigo: "II1125", nombre: "Estadística para Ingeniería Industrial III", creditos: 3, nivel: 4, requisitos: ["II1123"], estado: 0 },

      // ============ V CICLO ============
      { codigo: "LM1619", nombre: "Inglés para Ingeniería Industrial II", creditos: 0, nivel: 5, requisitos: ["LM1618"], estado: 0 },
      { codigo: "IM0101", nombre: "Gráfica", creditos: 3, nivel: 5, requisitos: ["MA1002"], estado: 0 },
      { codigo: "IM-", nombre: "Curso en construcción (Mecánica)", creditos: 3, nivel: 5, requisitos: ["FS0210"], estado: 0 },
      { codigo: "MA1005", nombre: "Ecuaciones Diferenciales", creditos: 4, nivel: 5, requisitos: ["MA1003"], estado: 0 },
      { codigo: "II1128", nombre: "Simulación y Sistemas Dinámicos", creditos: 3, nivel: 5, requisitos: ["II1126"], estado: 0 },
      { codigo: "II1130", nombre: "Ingeniería de la Sostenibilidad I", creditos: 2, nivel: 5, requisitos: ["II1127"], estado: 0 },
      { codigo: "II1129", nombre: "Ingeniería de la Información", creditos: 3, nivel: 5, requisitos: ["II1119"], estado: 0 },

      // ============ VI CICLO ============
      { codigo: "SR-II", nombre: "Seminario Realidad Nacional II", creditos: 2, nivel: 6, requisitos: ["SR-I"], estado: 0 },
      { codigo: "II1133", nombre: "Gestión de Proyectos", creditos: 3, nivel: 6, requisitos: ["II1121", "II1122"], estado: 0 },
      { codigo: "II1134", nombre: "Metrología Industrial", creditos: 3, nivel: 6, requisitos: ["II1125"], estado: 0 },
      { codigo: "II1131", nombre: "Ergonomía y Factores Humanos, Seguridad y Salud en el Trabajo", creditos: 4, nivel: 6, requisitos: ["II1126"], estado: 0 },
      { codigo: "II1132", nombre: "Diseño y Medición del Trabajo", creditos: 3, nivel: 6, requisitos: ["II1126"], estado: 0 },
      { codigo: "II1135", nombre: "Analítica Industrial", creditos: 3, nivel: 6, requisitos: ["II1125", "II1128"], estado: 0 },

      // ============ VII CICLO ============
      { codigo: "II1139", nombre: "Ingeniería Confiabilidad", creditos: 3, nivel: 7, requisitos: ["II1134"], estado: 0 },
      { codigo: "II1140", nombre: "Desarrollo de Producto y Servicio", creditos: 3, nivel: 7, requisitos: ["II1127", "II1133"], estado: 0 },
      { codigo: "II1141", nombre: "Ingeniería de Sostenibilidad II", creditos: 2, nivel: 7, requisitos: ["II1130"], estado: 0 },
      { codigo: "II1137", nombre: "Fundamentos para Manufactura", creditos: 4, nivel: 7, requisitos: ["FS0310"], estado: 0 },
      { codigo: "II1138", nombre: "Ingeniería de Servicios", creditos: 3, nivel: 7, requisitos: ["II1135"], estado: 0 },
      { codigo: "II1136", nombre: "Ingeniería de la Cadena de Suministro I", creditos: 3, nivel: 7, requisitos: ["II1135"], estado: 0 },

      // ============ VIII CICLO ============
      { codigo: "LM1620", nombre: "Inglés para Ingeniería Industrial III", creditos: 3, nivel: 8, requisitos: ["LM1619"], estado: 0 },
      { codigo: "II1145", nombre: "Ingeniería de Calidad y Mejora Continua", creditos: 4, nivel: 8, requisitos: ["II1139"], estado: 0 },
      { codigo: "II1144", nombre: "Sistemas de Manufactura", creditos: 4, nivel: 8, requisitos: ["II1137"], estado: 0 },
      { codigo: "II1143", nombre: "Ingeniería de Operaciones", creditos: 4, nivel: 8, requisitos: ["II1136"], estado: 0 },
      { codigo: "II1142", nombre: "Ingeniería de la Cadena de Suministro II", creditos: 3, nivel: 8, requisitos: ["II1136"], estado: 0 },

      // ============ IX CICLO ============
      { codigo: "II1148", nombre: "Gerencia y Sistemas de Gestión Integrados", creditos: 3, nivel: 9, requisitos: ["II1121"], estado: 0 },
      { codigo: "II1150", nombre: "Taller de Investigación en Ingeniería", creditos: 2, nivel: 9, requisitos: ["II1142", "II1143", "II1144", "II1145", "LM1620"], estado: 0 },
      { codigo: "II1149", nombre: "Gestión de la Estrategia Industrial", creditos: 3, nivel: 9, requisitos: ["II1121"], estado: 0 },
      { codigo: "II1147", nombre: "Ingeniería de Instalaciones y de Energía", creditos: 5, nivel: 9, requisitos: ["II1144", "II1143"], estado: 0 },
      { codigo: "II1146", nombre: "Ingeniería de la Cadena de Suministro III", creditos: 4, nivel: 9, requisitos: ["II1142"], estado: 0 },

      // ============ X CICLO ============
      { codigo: "LM1621", nombre: "Inglés para Ingeniería Industrial IV", creditos: 3, nivel: 10, requisitos: ["LM1620"], estado: 0 },
      { codigo: "RP-", nombre: "Repertorio", creditos: 3, nivel: 10, requisitos: [], estado: 0 },
      { codigo: "II9500", nombre: "Investigación Dirigida I", creditos: 0, nivel: 10, requisitos: ["II1150"], estado: 0 },
      { codigo: "II-OPT1", nombre: "Bloque Optativo I", creditos: 2, nivel: 10, requisitos: [], estado: 0 },
      { codigo: "II-OPT2", nombre: "Bloque Optativo II", creditos: 2, nivel: 10, requisitos: [], estado: 0 },
      { codigo: "II-OPT3", nombre: "Bloque Optativo III", creditos: 2, nivel: 10, requisitos: [], estado: 0 }
    ]
  },

  contaduriaPublica: {
    nombre: "Contaduría Pública",
    codigo: "CP",
    descripcion: "Escuela de Administración - Universidad de Costa Rica",
    cursos: [

      // ============ I CICLO ============
      { codigo: "EG-I",    nombre: "Curso Integrado de Humanidades I",                            creditos: 6, nivel: 1,  requisitos: [],                                      estado: 0 },
      { codigo: "EG-",     nombre: "Curso de Arte",                                               creditos: 2, nivel: 1,  requisitos: [],                                      estado: 0 },
      { codigo: "RP-",     nombre: "Repertorio",                                                  creditos: 3, nivel: 1,  requisitos: [],                                      estado: 0 },
      { codigo: "DN-0101", nombre: "Introducción a la Administración de Negocios",                creditos: 3, nivel: 1,  requisitos: [],                                      estado: 0 },
      { codigo: "MA0001",  nombre: "Pre-Cálculo",                                                 creditos: 0, nivel: 1,  requisitos: [],                                      estado: 0 },
      { codigo: "DN-0102", nombre: "Aplicaciones Ofimáticas para la Toma de Decisiones",         creditos: 3, nivel: 1,  requisitos: [],                                      estado: 0 },

      // ============ II CICLO ============
      { codigo: "EG-II",   nombre: "Curso Integrado de Humanidades II",                          creditos: 6, nivel: 2,  requisitos: ["EG-I"],                                estado: 0 },
      { codigo: "EF-",     nombre: "Actividad Deportiva",                                        creditos: 0, nivel: 2,  requisitos: [],                                      estado: 0 },
      { codigo: "DN-0104", nombre: "Elementos Fundamentales de Legislación Empresarial",         creditos: 3, nivel: 2,  requisitos: ["DN-0101"],                             estado: 0 },
      { codigo: "DN-0103", nombre: "Administración de Proyectos y Herramientas para el Análisis de Datos", creditos: 3, nivel: 2, requisitos: ["DN-0102"],               estado: 0 },
      { codigo: "MA-1021", nombre: "Cálculo para Ciencias Económicas",                           creditos: 4, nivel: 2,  requisitos: ["MA0001"],                             estado: 0 },

      // ============ III CICLO ============
      { codigo: "PC-0200", nombre: "Contabilidad Básica",                                        creditos: 4, nivel: 3,  requisitos: ["DN-0101"],                             estado: 0 },
      { codigo: "PC-0240", nombre: "Matemática Financiera",                                      creditos: 3, nivel: 3,  requisitos: ["MA-1021", "DN-0103"],                  estado: 0 },
      { codigo: "PC-0261", nombre: "Legislación Comercial, Bancaria y Financiera",               creditos: 3, nivel: 3,  requisitos: ["DN-0104"],                             estado: 0 },
      { codigo: "XS-0276", nombre: "Estadística General I",                                      creditos: 4, nivel: 3,  requisitos: ["MA-1021"],                             estado: 0 },
      { codigo: "MA-1022", nombre: "Cálculo para Ciencias Económicas II",                        creditos: 4, nivel: 3,  requisitos: ["MA-1021"],                             estado: 0 },
      { codigo: "OPT-ING", nombre: "Opcional I (Inglés)",                                        creditos: 0, nivel: 3,  requisitos: ["DN-0101"],                             estado: 0 },

      // ============ IV CICLO ============
      { codigo: "SR-I",    nombre: "Seminario de Realidad Nacional I",                           creditos: 2, nivel: 4,  requisitos: ["EG-II"],                               estado: 0 },
      { codigo: "PC-0260", nombre: "Legislación Laboral",                                        creditos: 3, nivel: 4,  requisitos: ["PC-0261"],                             estado: 0 },
      { codigo: "PC-0202", nombre: "Contabilidad Intermedia I",                                  creditos: 3, nivel: 4,  requisitos: ["PC-0200"],                             estado: 0 },
      { codigo: "DN-0123", nombre: "Metodología de la Investigación",                            creditos: 3, nivel: 4,  requisitos: ["XS-0276"],                             estado: 0 },
      { codigo: "XS-0277", nombre: "Estadística General II",                                     creditos: 4, nivel: 4,  requisitos: ["XS-0276", "MA-1022"],                  estado: 0 },
      { codigo: "DN-0340", nombre: "Administración Financiera I",                                creditos: 3, nivel: 4,  requisitos: ["PC-0240", "PC-0200"],                  estado: 0 },

      // ============ V CICLO ============
      { codigo: "SR-II",   nombre: "Seminario de Realidad Nacional II",                          creditos: 2, nivel: 5,  requisitos: ["SR-I"],                                estado: 0 },
      { codigo: "PC-0304", nombre: "Contabilidad Intermedia II",                                 creditos: 3, nivel: 5,  requisitos: ["PC-0240", "PC-0202"],                  estado: 0 },
      { codigo: "PC-0320", nombre: "Auditoría Financiera I",                                     creditos: 3, nivel: 5,  requisitos: ["PC-0202", "XS-0276"],                  estado: 0 },
      { codigo: "PC-0241", nombre: "Negocios y Entorno Económico",                               creditos: 3, nivel: 5,  requisitos: ["PC-0261"],                             estado: 0 },
      { codigo: "PC-0212", nombre: "Gerencia y Liderazgo para Contadores",                       creditos: 3, nivel: 5,  requisitos: ["DN-0101"],                             estado: 0 },
      { codigo: "DN-0341", nombre: "Administración Financiera II",                               creditos: 3, nivel: 5,  requisitos: ["DN-0340", "XS-0277"],                  estado: 0 },

      // ============ VI CICLO ============
      { codigo: "PC-0305", nombre: "Contabilizaciones Especiales",                               creditos: 3, nivel: 6,  requisitos: ["PC-0304"],                             estado: 0 },
      { codigo: "PC-0321", nombre: "Auditoría Financiera II",                                    creditos: 3, nivel: 6,  requisitos: ["PC-0320"],                             estado: 0 },
      { codigo: "PC-0211", nombre: "Muestreo Aplicado a la Auditoría",                           creditos: 3, nivel: 6,  requisitos: ["XS-0277", "PC-0320"],                  estado: 0 },
      { codigo: "DN-0105", nombre: "Métodos Cuantitativos para la Toma de Decisiones I",         creditos: 3, nivel: 6,  requisitos: ["DN-0340", "XS-0277", "DN-0341", "DN-0320"], estado: 0 },
      { codigo: "DN-0320", nombre: "Principios de Mercadeo",                                     creditos: 3, nivel: 6,  requisitos: ["PC-0200", "XS-0276"],                  estado: 0 },
      { codigo: "PC-0242", nombre: "Entorno, Gestión y Control",                                 creditos: 3, nivel: 6,  requisitos: ["PC-0241"],                             estado: 0 },

      // ============ VII CICLO ============
      { codigo: "PC-0407", nombre: "Contabilidad Avanzada I",                                    creditos: 3, nivel: 7,  requisitos: ["PC-0305"],                             estado: 0 },
      { codigo: "PC-0204", nombre: "Laboratorio de Contabilidad",                                creditos: 3, nivel: 7,  requisitos: ["PC-0305"],                             estado: 0 },
      { codigo: "PC-0421", nombre: "Auditoría Financiera III",                                   creditos: 3, nivel: 7,  requisitos: ["PC-0321"],                             estado: 0 },
      { codigo: "PC-0462", nombre: "Legislación Tributaria y Aduanera",                          creditos: 3, nivel: 7,  requisitos: ["PC-0304", "PC-0260"],                  estado: 0 },
      { codigo: "PC-0306", nombre: "Sistemas de Costeo Básico",                                  creditos: 3, nivel: 7,  requisitos: ["PC-0304"],                             estado: 0 },
      { codigo: "PC-0344", nombre: "Formulación y Evaluación de Proyectos I",                    creditos: 3, nivel: 7,  requisitos: ["DN-0341", "DN-0110"],                  estado: 0 },

      // ============ VIII CICLO ============
      { codigo: "PC-0409", nombre: "Sistemas de Costeo Gerencial",                               creditos: 3, nivel: 8,  requisitos: ["PC-0306"],                             estado: 0 },
      { codigo: "PC-0410", nombre: "Contabilidad Avanzada II",                                   creditos: 3, nivel: 8,  requisitos: ["PC-0407"],                             estado: 0 },
      { codigo: "PC-0205", nombre: "Contabilidad Gubernamental",                                 creditos: 3, nivel: 8,  requisitos: ["PC-0407"],                             estado: 0 },
      { codigo: "PC-0531", nombre: "Auditoría Financiera IV",                                    creditos: 3, nivel: 8,  requisitos: ["PC-0421"],                             estado: 0 },
      { codigo: "DN-0110", nombre: "Métodos Cuantitativos para la Toma de Decisiones II",        creditos: 3, nivel: 8,  requisitos: ["DN-0105", "PC-0344"],                  estado: 0 },
      { codigo: "DN-0525", nombre: "Mercadeo de Servicios",                                      creditos: 3, nivel: 8,  requisitos: ["DN-0320"],                             estado: 0 },

      // ============ IX CICLO (LICENCIATURA) ============
      { codigo: "PC-0423", nombre: "Auditoría Informática I",                                    creditos: 3, nivel: 9,  requisitos: ["PC-0531"],                             estado: 0 },
      { codigo: "PC-0424", nombre: "Laboratorio de Auditoría Informática I",                     creditos: 1, nivel: 9,  requisitos: ["PC-0531"],                             estado: 0 },
      { codigo: "PC-0425", nombre: "Control Interno y Auditorías Especiales",                    creditos: 3, nivel: 9,  requisitos: ["PC-0531"],                             estado: 0 },
      { codigo: "PC-0528", nombre: "Auditoría de Gestión I",                                     creditos: 4, nivel: 9,  requisitos: ["PC-0531"],                             estado: 0 },
      { codigo: "OPT-2",   nombre: "Inteligencia Emocional en el Trabajo",                       creditos: 3, nivel: 9,  requisitos: ["DN-0104"],                             estado: 0 },
      { codigo: "DN-0114", nombre: "Comunicación Intercultural de los Negocios",                 creditos: 3, nivel: 9,  requisitos: ["PC-0409"],                             estado: 0 },

      // ============ X CICLO ============
      { codigo: "PC-0526", nombre: "Auditoría Informática II",                                   creditos: 3, nivel: 10, requisitos: ["PC-0423", "PC-0424"],                  estado: 0 },
      { codigo: "PC-0527", nombre: "Laboratorio de Auditoría Informática II",                    creditos: 1, nivel: 10, requisitos: ["PC-0423", "PC-0424"],                  estado: 0 },
      { codigo: "PC-0529", nombre: "Auditoría de Gestión II",                                    creditos: 4, nivel: 10, requisitos: ["PC-0528"],                             estado: 0 },
      { codigo: "OPT-3",   nombre: "Valoraciones, Fusiones y Adquisiciones de Empresas",         creditos: 3, nivel: 10, requisitos: ["DN-0104"],                             estado: 0 },
      { codigo: "DN-0115", nombre: "Taller de Investigación",                                    creditos: 3, nivel: 10, requisitos: ["DN-0114"],                             estado: 0 },
      { codigo: "PC-0210", nombre: "Auditoría Interna",                                          creditos: 3, nivel: 10, requisitos: ["PC-0425"],                             estado: 0 }
    ]
  },

  direccionEmpresas: {
    nombre: "Dirección de Empresas",
    codigo: "DN",
    descripcion: "Escuela de Administración de Negocios - Universidad de Costa Rica",
    cursos: [
      // ============ I CICLO ============
      { codigo: "EG-I", nombre: "Curso Integrado de Humanidades I", creditos: 6, nivel: 1, requisitos: [], estado: 0 },
      { codigo: "EG-", nombre: "Curso de Arte", creditos: 2, nivel: 1, requisitos: [], estado: 0 },
      { codigo: "RP-", nombre: "Repertorio", creditos: 3, nivel: 1, requisitos: [], estado: 0 },
      { codigo: "DN-0101", nombre: "Introducción a la Administración de Negocios", creditos: 3, nivel: 1, requisitos: [], estado: 0 },
      { codigo: "MA0001", nombre: "Pre-Cálculo", creditos: 0, nivel: 1, requisitos: [], estado: 0 },
      { codigo: "XE-0156", nombre: "Introducción a la Economía", creditos: 4, nivel: 1, requisitos: [], estado: 0 },

      // ============ II CICLO ============
      { codigo: "EG-II", nombre: "Curso Integrado de Humanidades II", creditos: 6, nivel: 2, requisitos: ["EG-I"], estado: 0 },
      { codigo: "EF-", nombre: "Actividad Deportiva", creditos: 0, nivel: 2, requisitos: [], estado: 0 },
      { codigo: "DN-0102", nombre: "Aplicaciones Ofimáticas para la Toma de Decisiones", creditos: 3, nivel: 2, requisitos: [], estado: 0 },
      { codigo: "MA-1021", nombre: "Cálculo para Ciencias Económicas I", creditos: 4, nivel: 2, requisitos: ["MA0001"], estado: 0 },
      { codigo: "PC-0200", nombre: "Contabilidad Básica", creditos: 4, nivel: 2, requisitos: ["DN-0101||XE-0156"], estado: 0 },

      // ============ III CICLO ============
      { codigo: "DN-0103", nombre: "Adm. de Proyectos y Herramientas para Toma Dec.", creditos: 3, nivel: 3, requisitos: ["DN-0102"], estado: 0 },
      { codigo: "PC-0240", nombre: "Matemática Financiera", creditos: 3, nivel: 3, requisitos: ["MA-1021"], estado: 0 },
      { codigo: "PC-0202", nombre: "Contabilidad Intermedia I", creditos: 3, nivel: 3, requisitos: ["PC-0200"], estado: 0 },
      { codigo: "MA-1022", nombre: "Cálculo para Ciencias Económicas II", creditos: 4, nivel: 3, requisitos: ["MA-1021"], estado: 0 },
      { codigo: "XS-0276", nombre: "Estadística General I", creditos: 4, nivel: 3, requisitos: ["MA-1021"], estado: 0 },
      { codigo: "OPT-ING", nombre: "Opcional I (Inglés)", creditos: 0, nivel: 3, requisitos: ["DN-0101"], estado: 0 },

      // ============ IV CICLO ============
      { codigo: "XS-0277", nombre: "Estadística General II", creditos: 4, nivel: 4, requisitos: ["XS-0276", "MA-1022"], estado: 0 },
      { codigo: "PC-0304", nombre: "Contabilidad Intermedia II", creditos: 3, nivel: 4, requisitos: ["PC-0202", "PC-0240"], estado: 0 },
      { codigo: "DN-0104", nombre: "Elementos Fundamentales de Legislación Empresarial", creditos: 3, nivel: 4, requisitos: ["DN-0101"], estado: 0 },
      { codigo: "DN-0123", nombre: "Metodología de la Investigación", creditos: 3, nivel: 4, requisitos: ["XS-0276"], estado: 0 },
      { codigo: "DN-0340", nombre: "Administración Financiera I", creditos: 3, nivel: 4, requisitos: ["PC-0240", "PC-0200"], estado: 0 },
      { codigo: "SR-I", nombre: "Seminario de Realidad Nacional I", creditos: 2, nivel: 4, requisitos: ["EG-II"], estado: 0 },

      // ============ V CICLO (SEGÚN IMAGEN) ============
      { codigo: "DN-0105", nombre: "Métodos Cuantitativos para la Toma de Decisiones I", creditos: 3, nivel: 5, requisitos: ["DN-0340", "XS-0277"], estado: 0 },
      { codigo: "DN-0341", nombre: "Administración Financiera II", creditos: 3, nivel: 5, requisitos: ["DN-0340", "XS-0277"], estado: 0 },
      { codigo: "PC-0261", nombre: "Legislación Comercial, Bancaria y Financiera", creditos: 3, nivel: 5, requisitos: ["DN-0104"], estado: 0 },
      { codigo: "DN-0320", nombre: "Principios de Mercadeo", creditos: 3, nivel: 5, requisitos: ["PC-0200", "XS-0276"], estado: 0 },
      { codigo: "DN-0202", nombre: "Principios de Gerencia", creditos: 3, nivel: 5, requisitos: ["DN-0340"], estado: 0 },
      { codigo: "DN-0107", nombre: "Economía y Comercio Internacional", creditos: 3, nivel: 5, requisitos: ["XE-0156", "XS-0276"], estado: 0 },

      // ============ VI CICLO (SEGÚN IMAGEN) ============
      { codigo: "DN-0106", nombre: "Gestión del Talento y Conocimiento Humano", creditos: 3, nivel: 6, requisitos: ["DN-0202"], estado: 0 },
      { codigo: "SR-II", nombre: "Seminario de Realidad Nacional II", creditos: 2, nivel: 6, requisitos: ["SR-I"], estado: 0 },
      { codigo: "DN-0110", nombre: "Métodos Cuantitativos para la Toma de Decisiones II", creditos: 3, nivel: 6, requisitos: ["DN-0105"], estado: 0 },
      { codigo: "PC-0260", nombre: "Legislación Laboral", creditos: 3, nivel: 6, requisitos: ["PC-0261"], estado: 0 },
      { codigo: "DN-0321", nombre: "Publicidad y Promoción", creditos: 3, nivel: 6, requisitos: ["DN-0320"], estado: 0 },
      { codigo: "DN-0442", nombre: "Administración Financiera III", creditos: 3, nivel: 6, requisitos: ["DN-0341"], estado: 0 },

      // ============ VII CICLO (SEGÚN IMAGEN) ============
      { codigo: "DN-0496", nombre: "Gerencia de Operaciones", creditos: 3, nivel: 7, requisitos: ["DN-0110"], estado: 0 },
      { codigo: "DN-0405", nombre: "Emprendimiento y Creación de Empresas", creditos: 3, nivel: 7, requisitos: ["DN-0106"], estado: 0 },
      { codigo: "DN-0423", nombre: "Investigación de Mercados", creditos: 3, nivel: 7, requisitos: ["DN-0321"], estado: 0 },
      { codigo: "DN-0304", nombre: "Liderazgo Gerencial", creditos: 3, nivel: 7, requisitos: ["DN-0106"], estado: 0 },
      { codigo: "PC-0344", nombre: "Formulación y Evaluación de Proyectos I", creditos: 3, nivel: 7, requisitos: ["DN-0341"], estado: 0 },
      { codigo: "PC-0462", nombre: "Legislación Tributaria y Aduanera", creditos: 3, nivel: 7, requisitos: ["PC-0260"], estado: 0 },

      // ============ VIII CICLO (SEGÚN IMAGEN) ============
      { codigo: "DN-0111", nombre: "Gestión de la Innovación y Estrategia Competitiva", creditos: 3, nivel: 8, requisitos: ["DN-0106"], estado: 0 },
      { codigo: "DN-0108", nombre: "Mercados Bursátiles", creditos: 4, nivel: 8, requisitos: ["PC-0344"], estado: 0 },
      { codigo: "DN-0109", nombre: "Principios de Auditoría Financiera", creditos: 3, nivel: 8, requisitos: ["PC-0304", "DN-0442"], estado: 0 },
      { codigo: "DN-0112", nombre: "Gerencia de la Calidad", creditos: 3, nivel: 8, requisitos: ["DN-0496"], estado: 0 },
      { codigo: "DN-0322", nombre: "Ventas y Distribución", creditos: 3, nivel: 8, requisitos: ["DN-0423"], estado: 0 },

      // ============ IX CICLO (LICENCIATURA - SEGÚN IMAGEN) ============
      { codigo: "DN-0507", nombre: "Estrategias y Tácticas de Negociación", creditos: 3, nivel: 9, requisitos: ["DN-0111"], estado: 0 },
      { codigo: "DN-0113", nombre: "Administración Mediada por Tecnologías de la Información", creditos: 3, nivel: 9, requisitos: ["DN-0112"], estado: 0 },
      { codigo: "DN-OPT91", nombre: "Curso Optativo III", creditos: 3, nivel: 9, requisitos: [], estado: 0 },
      { codigo: "DN-OPT92", nombre: "Curso Optativo IV", creditos: 3, nivel: 9, requisitos: [], estado: 0 },
      { codigo: "DN-OPT93", nombre: "Curso Optativo V", creditos: 3, nivel: 9, requisitos: [], estado: 0 },
      { codigo: "DN-OPT94", nombre: "Curso Optativo VI", creditos: 3, nivel: 9, requisitos: [], estado: 0 },

      // ============ X CICLO (LICENCIATURA - SEGÚN IMAGEN) ============
      { codigo: "DN-0114", nombre: "Comunicación Intercultural de los Negocios", creditos: 3, nivel: 10, requisitos: ["DN-0113"], estado: 0 },
      { codigo: "DN-0115", nombre: "Taller de Investigación", creditos: 3, nivel: 10, requisitos: ["DN-0113"], estado: 0 },
      { codigo: "DN-OPTX1", nombre: "Curso Optativo VII", creditos: 3, nivel: 10, requisitos: [], estado: 0 },
      { codigo: "DN-OPTX2", nombre: "Curso Optativo VIII", creditos: 3, nivel: 10, requisitos: [], estado: 0 },
      { codigo: "DN-OPTX3", nombre: "Curso Optativo IX", creditos: 3, nivel: 10, requisitos: [], estado: 0 },
      { codigo: "DN-OPTX4", nombre: "Curso Optativo X", creditos: 3, nivel: 10, requisitos: [], estado: 0 }
    ]
  },

  cienciasActuariales: {
    nombre: "Ciencias Actuariales",
    codigo: "CA",
    descripcion: "Bach. y Lic. en Ciencias Actuariales — Plan 1999 · Escuela de Matemática, UCR (Carrera 210402)",
    cursos: [

      // ============ I CICLO (Bachillerato) ============
      { codigo: "EC1100",  nombre: "Introducción a la Economía",                creditos: 4, nivel: 1,  requisitos: [],                                      estado: 0 },
      { codigo: "EF-",     nombre: "Actividad Deportiva",                       creditos: 0, nivel: 1,  requisitos: [],                                      estado: 0 },
      { codigo: "EG-I",    nombre: "Curso Integrado de Humanidades I",          creditos: 6, nivel: 1,  requisitos: [],                                      estado: 0 },
      { codigo: "MA0001",  nombre: "Pre-Cálculo",                               creditos: 0, nivel: 1,  requisitos: [],                                      estado: 0 },
      { codigo: "MA0150",  nombre: "Principios de Matemática",                  creditos: 4, nivel: 1,  requisitos: ["MA0001"],                              estado: 0 },
      { codigo: "RP-1",    nombre: "Repertorio",                                creditos: 3, nivel: 1,  requisitos: [],                                      estado: 0 },

      // ============ II CICLO ============
      { codigo: "EG-",     nombre: "Curso de Arte",                             creditos: 2, nivel: 2,  requisitos: [],                                      estado: 0 },
      { codigo: "EG-II",   nombre: "Curso Integrado de Humanidades II",         creditos: 6, nivel: 2,  requisitos: ["EG-I"],                                estado: 0 },
      { codigo: "LM1030",  nombre: "Estrategias de Lectura en Inglés I",        creditos: 4, nivel: 2,  requisitos: [],                                      estado: 0 },
      { codigo: "MA0250",  nombre: "Cálculo en una Variable I",                 creditos: 4, nivel: 2,  requisitos: ["MA0150"],                              estado: 0 },

      // ============ III CICLO ============
      { codigo: "CI0112",  nombre: "Programación I",                            creditos: 4, nivel: 3,  requisitos: ["MA0250"],                              estado: 0 },
      { codigo: "EC2100",  nombre: "Teoría Microeconómica 1",                   creditos: 4, nivel: 3,  requisitos: ["EC1100", "MA0250"],                    estado: 0 },
      { codigo: "MA0350",  nombre: "Cálculo en una Variable II",                creditos: 4, nivel: 3,  requisitos: ["MA0250"],                              estado: 0 },
      { codigo: "MA0360",  nombre: "Álgebra Lineal I",                          creditos: 4, nivel: 3,  requisitos: ["MA0250"],                              estado: 0 },
      { codigo: "SR-I",    nombre: "Seminario de Realidad Nacional I",          creditos: 2, nivel: 3,  requisitos: ["EG-II"],                               estado: 0 },

      // ============ IV CICLO ============
      { codigo: "CA0201",  nombre: "Teoría Matemática del Interés",             creditos: 4, nivel: 4,  requisitos: ["MA0350"],                              estado: 0 },
      { codigo: "CA0202",  nombre: "Herramientas de Cómputo Actuarial",         creditos: 4, nivel: 4,  requisitos: ["CI0112", "MA0350"],                    estado: 0 },
      { codigo: "MA0450",  nombre: "Cálculo en Varias Variables",               creditos: 4, nivel: 4,  requisitos: ["MA0350"],                              estado: 0 },
      { codigo: "MA0460",  nombre: "Álgebra Lineal II",                         creditos: 4, nivel: 4,  requisitos: ["MA0360"],                              estado: 0 },
      { codigo: "SR-II",   nombre: "Seminario de Realidad Nacional II",         creditos: 2, nivel: 4,  requisitos: ["SR-I"],                                estado: 0 },

      // ============ V CICLO ============
      { codigo: "CA0408",  nombre: "Análisis de Instrumentos de Inversión",     creditos: 4, nivel: 5,  requisitos: ["CA0201", "CA0202"],                    estado: 0 },
      { codigo: "EC3200",  nombre: "Teoría Macroeconómica I",                   creditos: 4, nivel: 5,  requisitos: ["EC2100", "MA0450"],                    estado: 0 },
      { codigo: "MA0455",  nombre: "Ecuaciones Diferenciales Ordinarias",       creditos: 4, nivel: 5,  requisitos: ["MA0450", "MA0460"],                    estado: 0 },
      { codigo: "MA0720",  nombre: "Probabilidades I",                          creditos: 5, nivel: 5,  requisitos: ["MA0450", "MA0460"],                    estado: 0 },

      // ============ VI CICLO ============
      { codigo: "CA0301",  nombre: "Matemática Actuarial I",                    creditos: 4, nivel: 6,  requisitos: ["MA0455", "MA0720"],                    estado: 0 },
      { codigo: "CA0302",  nombre: "Laboratorio Actuarial I",                   creditos: 2, nivel: 6,  requisitos: ["MA0455", "MA0720"],                    estado: 0 },
      { codigo: "CA0303",  nombre: "Estadística Actuarial I",                   creditos: 4, nivel: 6,  requisitos: ["MA0720"],                              estado: 0 },
      { codigo: "CA0304",  nombre: "Fundamentos de Riesgos y Seguros",          creditos: 4, nivel: 6,  requisitos: ["MA0720"],                              estado: 0 },
      { codigo: "MA0501",  nombre: "Análisis Numérico I",                       creditos: 4, nivel: 6,  requisitos: ["CI0112", "MA0450", "MA0455", "MA0460"], estado: 0 },

      // ============ VII CICLO ============
      { codigo: "CA0401",  nombre: "Matemáticas Actuariales II",                creditos: 4, nivel: 7,  requisitos: ["CA0301", "CA0302"],                    estado: 0 },
      { codigo: "CA0402",  nombre: "Laboratorio Actuarial II",                  creditos: 2, nivel: 7,  requisitos: ["CA0301", "CA0302"],                    estado: 0 },
      { codigo: "CA0403",  nombre: "Estadística Actuarial II",                  creditos: 4, nivel: 7,  requisitos: ["CA0303"],                              estado: 0 },
      { codigo: "CA0406",  nombre: "Procesos Estocásticos y Series Temporales", creditos: 4, nivel: 7,  requisitos: ["MA0455", "MA0720"],                    estado: 0 },
      { codigo: "OPT787",  nombre: "Cursos Optativos",                          creditos: 4, nivel: 7,  requisitos: [],                                      estado: 0 },

      // ============ VIII CICLO ============
      { codigo: "CA0404",  nombre: "Modelos Lineales",                          creditos: 4, nivel: 8,  requisitos: ["MA0455", "MA0720"],                    estado: 0 },
      { codigo: "CA0405",  nombre: "Matemáticas Actuariales III",               creditos: 4, nivel: 8,  requisitos: ["CA0401", "CA0402"],                    estado: 0 },
      { codigo: "CA0407",  nombre: "Práctica Actuarial I",                      creditos: 3, nivel: 8,  requisitos: ["CA0401"],                              estado: 0 },
      { codigo: "CA0409",  nombre: "Distribuciones de Pérdidas",                creditos: 4, nivel: 8,  requisitos: ["CA0406"],                              estado: 0 },
      { codigo: "CA0410",  nombre: "Teoría de Riesgos",                         creditos: 4, nivel: 8,  requisitos: ["CA0406"],                              estado: 0 },

      // ============ IX CICLO (Licenciatura) ============
      { codigo: "CA0501",  nombre: "Regímenes de Pensiones",                    creditos: 4, nivel: 9,  requisitos: ["CA0405"],                              estado: 0 },
      { codigo: "CA0502",  nombre: "Laboratorio Actuarial III",                 creditos: 3, nivel: 9,  requisitos: ["CA0402", "CA0405"],                    estado: 0 },
      { codigo: "CA0503",  nombre: "Modelos de Vida",                           creditos: 4, nivel: 9,  requisitos: ["CA0405"],                              estado: 0 },
      { codigo: "CA0504",  nombre: "Introducción a la Optimización",            creditos: 4, nivel: 9,  requisitos: ["MA0450", "MA0460"],                    estado: 0 },

      // ============ X CICLO ============
      { codigo: "CA0506",  nombre: "Análisis de Datos",                         creditos: 4, nivel: 10, requisitos: ["CA0403"],                              estado: 0 },
      { codigo: "CA0508",  nombre: "Práctica Actuarial II",                     creditos: 4, nivel: 10, requisitos: ["CA0504"],                              estado: 0 },
      { codigo: "CA0509",  nombre: "Teoría de Credibilidad",                    creditos: 4, nivel: 10, requisitos: ["CA0409", "CA0410"],                    estado: 0 },
      { codigo: "CA0510",  nombre: "Análisis de Estados Financieros",           creditos: 4, nivel: 10, requisitos: ["CA0410"],                              estado: 0 },

      // ============ XI CICLO — Trabajo Final de Graduación ============
      { codigo: "MA9500",  nombre: "Investigación Dirigida 1",                  creditos: 0, nivel: 11, requisitos: [],                                      estado: 0 },
      { codigo: "MA9501",  nombre: "Investigación Dirigida 2",                  creditos: 0, nivel: 11, requisitos: ["MA9500"],                              estado: 0 },
      { codigo: "MA9600",  nombre: "Seminario de Graduación 1",                 creditos: 0, nivel: 11, requisitos: [],                                      estado: 0 },
      { codigo: "MA9700",  nombre: "Práctica Dirigida 1",                       creditos: 0, nivel: 11, requisitos: [],                                      estado: 0 }
    ]
  },

  farmacia: {
    nombre: "Farmacia",
    codigo: "FA",
    descripcion: "Licenciatura en Farmacia — Plan 2016 · Facultad de Farmacia, UCR (Carrera 540101)",
    cursos: [

      // ============ I CICLO ============
      { codigo: "EG-",     nombre: "Curso de Arte",                                      creditos: 2, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "EG-I",    nombre: "Curso Integrado de Humanidades I",                   creditos: 6, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "FS0132",  nombre: "Física Aplicada a Farmacia",                         creditos: 3, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "FS0133",  nombre: "Lab. Física Aplicada a Farmacia",                    creditos: 1, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "MA1210",  nombre: "Cálculo I",                                          creditos: 3, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "QU0100",  nombre: "Química General I",                                  creditos: 3, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "QU0101",  nombre: "Lab. Química General I",                             creditos: 1, nivel: 1, requisitos: [],                                      estado: 0 },

      // ============ II CICLO ============
      { codigo: "B0106",   nombre: "Biología General",                                   creditos: 3, nivel: 2, requisitos: [],                                      estado: 0 },
      { codigo: "B0107",   nombre: "Lab. Biología General",                              creditos: 1, nivel: 2, requisitos: [],                                      estado: 0 },
      { codigo: "EF-",     nombre: "Actividad Deportiva",                                creditos: 0, nivel: 2, requisitos: [],                                      estado: 0 },
      { codigo: "EG-II",   nombre: "Curso Integrado de Humanidades II",                  creditos: 6, nivel: 2, requisitos: ["EG-I"],                                estado: 0 },
      { codigo: "MA2210",  nombre: "Ecuaciones Diferenciales Aplicadas",                 creditos: 3, nivel: 2, requisitos: ["MA1210"],                              estado: 0 },
      { codigo: "QU0102",  nombre: "Química General II",                                 creditos: 3, nivel: 2, requisitos: ["QU0100", "QU0101"],                    estado: 0 },
      { codigo: "QU0103",  nombre: "Lab. Química General II",                            creditos: 1, nivel: 2, requisitos: ["QU0100", "QU0101"],                    estado: 0 },

      // ============ III CICLO ============
      { codigo: "FA2009",  nombre: "Introducción a la Farmacia",                         creditos: 3, nivel: 3, requisitos: [],                                      estado: 0 },
      { codigo: "MN0220",  nombre: "Anatomía Macroscópica",                              creditos: 4, nivel: 3, requisitos: ["B0106", "B0107"],                      estado: 0 },
      { codigo: "QU0212",  nombre: "Química Orgánica General I",                         creditos: 4, nivel: 3, requisitos: ["QU0102", "QU0103"],                    estado: 0 },
      { codigo: "QU0213",  nombre: "Lab. Química Orgánica General I",                    creditos: 1, nivel: 3, requisitos: ["QU0102", "QU0103"],                    estado: 0 },
      { codigo: "SR-I",    nombre: "Seminario de Realidad Nacional I",                   creditos: 2, nivel: 3, requisitos: ["EG-II"],                               estado: 0 },
      { codigo: "XS0215",  nombre: "Estadística para Biociencias",                       creditos: 4, nivel: 3, requisitos: ["MA1210"],                              estado: 0 },

      // ============ IV CICLO ============
      { codigo: "FA0217",  nombre: "Metodología de la Investigación Farmacéutica",       creditos: 3, nivel: 4, requisitos: ["FA2009", "XS0215"],                    estado: 0 },
      { codigo: "FA0335",  nombre: "Fisicoquímica Farmacéutica I",                       creditos: 4, nivel: 4, requisitos: ["FS0132", "FS0133", "MA2210", "QU0212", "QU0213", "XS0215"], estado: 0 },
      { codigo: "FA3030",  nombre: "Conferencia General I",                              creditos: 0, nivel: 4, requisitos: [],                                      estado: 0 },
      { codigo: "QU0214",  nombre: "Química Orgánica General II",                        creditos: 4, nivel: 4, requisitos: ["QU0212", "QU0213"],                    estado: 0 },
      { codigo: "QU0215",  nombre: "Lab. Química Orgánica General II",                   creditos: 1, nivel: 4, requisitos: ["QU0212", "QU0213"],                    estado: 0 },
      { codigo: "RP-1",    nombre: "Repertorio",                                         creditos: 3, nivel: 4, requisitos: [],                                      estado: 0 },
      { codigo: "SR-II",   nombre: "Seminario de Realidad Nacional II",                  creditos: 2, nivel: 4, requisitos: ["SR-I"],                                estado: 0 },

      // ============ V CICLO ============
      { codigo: "FA0218",  nombre: "Análisis de Medicamentos I",                         creditos: 5, nivel: 5, requisitos: ["FS0132", "FS0133", "QU0214", "QU0215", "XS0215"], estado: 0 },
      { codigo: "FA0336",  nombre: "Fisicoquímica Farmacéutica II",                      creditos: 4, nivel: 5, requisitos: ["FA0335"],                              estado: 0 },
      { codigo: "FA0337",  nombre: "Elementos de Salud Pública",                         creditos: 2, nivel: 5, requisitos: ["FA0217", "FA3030"],                    estado: 0 },
      { codigo: "MQ0208",  nombre: "Bioquímica para Farmacia",                           creditos: 4, nivel: 5, requisitos: ["B0106", "B0107", "QU0214", "QU0215"],  estado: 0 },
      { codigo: "OPT1043", nombre: "Cursos Optativos del V Ciclo",                       creditos: 2, nivel: 5, requisitos: [],                                      estado: 0 },

      // ============ VI CICLO ============
      { codigo: "FA0219",  nombre: "Elementos de Fisiopatología y Terapeútica",          creditos: 2, nivel: 6, requisitos: ["MN0220"],                              estado: 0 },
      { codigo: "FA0222",  nombre: "Análisis de Medicamentos II",                        creditos: 4, nivel: 6, requisitos: ["FA0218"],                              estado: 0 },
      { codigo: "FA0223",  nombre: "Fundamentos de Inmunología",                         creditos: 3, nivel: 6, requisitos: ["MQ0208"],                              estado: 0 },
      { codigo: "FA0338",  nombre: "Biofarmacia y Farmacocinética",                      creditos: 4, nivel: 6, requisitos: ["FA0336"],                              estado: 0 },
      { codigo: "MF1000",  nombre: "Fisiología Humana",                                  creditos: 6, nivel: 6, requisitos: ["MQ0208"],                              estado: 0 },

      // ============ VII CICLO ============
      { codigo: "F5001",   nombre: "Ética Profesional Farmaceútica",                     creditos: 1, nivel: 7, requisitos: ["FA0337"],                              estado: 0 },
      { codigo: "FA0224",  nombre: "Microbiología Clínica y Terapeútica",                creditos: 3, nivel: 7, requisitos: ["FA0219", "FA0223", "MF1000"],          estado: 0 },
      { codigo: "FA0225",  nombre: "Farmacología I",                                     creditos: 3, nivel: 7, requisitos: ["FA0223", "FA0338", "MF1000"],          estado: 0 },
      { codigo: "FA0226",  nombre: "Laboratorio de Farmacología I",                      creditos: 1, nivel: 7, requisitos: ["FA0225"],                              estado: 0 },
      { codigo: "FA0227",  nombre: "Análisis de Medicamentos III",                       creditos: 4, nivel: 7, requisitos: ["FA0222"],                              estado: 0 },
      { codigo: "FA0228",  nombre: "Farmacognosia",                                      creditos: 2, nivel: 7, requisitos: ["MQ0208"],                              estado: 0 },
      { codigo: "FA0229",  nombre: "Laboratorio de Farmacognosia",                       creditos: 2, nivel: 7, requisitos: ["FA0217", "FA0228"],                    estado: 0 },
      { codigo: "FA0230",  nombre: "Fundamentos de Biotecnología Farmaceútica",          creditos: 2, nivel: 7, requisitos: ["FA0219", "FA0223", "FA0338"],          estado: 0 },

      // ============ VIII CICLO ============
      { codigo: "FA0231",  nombre: "Farmacología II",                                    creditos: 3, nivel: 8, requisitos: ["FA0219", "FA0224", "FA0225"],          estado: 0 },
      { codigo: "FA0232",  nombre: "Laboratorio de Farmacología II",                     creditos: 1, nivel: 8, requisitos: ["FA0226", "FA0231"],                    estado: 0 },
      { codigo: "FA0233",  nombre: "Tecnología Farmaceútica I",                          creditos: 4, nivel: 8, requisitos: ["FA0227", "FA0338"],                    estado: 0 },
      { codigo: "FA0234",  nombre: "Atención Farmaceútica I",                            creditos: 4, nivel: 8, requisitos: ["F5001", "FA0225"],                     estado: 0 },
      { codigo: "FA0235",  nombre: "Farmacia de Comunidad",                              creditos: 2, nivel: 8, requisitos: ["FA2009", "FA0234"],                    estado: 0 },
      { codigo: "FA0310",  nombre: "Química Medicinal I",                                creditos: 3, nivel: 8, requisitos: ["FA0228", "FA0338"],                    estado: 0 },
      { codigo: "OPT1064", nombre: "Optativos del Ciclo VIII",                           creditos: 2, nivel: 8, requisitos: [],                                      estado: 0 },

      // ============ IX CICLO ============
      { codigo: "FA0215",  nombre: "Gestión de la Innovación en el Área de Salud",       creditos: 2, nivel: 9, requisitos: ["FA0217", "FA2009"],                    estado: 0 },
      { codigo: "FA0236",  nombre: "Química Medicinal II",                               creditos: 3, nivel: 9, requisitos: ["FA0224", "FA0310"],                    estado: 0 },
      { codigo: "FA0237",  nombre: "Farmacología III",                                   creditos: 3, nivel: 9, requisitos: ["FA0223", "FA0225"],                    estado: 0 },
      { codigo: "FA0238",  nombre: "Laboratorio de Farmacología III",                    creditos: 1, nivel: 9, requisitos: ["FA0237"],                              estado: 0 },
      { codigo: "FA0239",  nombre: "Atención Farmaceútica II",                           creditos: 4, nivel: 9, requisitos: ["FA0231", "FA0234"],                    estado: 0 },
      { codigo: "FA0315",  nombre: "Tecnología Farmaceútica II",                         creditos: 4, nivel: 9, requisitos: ["FA0227", "FA0338"],                    estado: 0 },
      { codigo: "OPT1065", nombre: "Optativos del Ciclo IX",                             creditos: 2, nivel: 9, requisitos: [],                                      estado: 0 },

      // ============ X CICLO ============
      { codigo: "FA0316",  nombre: "Administración de Establecimientos Farmaceúticos",   creditos: 2, nivel: 10, requisitos: ["FA0215"],                             estado: 0 },
      { codigo: "FA0317",  nombre: "Farmacia Industrial",                                creditos: 2, nivel: 10, requisitos: ["FA0233", "FA0315"],                   estado: 0 },
      { codigo: "FA0339",  nombre: "Legislación y Deontología Farmacéutica",             creditos: 2, nivel: 10, requisitos: ["F5001", "FA0235", "FA0317"],          estado: 0 },
      { codigo: "FA0341",  nombre: "Farmacia de Hospital",                               creditos: 4, nivel: 10, requisitos: ["FA0237", "FA0239"],                   estado: 0 },
      { codigo: "FA5026",  nombre: "Toxicología",                                        creditos: 3, nivel: 10, requisitos: ["FA0237"],                             estado: 0 },
      { codigo: "OPT1044", nombre: "Optativos Ciclo 10, Bloque A",                       creditos: 2, nivel: 10, requisitos: [],                                     estado: 0 },
      { codigo: "OPT1045", nombre: "Optativos Ciclo 10, Bloque B",                       creditos: 3, nivel: 10, requisitos: [],                                     estado: 0 },

      // ============ XI CICLO — Trabajo Final de Graduación ============
      { codigo: "FA9500",  nombre: "Investigación Dirigida 1",                           creditos: 0, nivel: 11, requisitos: [],                                     estado: 0 },
      { codigo: "FA9501",  nombre: "Investigación Dirigida 2",                           creditos: 0, nivel: 11, requisitos: ["FA9500"],                             estado: 0 },
      { codigo: "FA9502",  nombre: "Investigación Dirigida 3",                           creditos: 0, nivel: 11, requisitos: ["FA9501"],                             estado: 0 },
      { codigo: "FA9700",  nombre: "Práctica Dirigida I",                                creditos: 0, nivel: 11, requisitos: [],                                     estado: 0 },
      { codigo: "FA9701",  nombre: "Práctica Dirigida II",                               creditos: 0, nivel: 11, requisitos: ["FA9700"],                             estado: 0 },
      { codigo: "FA9702",  nombre: "Práctica Dirigida III",                              creditos: 0, nivel: 11, requisitos: ["FA9701"],                             estado: 0 },
      { codigo: "FA9800",  nombre: "Proyecto de Graduación I",                           creditos: 0, nivel: 11, requisitos: [],                                     estado: 0 },
      { codigo: "FA9801",  nombre: "Proyecto de Graduación II",                          creditos: 0, nivel: 11, requisitos: ["FA9800"],                             estado: 0 },
      { codigo: "FA9802",  nombre: "Proyecto de Graduación III",                         creditos: 0, nivel: 11, requisitos: ["FA9801"],                             estado: 0 }
    ]
  },

  ingenieriaQuimica: {
    nombre: "Ingeniería Química",
    codigo: "IQ",
    descripcion: "Licenciatura en Ingeniería Química · Escuela de Ingeniería Química, UCR",
    cursos: [
      // ============ I CICLO ============
      { codigo: "EG-",     nombre: "Curso de Arte",                                      creditos: 2, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "EG-I",    nombre: "Curso Integrado de Humanidades I",                   creditos: 6, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "LM1030",  nombre: "Estrategias de Lectura en Inglés I",                 creditos: 4, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "MA0001",  nombre: "Precálculo",                                         creditos: 0, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "MA1001",  nombre: "Cálculo I",                                          creditos: 3, nivel: 1, requisitos: ["MA0001"],                              estado: 0 },
      { codigo: "QU0100",  nombre: "Química General I",                                  creditos: 3, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "QU0101",  nombre: "Laboratorio de Química General I",                   creditos: 1, nivel: 1, requisitos: [],                                      estado: 0 },

      // ============ II CICLO ============
      { codigo: "EF-",     nombre: "Actividad Deportiva",                                creditos: 0, nivel: 2, requisitos: [],                                      estado: 0 },
      { codigo: "EG-II",   nombre: "Curso Integrado de Humanidades II",                  creditos: 6, nivel: 2, requisitos: ["EG-I"],                                estado: 0 },
      { codigo: "FS0210",  nombre: "Física General I",                                   creditos: 3, nivel: 2, requisitos: ["MA1001"],                              estado: 0 },
      { codigo: "FS0211",  nombre: "Laboratorio de Física General I",                    creditos: 1, nivel: 2, requisitos: ["MA1001"],                              estado: 0 },
      { codigo: "MA1002",  nombre: "Cálculo II",                                         creditos: 4, nivel: 2, requisitos: ["MA1001"],                              estado: 0 },
      { codigo: "QU0102",  nombre: "Química General II",                                 creditos: 3, nivel: 2, requisitos: ["QU0100", "QU0101"],                    estado: 0 },
      { codigo: "QU0103",  nombre: "Laboratorio de Química General II",                  creditos: 1, nivel: 2, requisitos: ["QU0100", "QU0101"],                    estado: 0 },

      // ============ III CICLO ============
      { codigo: "FS0310",  nombre: "Física General II",                                  creditos: 3, nivel: 3, requisitos: ["FS0210", "FS0211", "MA1002"],          estado: 0 },
      { codigo: "FS0311",  nombre: "Laboratorio de Física General II",                   creditos: 1, nivel: 3, requisitos: ["FS0210", "FS0211", "MA1002"],          estado: 0 },
      { codigo: "IQ0200",  nombre: "Análisis Gráfico para Ing. Química",                 creditos: 3, nivel: 3, requisitos: ["FS0210", "MA1002", "QU0102"],          estado: 0 },
      { codigo: "MA1003",  nombre: "Cálculo III",                                        creditos: 4, nivel: 3, requisitos: ["MA1002"],                              estado: 0 },
      { codigo: "MA1004",  nombre: "Álgebra Lineal",                                     creditos: 3, nivel: 3, requisitos: [],                                      estado: 0 },
      { codigo: "QU0200",  nombre: "Química Analítica Cuantitativa I",                   creditos: 3, nivel: 3, requisitos: ["QU0102", "QU0103"],                    estado: 0 },
      { codigo: "QU0201",  nombre: "Lab. Química Analítica Cuantitativa I",              creditos: 2, nivel: 3, requisitos: ["QU0102", "QU0103"],                    estado: 0 },

      // ============ IV CICLO ============
      { codigo: "CI0202",  nombre: "Principios de Informática",                          creditos: 4, nivel: 4, requisitos: ["MA1001"],                              estado: 0 },
      { codigo: "FS0410",  nombre: "Física General III",                                 creditos: 3, nivel: 4, requisitos: ["FS0310", "FS0311", "MA1003"],          estado: 0 },
      { codigo: "FS0411",  nombre: "Laboratorio de Física General III",                  creditos: 1, nivel: 4, requisitos: ["FS0310", "FS0311", "MA1003"],          estado: 0 },
      { codigo: "IQ0332",  nombre: "Análisis de Procesos I",                             creditos: 4, nivel: 4, requisitos: ["FS0310", "IQ0200"],                    estado: 0 },
      { codigo: "MA1005",  nombre: "Ecuaciones Diferenciales",                           creditos: 4, nivel: 4, requisitos: ["MA1002", "MA1004"],                    estado: 0 },
      { codigo: "QU0260",  nombre: "Físico Química para Ing. Química",                   creditos: 4, nivel: 4, requisitos: ["FS0310", "FS0311", "MA1002", "QU0102", "QU0103"], estado: 0 },

      // ============ V CICLO ============
      { codigo: "IQ0312",  nombre: "Mecánica I",                                         creditos: 4, nivel: 5, requisitos: ["FS0210", "FS0211", "MA1003", "MA1004"], estado: 0 },
      { codigo: "IQ0333",  nombre: "Análisis de Procesos II",                            creditos: 3, nivel: 5, requisitos: ["CI0202", "IQ0332", "MA1003", "MA1005"], estado: 0 },
      { codigo: "IQ0334",  nombre: "Termodinámica I",                                    creditos: 3, nivel: 5, requisitos: ["IQ0332", "MA1005", "QU0260"],          estado: 0 },
      { codigo: "QU0212",  nombre: "Química Orgánica General I",                         creditos: 4, nivel: 5, requisitos: ["QU0102", "QU0103"],                    estado: 0 },
      { codigo: "QU0213",  nombre: "Lab. Química Orgánica General I",                    creditos: 1, nivel: 5, requisitos: ["QU0102", "QU0103"],                    estado: 0 },
      { codigo: "XS0217",  nombre: "Probabilidades e Inferencia Estadística",            creditos: 4, nivel: 5, requisitos: ["MA1004||MA1005"],                      estado: 0 },

      // ============ VI CICLO ============
      { codigo: "IE0303",  nombre: "Electrotecnia I",                                    creditos: 3, nivel: 6, requisitos: ["FS0310", "FS0311", "MA1003"],          estado: 0 },
      { codigo: "IQ0313",  nombre: "Fenómenos de Transferencia",                         creditos: 4, nivel: 6, requisitos: ["IQ0333", "IQ0334"],                    estado: 0 },
      { codigo: "IQ0331",  nombre: "Medición y Tratamiento de Datos Exp.",               creditos: 3, nivel: 6, requisitos: ["FS0410", "IQ0332", "XS0217"],          estado: 0 },
      { codigo: "IQ0335",  nombre: "Termodinámica II",                                   creditos: 3, nivel: 6, requisitos: ["CI0202", "IQ0334", "MA1003", "QU0212"], estado: 0 },
      { codigo: "QU0214",  nombre: "Química Orgánica General II",                        creditos: 4, nivel: 6, requisitos: ["QU0212", "QU0213"],                    estado: 0 },
      { codigo: "QU0215",  nombre: "Lab. Química Orgánica General II",                   creditos: 1, nivel: 6, requisitos: ["QU0212", "QU0213"],                    estado: 0 },

      // ============ VII CICLO ============
      { codigo: "IQ0415",  nombre: "Ingeniería de los Materiales",                       creditos: 3, nivel: 7, requisitos: ["IQ0312", "IQ0335"],                    estado: 0 },
      { codigo: "IQ0423",  nombre: "Operac. Transferencia Fluidos y Calor",              creditos: 3, nivel: 7, requisitos: ["IQ0313"],                              estado: 0 },
      { codigo: "IQ0432",  nombre: "Lab. Operac. Transferencia Fluidos y Calor",         creditos: 3, nivel: 7, requisitos: ["IQ0313"],                              estado: 0 },
      { codigo: "IQ0451",  nombre: "Planeamiento de la Producción",                      creditos: 3, nivel: 7, requisitos: ["XS0217"],                              estado: 0 },
      { codigo: "SR-I",    nombre: "Seminario de Realidad Nacional I",                   creditos: 2, nivel: 7, requisitos: ["EG-II"],                               estado: 0 },

      // ============ VIII CICLO ============
      { codigo: "IQ0416",  nombre: "Cinética y Reactores Químicos",                      creditos: 3, nivel: 8, requisitos: ["IQ0415", "IQ0423", "QU0214"],          estado: 0 },
      { codigo: "IQ0424",  nombre: "Operaciones por Separación de Fases",                creditos: 3, nivel: 8, requisitos: ["IQ0335", "IQ0423"],                    estado: 0 },
      { codigo: "IQ0433",  nombre: "Lab. Operaciones por Separación de Fases",           creditos: 2, nivel: 8, requisitos: ["IQ0335"],                              estado: 0 },
      { codigo: "IQ0452",  nombre: "Control de la Producción",                           creditos: 3, nivel: 8, requisitos: ["IQ0451"],                              estado: 0 },
      { codigo: "RP-1",    nombre: "Repertorio",                                         creditos: 3, nivel: 8, requisitos: [],                                      estado: 0 },
      { codigo: "SR-II",   nombre: "Seminario de Realidad Nacional II",                  creditos: 2, nivel: 8, requisitos: ["SR-I"],                                estado: 0 },

      // ============ IX CICLO ============
      { codigo: "IQ0517",  nombre: "Control e Instrumentación de Procesos",              creditos: 3, nivel: 9, requisitos: ["IE0303", "IQ0416", "IQ0424"],          estado: 0 },
      { codigo: "IQ0525",  nombre: "Operac. Separación Métodos Difusionales",            creditos: 3, nivel: 9, requisitos: ["IQ0424"],                              estado: 0 },
      { codigo: "IQ0534",  nombre: "Lab. Operac. Separación Métodos Difus.",             creditos: 2, nivel: 9, requisitos: ["IQ0424"],                              estado: 0 },
      { codigo: "IQ0553",  nombre: "Evaluación de Proyectos",                            creditos: 3, nivel: 9, requisitos: ["IQ0424", "IQ0452"],                    estado: 0 },
      { codigo: "IQ0590",  nombre: "Seminario para Proyectos de Graduación",             creditos: 2, nivel: 9, requisitos: ["IQ0424", "IQ0452"],                    estado: 0 },

      // ============ X CICLO ============
      { codigo: "IQ0526",  nombre: "Procesos y Operaciones Integradas",                  creditos: 3, nivel: 10, requisitos: ["IQ0525", "IQ0553"],                   estado: 0 },
      { codigo: "IQ0551",  nombre: "Diseño de Procesos Químicos",                        creditos: 3, nivel: 10, requisitos: ["IQ0416", "IQ0525", "IQ0553"],         estado: 0 },
      { codigo: "IQ0556",  nombre: "Principios de Administración Industrial",            creditos: 3, nivel: 10, requisitos: ["IQ0525", "IQ0553"],                   estado: 0 },
      { codigo: "IQ9500",  nombre: "Investigación Dirigida I",                           creditos: 0, nivel: 10, requisitos: ["IQ0590"],                             estado: 0 },
      { codigo: "IQ9700",  nombre: "Práctica Dirigida I",                                creditos: 0, nivel: 10, requisitos: [],                                     estado: 0 },
      { codigo: "IQ9800",  nombre: "Proyecto de Graduación I",                           creditos: 0, nivel: 10, requisitos: [],                                     estado: 0 }
    ]
  },

  economia: {
    nombre: "Economía",
    codigo: "EC",
    descripcion: "Bachillerato en Economía — Plan 2 · Escuela de Economía, UCR",
    cursos: [
      // ============ I CICLO ============
      { codigo: "EC1100",  nombre: "Introducción a la Economía",                         creditos: 4, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "EC4101",  nombre: "Datos Económicos",                                   creditos: 3, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "MA1001",  nombre: "Cálculo I",                                          creditos: 3, nivel: 1, requisitos: ["MA0001"],                              estado: 0 },
      { codigo: "EG-I",    nombre: "Curso Integrado de Humanidades I",                   creditos: 6, nivel: 1, requisitos: [],                                      estado: 0 },

      // ============ II CICLO ============
      { codigo: "EC2100",  nombre: "Teoría Microeconómica I",                            creditos: 4, nivel: 2, requisitos: ["EC1100", "MA1001"],                    estado: 0 },
      { codigo: "MA1004",  nombre: "Álgebra Lineal",                                     creditos: 3, nivel: 2, requisitos: [],                                      estado: 0 },
      { codigo: "MA1023",  nombre: "Cálculo con Optimización",                           creditos: 4, nivel: 2, requisitos: ["MA1001"],                              estado: 0 },
      { codigo: "EG-II",   nombre: "Curso Integrado de Humanidades II",                  creditos: 6, nivel: 2, requisitos: ["EG-I"],                                estado: 0 },

      // ============ III CICLO ============
      { codigo: "EC2200",  nombre: "Teoría Microeconómica II",                           creditos: 4, nivel: 3, requisitos: ["EC2100", "MA1023"],                    estado: 0 },
      { codigo: "EC3200",  nombre: "Teoría Macroeconómica I",                            creditos: 4, nivel: 3, requisitos: ["EC2100", "MA1023"],                    estado: 0 },
      { codigo: "MA1005",  nombre: "Ecuaciones Diferenciales",                           creditos: 4, nivel: 3, requisitos: ["MA1002", "MA1004"],                    estado: 0 },
      { codigo: "MA1030",  nombre: "Introducción a la Probabilidad",                     creditos: 4, nivel: 3, requisitos: ["MA1023"],                              estado: 0 },
      { codigo: "LM0303",  nombre: "Inglés para Economía I",                             creditos: 3, nivel: 3, requisitos: ["EC2100"],                              estado: 0 },

      // ============ IV CICLO ============
      { codigo: "EC2201",  nombre: "Teoría de Juegos e Información",                     creditos: 3, nivel: 4, requisitos: ["EC2200", "MA1030"],                    estado: 0 },
      { codigo: "EC3201",  nombre: "Teoría Macroeconómica II",                           creditos: 4, nivel: 4, requisitos: ["EC2200", "EC3200", "MA1005"],          estado: 0 },
      { codigo: "XS0100",  nombre: "Fundamentos de Teoría Estadística",                  creditos: 3, nivel: 4, requisitos: ["EC4101", "MA1030"],                    estado: 0 },
      { codigo: "CI0108",  nombre: "Computación para Economistas",                       creditos: 4, nivel: 4, requisitos: ["MA1001", "MA1004"],                    estado: 0 },

      // ============ V CICLO ============
      { codigo: "EC4200",  nombre: "Econometría",                                        creditos: 3, nivel: 5, requisitos: ["MA1004", "XS0100"],                    estado: 0 },
      { codigo: "EC2300",  nombre: "Comercio Internacional",                             creditos: 3, nivel: 5, requisitos: ["EC2201"],                              estado: 0 },
      { codigo: "EC3300",  nombre: "Crecimiento y Ciclos",                               creditos: 3, nivel: 5, requisitos: ["EC3201"],                              estado: 0 },
      { codigo: "FL2076",  nombre: "Redacción para Economía",                            creditos: 3, nivel: 5, requisitos: ["EC2201", "EC3201"],                    estado: 0 },

      // ============ VI CICLO ============
      { codigo: "EC2301",  nombre: "Economía Financiera",                                creditos: 3, nivel: 6, requisitos: ["EC2201", "EC4200"],                    estado: 0 },
      { codigo: "EC4300",  nombre: "Microeconometría",                                   creditos: 3, nivel: 6, requisitos: ["CI0108", "EC2200", "EC4200"],          estado: 0 },
      { codigo: "EC4301",  nombre: "Macroeconometría",                                   creditos: 3, nivel: 6, requisitos: ["CI0108", "EC3201", "EC4200"],          estado: 0 },
      { codigo: "EC3302",  nombre: "Economía Monetaria",                                 creditos: 3, nivel: 6, requisitos: ["EC3300", "EC4200"],                    estado: 0 },

      // ============ VII CICLO ============
      { codigo: "EC1300",  nombre: "Historia del Pensamiento Económico",                 creditos: 3, nivel: 7, requisitos: ["EC3201", "HA1415"],                    estado: 0 },
      { codigo: "EC1400",  nombre: "Seminario de Investigación Económica I",             creditos: 3, nivel: 7, requisitos: ["EC2301", "EC3300", "EC4300", "EC4301"], estado: 0 },

      // ============ VIII CICLO ============
      { codigo: "EC1401",  nombre: "Seminario de Investigación Económica II",            creditos: 3, nivel: 8, requisitos: ["EC1400"],                              estado: 0 },

      // ============ CURSOS OPTATIVOS ============
      { codigo: "EC1001",  nombre: "Economía Urbana y Regional",                         creditos: 3, nivel: 8, requisitos: ["EC2201", "EC3300", "EC4200"],          estado: 0 },
      { codigo: "EC1005",  nombre: "Economía Ambiental y de Recursos Naturales",         creditos: 3, nivel: 8, requisitos: ["EC2201", "EC3300", "EC4200"],          estado: 0 },
      { codigo: "EC2003",  nombre: "Derivados Financieros",                              creditos: 3, nivel: 8, requisitos: ["EC2301", "EC3300", "EC4200"],          estado: 0 },
      { codigo: "EC2011",  nombre: "Microeconomía Avanzada",                             creditos: 3, nivel: 8, requisitos: ["EC2201", "EC3300", "EC4200"],          estado: 0 }
    ]
  },

  medicina: {
    nombre: "Medicina",
    codigo: "ME",
    descripcion: "Licenciatura en Medicina y Cirugía · Escuela de Medicina, UCR",
    cursos: [
      // ============ I CICLO ============
      { codigo: "EG-I",    nombre: "Curso Integrado de Humanidades I",                   creditos: 6, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "QU0114",  nombre: "Química General Intensiva",                          creditos: 4, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "QU0115",  nombre: "Lab. Química General Intensiva",                     creditos: 1, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "EG-",     nombre: "Curso de Arte",                                      creditos: 2, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "EF-",     nombre: "Actividad Deportiva",                                creditos: 0, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "MA1210",  nombre: "Cálculo I",                                          creditos: 3, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "LM1030",  nombre: "Estrategias de Lectura en Inglés I",                 creditos: 4, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "HA1009",  nombre: "Historia de la Medicina",                            creditos: 2, nivel: 1, requisitos: [],                                      estado: 0 },

      // ============ II CICLO ============
      { codigo: "EG-II",   nombre: "Curso Integrado de Humanidades II",                  creditos: 6, nivel: 2, requisitos: ["EG-I"],                                estado: 0 },
      { codigo: "FS0208",  nombre: "Física para Ciencias Médicas",                       creditos: 3, nivel: 2, requisitos: ["MA1210||MA1001"],                      estado: 0 },
      { codigo: "FS0204",  nombre: "Lab. Física para Ciencias Médicas",                  creditos: 1, nivel: 2, requisitos: [],                                      estado: 0 },
      { codigo: "QU0210",  nombre: "Fundamentos de Química Orgánica",                    creditos: 4, nivel: 2, requisitos: ["QU0114", "QU0115"],                    estado: 0 },
      { codigo: "QU0211",  nombre: "Lab. Fundamentos de Química Orgánica",               creditos: 1, nivel: 2, requisitos: ["QU0114", "QU0115"],                    estado: 0 },
      { codigo: "B0106",   nombre: "Biología General",                                   creditos: 3, nivel: 2, requisitos: [],                                      estado: 0 },
      { codigo: "B0107",   nombre: "Lab. Biología General",                              creditos: 1, nivel: 2, requisitos: [],                                      estado: 0 },

      // ============ III CICLO ============
      { codigo: "ME0410",  nombre: "Fundamentos de Psiquiatría",                         creditos: 2, nivel: 3, requisitos: ["B0106", "B0107"],                      estado: 0 },
      { codigo: "ME0411",  nombre: "Histología",                                         creditos: 5, nivel: 3, requisitos: ["QU0210", "QU0211"],                    estado: 0 },
      { codigo: "ME0412",  nombre: "Anatomía Descriptiva",                               creditos: 5, nivel: 3, requisitos: ["B0106", "B0107", "FS0204", "FS0208", "LM1030"], estado: 0 },
      { codigo: "ME0421",  nombre: "Embriología",                                        creditos: 2, nivel: 3, requisitos: ["B0106", "B0107"],                      estado: 0 },
      { codigo: "ME0117",  nombre: "Bioquímica para Medicina",                           creditos: 6, nivel: 3, requisitos: ["LM1030", "QU0210"],                    estado: 0 },
      { codigo: "ME0113",  nombre: "Lab. Bioquímica para Medicina",                      creditos: 2, nivel: 3, requisitos: ["LM1030", "QU0210", "QU0211"],          estado: 0 },
      { codigo: "SR-I",    nombre: "Seminario de Realidad Nacional I",                   creditos: 2, nivel: 3, requisitos: ["EG-II"],                               estado: 0 },

      // ============ IV CICLO ============
      { codigo: "ME2012",  nombre: "Fisiología",                                         creditos: 10, nivel: 4, requisitos: ["ME0411", "ME0412", "ME0421", "ME0113", "ME0117"], estado: 0 },
      { codigo: "ME0422",  nombre: "Neuroanatomía",                                      creditos: 3, nivel: 4, requisitos: ["ME0421", "ME0113", "ME0117"],          estado: 0 },
      { codigo: "SR-II",   nombre: "Seminario de Realidad Nacional II",                  creditos: 2, nivel: 4, requisitos: ["SR-I"],                                estado: 0 },
      { codigo: "RP-",     nombre: "Repertorio",                                         creditos: 3, nivel: 4, requisitos: [],                                      estado: 0 },
      { codigo: "ME0414",  nombre: "Anatomía Topográfica Radiológica y Quirúrgica",      creditos: 5, nivel: 4, requisitos: ["ME0411", "ME0412", "ME0421", "ME0113", "ME0117"], estado: 0 },
      { codigo: "OPT-MED1",nombre: "Optativo Bloque I",                                  creditos: 1, nivel: 4, requisitos: [],                                      estado: 0 },

      // ============ V CICLO ============
      { codigo: "F0008",   nombre: "Seminario Ética, Medicina y Sociedad",               creditos: 0, nivel: 5, requisitos: ["ME2012", "ME0414"],                    estado: 0 },
      { codigo: "XS0215",  nombre: "Estadística para Biociencias",                       creditos: 4, nivel: 5, requisitos: ["MA1210||MA1001"],                      estado: 0 },
      { codigo: "ME0109",  nombre: "Patología Humana I",                                 creditos: 5, nivel: 5, requisitos: ["ME2012", "ME0414", "ME0422"],          estado: 0 },
      { codigo: "ME3103",  nombre: "Fisiopatología y Semiología",                        creditos: 10, nivel: 5, requisitos: ["ME2012", "ME0414", "ME0422"],         estado: 0 },
      { codigo: "ME0104",  nombre: "Enfermedades Infecciosas I",                         creditos: 4, nivel: 5, requisitos: ["ME2012", "ME0414"],                    estado: 0 },

      // ============ VI CICLO ============
      { codigo: "ME0108",  nombre: "Patología Humana II",                                creditos: 5, nivel: 6, requisitos: ["ME0109", "ME3103", "ME0104"],          estado: 0 },
      { codigo: "ME3005",  nombre: "Medicina Interna I",                                 creditos: 10, nivel: 6, requisitos: ["ME0109", "ME0104", "ME3103"],         estado: 0 },
      { codigo: "ME0107",  nombre: "Enfermedades Infecciosas II",                        creditos: 4, nivel: 6, requisitos: ["ME0104", "ME0109", "ME3103"],          estado: 0 },
      { codigo: "ME2200",  nombre: "Propedéutica Psiquiátrica",                          creditos: 2, nivel: 6, requisitos: ["ME0410", "ME2012", "ME0422"],          estado: 0 },

      // ============ VII CICLO ============
      { codigo: "ME0313",  nombre: "Medicina Integral y Comunitaria I",                  creditos: 2, nivel: 7, requisitos: ["ME3005", "ME0107"],                    estado: 0 },
      { codigo: "ME0306",  nombre: "Farmacología Básica I",                              creditos: 3, nivel: 7, requisitos: ["ME0108", "ME3005", "ME0107"],          estado: 0 },
      { codigo: "ME4012",  nombre: "Obstetricia",                                        creditos: 6, nivel: 7, requisitos: ["ME0108", "ME3005", "ME0107"],          estado: 0 },
      { codigo: "ME4013",  nombre: "Ginecología",                                        creditos: 6, nivel: 7, requisitos: ["ME0108", "ME3005", "ME0107"],          estado: 0 },
      { codigo: "ME4014",  nombre: "Medicina Legal",                                     creditos: 4, nivel: 7, requisitos: ["ME0108", "ME3005", "ME0107"],          estado: 0 },

      // ============ VIII CICLO ============
      { codigo: "ME1007",  nombre: "Introducción a la Investigación en Medicina",        creditos: 2, nivel: 8, requisitos: ["XS0215"],                              estado: 0 },
      { codigo: "ME0310",  nombre: "Farmacología Básica II",                             creditos: 3, nivel: 8, requisitos: ["ME0306"],                              estado: 0 },
      { codigo: "ME4015",  nombre: "Pediatría",                                          creditos: 10, nivel: 8, requisitos: ["ME0108", "ME3005", "ME0107"],         estado: 0 },
      { codigo: "ME4016",  nombre: "Psiquiatría",                                        creditos: 4, nivel: 8, requisitos: ["ME2200", "ME3005", "ME0107", "ME0108"],estado: 0 },
      { codigo: "ME1009",  nombre: "Genética Médica",                                    creditos: 2, nivel: 8, requisitos: ["ME3005", "ME0108", "ME0107"],          estado: 0 },

      // ============ IX CICLO ============
      { codigo: "ME0314",  nombre: "Medicina Integral y Comunitaria II",                 creditos: 2, nivel: 9, requisitos: ["ME0313", "ME0310", "ME1007"],          estado: 0 },
      { codigo: "ME0315",  nombre: "Geriatría y Gerontología I",                         creditos: 2, nivel: 9, requisitos: ["ME0310", "ME4013"],                    estado: 0 },
      { codigo: "ME5000",  nombre: "Medicina Interna II",                                creditos: 10, nivel: 9, requisitos: ["ME0310", "ME4012", "ME4013", "ME4015"], estado: 0 },
      { codigo: "ME0308",  nombre: "Farmacología Clínica I",                             creditos: 2, nivel: 9, requisitos: ["ME0310", "ME4012", "ME4013", "ME4015"], estado: 0 },
      { codigo: "ME0420",  nombre: "Toxicología Clínica",                                creditos: 2, nivel: 9, requisitos: ["ME0310", "ME4012", "ME4013", "ME4015"], estado: 0 },

      // ============ X CICLO ============
      { codigo: "ME0316",  nombre: "Geriatría y Gerontología II",                        creditos: 2, nivel: 10, requisitos: ["ME0315", "ME5000"],                   estado: 0 },
      { codigo: "ME5001",  nombre: "Cirugía",                                            creditos: 10, nivel: 10, requisitos: ["ME5000"],                            estado: 0 },
      { codigo: "ME0311",  nombre: "Radiología",                                         creditos: 2, nivel: 10, requisitos: ["ME4012", "ME4013", "ME4015"],         estado: 0 },
      { codigo: "ME0309",  nombre: "Farmacología Clínica II",                            creditos: 2, nivel: 10, requisitos: ["ME0308"],                             estado: 0 },
      { codigo: "OPT-MED2",nombre: "Optativo Bloque II",                                 creditos: 1, nivel: 10, requisitos: [],                                     estado: 0 },

      // ============ XI y XII CICLOS (Internado) ============
      { codigo: "ME6001",  nombre: "Internado de Cirugía",                               creditos: 10, nivel: 11, requisitos: ["ME5001"],                            estado: 0 },
      { codigo: "ME6002",  nombre: "Internado de Pediatría",                             creditos: 10, nivel: 11, requisitos: ["ME5001"],                            estado: 0 },
      { codigo: "ME6003",  nombre: "Internado Gineco-Obstetricia",                       creditos: 10, nivel: 11, requisitos: ["ME5001"],                            estado: 0 },
      { codigo: "ME6004",  nombre: "Internado de Medicina Interna",                      creditos: 10, nivel: 12, requisitos: ["ME5001"],                            estado: 0 },
      { codigo: "ME6005",  nombre: "Salud Comunitaria y Familiar",                       creditos: 8, nivel: 12, requisitos: ["ME5001"],                             estado: 0 }
    ]
  },

  microbiologia: {
    nombre: "Microbiología",
    codigo: "MQ",
    descripcion: "Licenciatura en Microbiología y Química Clínica · Facultad de Microbiología, UCR",
    cursos: [
      // ============ I CICLO ============
      { codigo: "B0103",   nombre: "Biología General",                                   creditos: 3, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "B0104",   nombre: "Laboratorio de Biología General",                    creditos: 1, nivel: 1, requisitos: ["B0103"],                               estado: 0 },
      { codigo: "MA1001",  nombre: "Cálculo I",                                          creditos: 4, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "QU0100",  nombre: "Química General I",                                  creditos: 3, nivel: 1, requisitos: [],                                      estado: 0 },
      { codigo: "QU0101",  nombre: "Laboratorio de Química General I",                   creditos: 1, nivel: 1, requisitos: ["QU0100"],                              estado: 0 },
      { codigo: "EG-I",    nombre: "Curso Integrado de Humanidades I",                   creditos: 6, nivel: 1, requisitos: [],                                      estado: 0 },

      // ============ II CICLO ============
      { codigo: "B0105",   nombre: "Laboratorio de Biología Sistemática",                creditos: 1, nivel: 2, requisitos: ["B0103", "B0104"],                      estado: 0 },
      { codigo: "FS0210",  nombre: "Física para Ciencias de la Vida I",                  creditos: 3, nivel: 2, requisitos: ["MA1001"],                              estado: 0 },
      { codigo: "FS0211",  nombre: "Lab. Física para Ciencias de la Vida I",             creditos: 1, nivel: 2, requisitos: ["MA1001", "FS0210"],                    estado: 0 },
      { codigo: "QU0102",  nombre: "Química General II",                                 creditos: 3, nivel: 2, requisitos: ["QU0100"],                              estado: 0 },
      { codigo: "QU0103",  nombre: "Laboratorio de Química General II",                  creditos: 1, nivel: 2, requisitos: ["QU0101", "QU0102"],                    estado: 0 },
      { codigo: "EG-II",   nombre: "Curso Integrado de Humanidades II",                  creditos: 6, nivel: 2, requisitos: ["EG-I"],                                estado: 0 },

      // ============ III CICLO ============
      { codigo: "FS0310",  nombre: "Física para Ciencias de la Vida II",                 creditos: 3, nivel: 3, requisitos: ["FS0210"],                              estado: 0 },
      { codigo: "FS0311",  nombre: "Lab. Física para Ciencias de la Vida II",            creditos: 1, nivel: 3, requisitos: ["FS0211", "FS0310"],                    estado: 0 },
      { codigo: "QU0200",  nombre: "Química Orgánica I",                                 creditos: 3, nivel: 3, requisitos: ["QU0102"],                              estado: 0 },
      { codigo: "QU0201",  nombre: "Laboratorio de Química Orgánica I",                  creditos: 1, nivel: 3, requisitos: ["QU0103", "QU0200"],                    estado: 0 },
      { codigo: "QU0250",  nombre: "Química Analítica Cuantitativa",                     creditos: 3, nivel: 3, requisitos: ["QU0102"],                              estado: 0 },
      { codigo: "QU0251",  nombre: "Lab. Química Analítica Cuantitativa",                creditos: 1, nivel: 3, requisitos: ["QU0103", "QU0250"],                    estado: 0 },
      { codigo: "SR-I",    nombre: "Seminario de Realidad Nacional I",                   creditos: 2, nivel: 3, requisitos: ["EG-II"],                               estado: 0 },

      // ============ IV CICLO ============
      { codigo: "MQ0201",  nombre: "Anatomía y Fisiología Humanas I",                    creditos: 4, nivel: 4, requisitos: ["B0105", "QU0200"],                     estado: 0 },
      { codigo: "QU0202",  nombre: "Química Orgánica II",                                creditos: 3, nivel: 4, requisitos: ["QU0200"],                              estado: 0 },
      { codigo: "QU0203",  nombre: "Laboratorio de Química Orgánica II",                 creditos: 1, nivel: 4, requisitos: ["QU0201", "QU0202"],                    estado: 0 },
      { codigo: "QU0252",  nombre: "Análisis Instrumental",                              creditos: 3, nivel: 4, requisitos: ["QU0250"],                              estado: 0 },
      { codigo: "QU0253",  nombre: "Laboratorio de Análisis Instrumental",               creditos: 1, nivel: 4, requisitos: ["QU0251", "QU0252"],                    estado: 0 },
      { codigo: "SR-II",   nombre: "Seminario de Realidad Nacional II",                  creditos: 2, nivel: 4, requisitos: ["SR-I"],                                estado: 0 },
      { codigo: "RP-",     nombre: "Repertorio",                                         creditos: 3, nivel: 4, requisitos: [],                                      estado: 0 },

      // ============ V CICLO ============
      { codigo: "BC0210",  nombre: "Bioquímica para Microbiología",                      creditos: 4, nivel: 5, requisitos: ["QU0202"],                              estado: 0 },
      { codigo: "MQ0301",  nombre: "Anatomía y Fisiología Humanas II",                   creditos: 4, nivel: 5, requisitos: ["MQ0201"],                              estado: 0 },
      { codigo: "MQ0314",  nombre: "Parasitología General",                              creditos: 4, nivel: 5, requisitos: ["B0105"],                               estado: 0 },
      { codigo: "MQ0318",  nombre: "Micología",                                          creditos: 3, nivel: 5, requisitos: ["B0105"],                               estado: 0 },
      { codigo: "MQ0319",  nombre: "Histología Humana",                                  creditos: 3, nivel: 5, requisitos: ["MQ0201"],                              estado: 0 },

      // ============ VI CICLO ============
      { codigo: "MQ0414",  nombre: "Microbiología General",                              creditos: 5, nivel: 6, requisitos: ["BC0210", "MQ0314", "MQ0318"],          estado: 0 },
      { codigo: "MQ0415",  nombre: "Inmunología General",                                creditos: 4, nivel: 6, requisitos: ["BC0210", "MQ0319"],                    estado: 0 },
      { codigo: "MQ0416",  nombre: "Virología General",                                  creditos: 3, nivel: 6, requisitos: ["BC0210", "MQ0319"],                    estado: 0 },
      { codigo: "MQ0417",  nombre: "Genética Bacteriana",                                creditos: 3, nivel: 6, requisitos: ["BC0210"],                              estado: 0 },
      { codigo: "EF-",     nombre: "Actividad Deportiva",                                creditos: 0, nivel: 6, requisitos: [],                                      estado: 0 },

      // ============ VII CICLO ============
      { codigo: "MQ0511",  nombre: "Hematología I",                                      creditos: 4, nivel: 7, requisitos: ["MQ0415", "MQ0414"],                    estado: 0 },
      { codigo: "MQ0513",  nombre: "Bacteriología Médica I",                             creditos: 4, nivel: 7, requisitos: ["MQ0414", "MQ0415"],                    estado: 0 },
      { codigo: "MQ0515",  nombre: "Inmunología Clínica",                                creditos: 4, nivel: 7, requisitos: ["MQ0415"],                              estado: 0 },
      { codigo: "MQ0517",  nombre: "Protozoología Médica",                               creditos: 4, nivel: 7, requisitos: ["MQ0414", "MQ0415"],                    estado: 0 },

      // ============ VIII CICLO ============
      { codigo: "MQ0512",  nombre: "Hematología II",                                     creditos: 4, nivel: 8, requisitos: ["MQ0511"],                              estado: 0 },
      { codigo: "MQ0514",  nombre: "Bacteriología Médica II",                            creditos: 4, nivel: 8, requisitos: ["MQ0513"],                              estado: 0 },
      { codigo: "MQ0516",  nombre: "Química Clínica I",                                  creditos: 4, nivel: 8, requisitos: ["MQ0414", "MQ0415"],                    estado: 0 },
      { codigo: "MQ0518",  nombre: "Helmintología Médica",                               creditos: 4, nivel: 8, requisitos: ["MQ0517"],                              estado: 0 },

      // ============ IX CICLO ============
      { codigo: "MQ0611",  nombre: "Banco de Sangre",                                    creditos: 3, nivel: 9, requisitos: ["MQ0512", "MQ0515"],                    estado: 0 },
      { codigo: "MQ0613",  nombre: "Química Clínica II",                                 creditos: 4, nivel: 9, requisitos: ["MQ0516"],                              estado: 0 },
      { codigo: "MQ0614",  nombre: "Endocrinología Clínica",                             creditos: 3, nivel: 9, requisitos: ["MQ0516"],                              estado: 0 },
      { codigo: "MQ0615",  nombre: "Situación de Salud Nacional",                        creditos: 3, nivel: 9, requisitos: ["MQ0513", "MQ0517"],                    estado: 0 },
      { codigo: "MQ0616",  nombre: "Virología Clínica",                                  creditos: 3, nivel: 9, requisitos: ["MQ0416", "MQ0513", "MQ0515"],          estado: 0 },
      { codigo: "MQ0617",  nombre: "Gestión de la Calidad",                              creditos: 3, nivel: 9, requisitos: ["MQ0513", "MQ0516", "MQ0517"],          estado: 0 },

      // ============ X CICLO ============
      { codigo: "MQ0612",  nombre: "Administración de Laboratorios",                     creditos: 3, nivel: 10, requisitos: ["MQ0617"],                             estado: 0 },
      { codigo: "MQ0618",  nombre: "Métodos de Investigación",                           creditos: 3, nivel: 10, requisitos: ["MQ0615"],                             estado: 0 },
      { codigo: "MQ0619",  nombre: "Toxicología y Análisis de Drogas",                   creditos: 3, nivel: 10, requisitos: ["MQ0613"],                             estado: 0 },
      { codigo: "MQ0620",  nombre: "Microbiología de Alimentos y Aguas",                 creditos: 4, nivel: 10, requisitos: ["MQ0514", "MQ0613"],                   estado: 0 },
      { codigo: "MQ0621",  nombre: "Ética y Deontología",                                creditos: 2, nivel: 10, requisitos: [],                                     estado: 0 },

      // ============ XI CICLO ============
      { codigo: "MQ0701",  nombre: "Internado Clínico",                                  creditos: 15, nivel: 11, requisitos: ["MQ0612", "MQ0618", "MQ0619", "MQ0620", "MQ0621", "MQ0611", "MQ0614", "MQ0616"], estado: 0 }
    ]
  }
};

// ===================================
// CONFIGURACIÓN Y CONSTANTES
// ===================================

/**
 * Definición de los 8 estados (0-7)
 * estado 0 = No cursado (estado inicial)
 * estado 1 = Aprobado (ÚNICO que desbloquea requisitos)
 * estados 2-7 = Planificación futura por semestre
 */
const DATA_ESTADOS = {
  0: { nombre: 'No cursado', etiqueta: 'No cursado', clase: 'estado-0' },
  1: { nombre: 'Aprobado', etiqueta: '✅ Aprobado', clase: 'estado-1' },
  2: { nombre: 'Cursando', etiqueta: '📘 Cursando', clase: 'estado-2' },
  3: { nombre: 'Semestre +1', etiqueta: '🌸 Sem +1', clase: 'estado-3' },
  4: { nombre: 'Semestre +2', etiqueta: '🔵 Sem +2', clase: 'estado-4' },
  5: { nombre: 'Semestre +3', etiqueta: '🟣 Sem +3', clase: 'estado-5' },
  6: { nombre: 'Semestre +4', etiqueta: '🩵 Sem +4', clase: 'estado-6' },
  7: { nombre: 'Semestre +5+', etiqueta: '🟠 Sem +5+', clase: 'estado-7' }
};

const TOTAL_ESTADOS = 8; // 0 a 7

const DATA_STORAGE_KEY = 'planes-estudio-ucr-v2';

// ===================================
// FUNCIONES DE UTILIDAD
// ===================================

/**
 * Obtiene el nombre de una carrera por su ID
 */
function getNombreCarrera(carreraId) {
  return CARRERAS[carreraId]?.nombre || '';
}

/**
 * Obtiene todos los cursos de una carrera
 */
function getCursosCarrera(carreraId) {
  return CARRERAS[carreraId]?.cursos || [];
}

/**
 * Obtiene un curso específico por código
 */
function getCursoByCodigo(carreraId, codigo) {
  const cursos = getCursosCarrera(carreraId);
  return cursos.find(c => c.codigo === codigo);
}

/**
 * Obtiene todos los niveles únicos de una carrera
 */
function getNiveles(carreraId) {
  const cursos = getCursosCarrera(carreraId);
  const niveles = [...new Set(cursos.map(c => c.nivel))];
  return niveles.sort((a, b) => a - b);
}

/**
 * Obtiene cursos de un nivel específico
 */
function getCursosPorNivel(carreraId, nivel) {
  const cursos = getCursosCarrera(carreraId);
  return cursos.filter(c => c.nivel === nivel);
}

/**
 * Calcula el total de créditos de una carrera
 */
function getTotalCreditos(carreraId) {
  const cursos = getCursosCarrera(carreraId);
  return cursos.reduce((sum, curso) => sum + curso.creditos, 0);
}

/**
 * Calcula créditos aprobados (solo estado 1 = Verde)
 */
function getCreditosAprobados(carreraId) {
  const cursos = getCursosCarrera(carreraId);
  return cursos
    .filter(c => c.estado === 1)
    .reduce((sum, curso) => sum + curso.creditos, 0);
}

/**
 * Calcula créditos para un estado específico (para carga proyectada)
 * @param {string} carreraId
 * @param {number} estadoNum - número de estado (2–7)
 */
function getCreditosPorEstado(carreraId, estadoNum) {
  const cursos = getCursosCarrera(carreraId);
  return cursos
    .filter(c => c.estado === estadoNum)
    .reduce((sum, curso) => sum + curso.creditos, 0);
}

/**
 * Calcula progreso porcentual (basado solo en aprobados = estado 1)
 */
function getProgreso(carreraId) {
  const total = getTotalCreditos(carreraId);
  const aprobados = getCreditosAprobados(carreraId);
  return total > 0 ? Math.round((aprobados / total) * 100) : 0;
}

/**
 * Verifica si un curso puede estar en un estado específico basado en sus requisitos.
 * @param {string} carreraId
 * @param {string} codigoCurso
 * @param {number} nuevoEstado - El estado al que se quiere mover (0-7)
 */
function puedeEstarEnEstado(carreraId, codigoCurso, nuevoEstado) {
  // Excepción histórica: este curso siempre puede ser aprobado/cursado manualmente
  if (codigoCurso === 'II1132') return true;

  const curso = getCursoByCodigo(carreraId, codigoCurso);
  if (!curso) return false;

  // Estado 0 siempre es válido
  if (nuevoEstado === 0) return true;

  // Sin requisitos: siempre válido
  if (!curso.requisitos || curso.requisitos.length === 0) return true;

  // REGLAS:
  // 1. Para APROBADO (1) o CURSANDO (2): Requisitos deben estar APROBADOS (1).
  // 2. Para PROYECCIÓN (3-7): Requisitos deben estar en un estado ANTERIOR y ACTIVO (0 < estado_req < nuevoEstado).

  return curso.requisitos.every(reqString => {
    // Soporte para requisitos OR usando ||
    const opciones = reqString.split('||');

    return opciones.some(reqCodigo => {
      const reqCurso = getCursoByCodigo(carreraId, reqCodigo);
      if (!reqCurso) return true; // Si no existe el req, no bloqueamos

      if (nuevoEstado === 1 || nuevoEstado === 2) {
        return reqCurso.estado === 1;
      } else if (nuevoEstado >= 3) {
        return reqCurso.estado > 0 && reqCurso.estado < nuevoEstado;
      }
      return false;
    });
  });
}

/**
 * Verifica si un curso puede avanzar de estado base (aprobación tradicional).
 * Mantenemos esto para compatibilidad con el renderizado visual del candado inicial.
 */
function puedeSerCursado(carreraId, codigoCurso) {
  return puedeEstarEnEstado(carreraId, codigoCurso, 2); // 2 = Cursando (requiere requisitos aprobados)
}

/**
 * Obtiene todos los cursos de una carrera que ya pueden ser matriculados (requisitos cumplidos).
 * Se consideran aquellos en estado 0 pero con puedeSerCursado=true, o aquellos ya marcados como Cursando/Proyectado.
 */
function getCursosDisponibles(carreraId) {
  const carrera = CARRERAS[carreraId];
  if (!carrera) return [];

  return carrera.cursos.filter(curso => {
    // Un curso es elegible SOLO si sus requisitos previos están APROBADOS (Estado 1)
    // O si no tiene requisitos del todo.
    // Además, no debe estar ya aprobado (Estado 1).
    const yaAprobado = curso.estado === 1;
    const requisitosListos = curso.requisitos.every(reqString => {
      const opciones = reqString.split('||');
      return opciones.some(reqCodigo => {
        const reqCurso = getCursoByCodigo(carreraId, reqCodigo);
        return reqCurso && reqCurso.estado === 1;
      });
    });

    return !yaAprobado && requisitosListos;
  });
}

/**
 * Obtiene los nombres de los requisitos
 */
function getNombresRequisitos(carreraId, requisitos) {
  if (!requisitos || requisitos.length === 0) return 'Sin requisitos';

  return requisitos
    .map(reqString => {
      const opciones = reqString.split('||');
      return opciones.map(codigo => {
        const curso = getCursoByCodigo(carreraId, codigo);
        return curso ? `${curso.codigo}` : codigo;
      }).join(' O ');
    })
    .join(', ');
}

/**
 * Avanza el estado de un curso al siguiente en el ciclo.
 * Si está bloqueado (requisitos no cumplidos y estado actual = 0), no avanza.
 */
function siguienteEstado(estadoActual) {
  return (estadoActual + 1) % TOTAL_ESTADOS;
}

// ===================================
// CURSOS COMPARTIDOS ENTRE CARRERAS
// ===================================

/**
 * Grupos de cursos que son 100% equivalentes entre carreras.
 * Formato: codigo_canonico → [ { carreraId, codigo } ]
 * Al cambiar el estado de cualquiera de ellos, se sincroniza en todos los demás.
 */
const CURSOS_COMPARTIDOS = {
  "EG-I": ["ingenieriaIndustrial", "contaduriaPublica", "direccionEmpresas", "cienciasActuariales", "farmacia", "ingenieriaQuimica", "economia", "medicina", "microbiologia"],
  "EG-": ["ingenieriaIndustrial", "contaduriaPublica", "direccionEmpresas", "cienciasActuariales", "farmacia", "ingenieriaQuimica", "medicina"],
  "EF-": ["ingenieriaIndustrial", "contaduriaPublica", "direccionEmpresas", "cienciasActuariales", "farmacia", "ingenieriaQuimica", "medicina", "microbiologia"],
  "MA0001": ["ingenieriaIndustrial", "contaduriaPublica", "direccionEmpresas", "cienciasActuariales", "ingenieriaQuimica"],
  "MA1004": ["ingenieriaIndustrial", "ingenieriaQuimica", "economia"],
  "QU0114": ["ingenieriaIndustrial", "medicina"],
  "QU0115": ["ingenieriaIndustrial", "medicina"],
  "EG-II": ["ingenieriaIndustrial", "contaduriaPublica", "direccionEmpresas", "cienciasActuariales", "farmacia", "ingenieriaQuimica", "economia", "medicina", "microbiologia"],
  "MA1001": ["ingenieriaIndustrial", "ingenieriaQuimica", "economia", "microbiologia"],
  "FS0210": ["ingenieriaIndustrial", "ingenieriaQuimica", "microbiologia"],
  "FS0211": ["ingenieriaIndustrial", "ingenieriaQuimica", "microbiologia"],
  "MA1002": ["ingenieriaIndustrial", "ingenieriaQuimica"],
  "SR-I": ["ingenieriaIndustrial", "contaduriaPublica", "direccionEmpresas", "cienciasActuariales", "farmacia", "ingenieriaQuimica", "medicina", "microbiologia"],
  "FS0310": ["ingenieriaIndustrial", "ingenieriaQuimica", "microbiologia"],
  "FS0311": ["ingenieriaIndustrial", "ingenieriaQuimica", "microbiologia"],
  "MA1003": ["ingenieriaIndustrial", "ingenieriaQuimica"],
  "MA1005": ["ingenieriaIndustrial", "ingenieriaQuimica", "economia"],
  "SR-II": ["ingenieriaIndustrial", "contaduriaPublica", "direccionEmpresas", "cienciasActuariales", "farmacia", "ingenieriaQuimica", "medicina", "microbiologia"],
  "RP-": ["ingenieriaIndustrial", "contaduriaPublica", "direccionEmpresas", "medicina", "microbiologia"],
  "DN-0101": ["contaduriaPublica", "direccionEmpresas"],
  "DN-0102": ["contaduriaPublica", "direccionEmpresas"],
  "DN-0104": ["contaduriaPublica", "direccionEmpresas"],
  "DN-0103": ["contaduriaPublica", "direccionEmpresas"],
  "MA-1021": ["contaduriaPublica", "direccionEmpresas"],
  "PC-0200": ["contaduriaPublica", "direccionEmpresas"],
  "PC-0240": ["contaduriaPublica", "direccionEmpresas"],
  "PC-0261": ["contaduriaPublica", "direccionEmpresas"],
  "XS-0276": ["contaduriaPublica", "direccionEmpresas"],
  "MA-1022": ["contaduriaPublica", "direccionEmpresas"],
  "OPT-ING": ["contaduriaPublica", "direccionEmpresas"],
  "PC-0260": ["contaduriaPublica", "direccionEmpresas"],
  "PC-0202": ["contaduriaPublica", "direccionEmpresas"],
  "DN-0123": ["contaduriaPublica", "direccionEmpresas"],
  "XS-0277": ["contaduriaPublica", "direccionEmpresas"],
  "DN-0340": ["contaduriaPublica", "direccionEmpresas"],
  "PC-0304": ["contaduriaPublica", "direccionEmpresas"],
  "DN-0341": ["contaduriaPublica", "direccionEmpresas"],
  "DN-0105": ["contaduriaPublica", "direccionEmpresas"],
  "DN-0320": ["contaduriaPublica", "direccionEmpresas"],
  "PC-0462": ["contaduriaPublica", "direccionEmpresas"],
  "PC-0344": ["contaduriaPublica", "direccionEmpresas"],
  "DN-0110": ["contaduriaPublica", "direccionEmpresas"],
  "DN-0114": ["contaduriaPublica", "direccionEmpresas"],
  "DN-0115": ["contaduriaPublica", "direccionEmpresas"],
  "EC1100": ["cienciasActuariales", "economia"],
  "RP-1": ["cienciasActuariales", "farmacia", "ingenieriaQuimica"],
  "LM1030": ["cienciasActuariales", "ingenieriaQuimica", "medicina"],
  "EC2100": ["cienciasActuariales", "economia"],
  "EC3200": ["cienciasActuariales", "economia"],
  "MA1210": ["farmacia", "medicina"],
  "QU0100": ["farmacia", "ingenieriaQuimica", "microbiologia"],
  "QU0101": ["farmacia", "ingenieriaQuimica", "microbiologia"],
  "B0106": ["farmacia", "medicina"],
  "B0107": ["farmacia", "medicina"],
  "QU0102": ["farmacia", "ingenieriaQuimica", "microbiologia"],
  "QU0103": ["farmacia", "ingenieriaQuimica", "microbiologia"],
  "QU0212": ["farmacia", "ingenieriaQuimica"],
  "QU0213": ["farmacia", "ingenieriaQuimica"],
  "XS0215": ["farmacia", "medicina"],
  "QU0214": ["farmacia", "ingenieriaQuimica"],
  "QU0215": ["farmacia", "ingenieriaQuimica"],
  "QU0200": ["ingenieriaQuimica", "microbiologia"],
  "QU0201": ["ingenieriaQuimica", "microbiologia"],
};

/**
 * Índice inverso: dado un (carreraId, codigo) → clave canónica del grupo.
 * Se construye una sola vez al cargarse el módulo.
 */
const _INDICE_COMPARTIDOS = (() => {
  const idx = {};
  Object.entries(CURSOS_COMPARTIDOS).forEach(([clave, grupo]) => {
    grupo.forEach(({ carreraId, codigo }) => {
      idx[`${carreraId}::${codigo}`] = clave;
    });
  });
  return idx;
})();

/**
 * Devuelve true si el curso pertenece a un grupo de sincronización.
 */
function esCompartido(carreraId, codigo) {
  return !!_INDICE_COMPARTIDOS[`${carreraId}::${codigo}`];
}

/**
 * Propaga el nuevo estado a todos los cursos hermanos del mismo grupo.
 * No modifica el curso origen (ya fue actualizado por el llamador).
 */
function propagarEstadoCurso(sourceCarreraId, codigoCurso, nuevoEstado) {
  const clave = _INDICE_COMPARTIDOS[`${sourceCarreraId}::${codigoCurso}`];
  if (!clave) return; // No es un curso compartido

  const grupo = CURSOS_COMPARTIDOS[clave];
  grupo.forEach(({ carreraId, codigo }) => {
    if (carreraId === sourceCarreraId && codigo === codigoCurso) return; // Saltamos el origen
    const cursoHermano = getCursoByCodigo(carreraId, codigo);
    if (cursoHermano) {
      cursoHermano.estado = nuevoEstado;
    }
  });
}

// ===================================
// TABLA DE CONVALIDACIONES UCR (CP ↔ DN)
// ===================================

/**
 * Tabla basada en la resolución EAN-269-2023 de la Universidad de Costa Rica.
 * Formato: para cada carrera, listamos qué cursos de la OTRA carrera convalidan cursos en ESTA.
 * origen: Cursos que el estudiante YA TIENE aprobados (en la otra carrera).
 * destino: Cursos que se le RECONOCEN (en la carrera actual).
 */
const TABLA_CONVALIDACIONES = {
  'contaduriaPublica': [
    {
      origen: [
        { codigo: 'DN-0304', nombre: 'Liderazgo Gerencial' },
        { codigo: 'DN-0202', nombre: 'Principios de Gerencia' }
      ],
      destino: ['PC-0212'],
      nombre: 'Liderazgo y Gerencia (DN) → Gerencia y Liderazgo (CP)',
      nota: 'Se requieren ambos cursos de Dirección para convalidar Gerencia en Conta.'
    },
    {
      origen: [
        { codigo: 'DN-0380', nombre: 'Entorno Legal de las Empresas I' },
        { codigo: 'DN-0381', nombre: 'Entorno Legal de las Empresas II' }
      ],
      destino: ['DN-0104'],
      nombre: 'Entorno Legal I y II (DN) → Legis. Empresarial (CP)',
      nota: 'Se requieren ambos cursos de Dirección para convalidar Legislación en Conta.'
    },
    {
      origen: [
        { codigo: 'DN-0160', nombre: 'Principios de Contabilidad' },
        { codigo: 'DN-0261', nombre: 'Estructura de Contabilidad' }
      ],
      destino: ['PC-0200'],
      nombre: 'Principios y Estructura Conta (DN) → Conta Básica (CP)',
      nota: 'Se requieren ambos de Dirección para convalidar Conta Básica.'
    },
    {
      origen: [{ codigo: 'DN-0495', nombre: 'Métodos Cuantitativos para la Toma de Decisiones' }],
      destino: ['DN-0105'],
      nombre: 'Métodos Cuantitativos (DN) → Métodos Cuantitativos I (CP)',
      nota: 'Equivalencia de Métodos Cuantitativos.'
    },
    {
      origen: [{ codigo: 'DN-0424', nombre: 'Mercadeo Gerencial' }],
      destino: ['DN-0320'],
      nombre: 'Mercadeo Gerencial (DN) → Principios de Mercadeo (CP)',
      nota: 'Equivalencia de Mercadeo.'
    }
  ],
  'direccionEmpresas': [
    {
      origen: [
        { codigo: 'PC-0320', nombre: 'Auditoría Financiera I' },
        { codigo: 'PC-0321', nombre: 'Auditoría Financiera II' },
        { codigo: 'PC-0421', nombre: 'Auditoría Financiera III' }
      ],
      destino: ['DN-0109'],
      nombre: 'Auditorías Financieras I, II y III (CP) → Auditoría Financiera (DN)',
      nota: 'Requiere las tres auditorías de Conta para convalidar la de Dirección.'
    },
    {
      origen: [{ codigo: 'PC-0490', nombre: 'Investigación de Operaciones' }],
      destino: ['DN-0105'],
      nombre: 'Investigación de Operaciones (CP) → Métodos Cuantitativos I (DN)',
      nota: 'Equivalencia de Métodos Cuantitativos.'
    },
    {
      origen: [{ codigo: 'PC-0343', nombre: 'Análisis de las Finanzas y Presupuestos' }],
      destino: ['DN-0340'],
      nombre: 'Análisis de Finanzas (CP) → Adm. Financiera I (DN)',
      nota: 'Equivalencia de Finanzas.'
    },
    {
      origen: [{ codigo: 'PC-0250', nombre: 'Mercadeo Básico' }],
      destino: ['DN-0320'],
      nombre: 'Mercadeo Básico (CP) → Principios de Mercadeo (DN)',
      nota: 'Equivalencia de Mercadeo.'
    },
    {
      origen: [{ codigo: 'PC-0352', nombre: 'Instrumentos de Comercio Internacional' }],
      destino: ['DN-0107'],
      nombre: 'Instrumentos de Comercio (CP) → Economía Internacional (DN)',
      nota: 'Equivalencia de Comercio Internacional.'
    },
    {
      origen: [{ codigo: 'PC-0208', nombre: 'Costos Avanzados' }],
      destino: [{ codigo: 'DN-0124', nombre: 'Costeo Gerencial para Administradores' }],
      nombre: 'Costos Avanzados (CP) → Costeo Gerencial (DN)',
      nota: 'Equivalencia de Costos.'
    }
  ]
};
