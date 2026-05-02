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
      {
        codigo: "EG-I",
        nombre: "Curso Integrado de Humanidades I",
        creditos: 6,
        nivel: 1,
        requisitos: [],
        estado: 0
      },
      {
        codigo: "EG-",
        nombre: "Curso de Arte",
        creditos: 2,
        nivel: 1,
        requisitos: [],
        estado: 0
      },
      {
        codigo: "RP-",
        nombre: "Repertorio",
        creditos: 3,
        nivel: 1,
        requisitos: [],
        estado: 0
      },
      {
        codigo: "DN-0101",
        nombre: "Introducción a la Administración de Negocios",
        creditos: 3,
        nivel: 1,
        requisitos: [],
        estado: 0
      },
      {
        codigo: "MA0001",
        nombre: "Pre-Cálculo",
        creditos: 0,
        nivel: 1,
        requisitos: [],
        estado: 0
      },
      {
        codigo: "DN-0102",
        nombre: "Aplicaciones Ofimáticas para la Toma de Decisiones",
        creditos: 3,
        nivel: 1,
        requisitos: [],
        estado: 0
      },

      // ============ II CICLO ============
      {
        codigo: "EG-II",
        nombre: "Curso Integrado de Humanidades II",
        creditos: 6,
        nivel: 2,
        requisitos: ["EG-I"],
        estado: 0
      },
      {
        codigo: "EF-",
        nombre: "Actividad Deportiva",
        creditos: 0,
        nivel: 2,
        requisitos: [],
        estado: 0
      },
      {
        codigo: "DN-0104",
        nombre: "Elementos Fundamentales de Legislación Empresarial",
        creditos: 3,
        nivel: 2,
        requisitos: ["DN-0101"],
        estado: 0
      },
      {
        codigo: "DN-0103",
        nombre: "Administración de Proyectos y Herramientas para el Análisis de Datos",
        creditos: 3,
        nivel: 2,
        requisitos: ["DN-0102"],
        estado: 0
      },
      {
        codigo: "MA-1021",
        nombre: "Cálculo para Ciencias Económicas",
        creditos: 4,
        nivel: 2,
        requisitos: ["MA0001"],
        estado: 0
      },

      // ============ III CICLO ============
      {
        codigo: "PC-0200",
        nombre: "Contabilidad Básica",
        creditos: 4,
        nivel: 3,
        requisitos: ["DN-0101"],
        estado: 0
      },
      {
        codigo: "PC-0240",
        nombre: "Matemática Financiera",
        creditos: 3,
        nivel: 3,
        requisitos: ["MA-1021", "DN-0103"],
        estado: 0
      },
      {
        codigo: "PC-0261",
        nombre: "Legislación Comercial, Bancaria y Financiera",
        creditos: 3,
        nivel: 3,
        requisitos: ["DN-0104"],
        estado: 0
      },
      {
        codigo: "XS-0276",
        nombre: "Estadística General I",
        creditos: 4,
        nivel: 3,
        requisitos: ["MA-1021"],
        estado: 0
      },
      {
        codigo: "MA-1022",
        nombre: "Cálculo para Ciencias Económicas II",
        creditos: 4,
        nivel: 3,
        requisitos: ["MA-1021"],
        estado: 0
      },
      {
        codigo: "OPT-ING",
        nombre: "Opcional I (Inglés)",
        creditos: 0,
        nivel: 3,
        requisitos: ["DN-0101"],
        estado: 0
      },

      // ============ IV CICLO ============
      {
        codigo: "SR-I",
        nombre: "Seminario de Realidad Nacional I",
        creditos: 2,
        nivel: 4,
        requisitos: ["EG-II"],
        estado: 0
      },
      {
        codigo: "PC-0260",
        nombre: "Legislación Laboral",
        creditos: 3,
        nivel: 4,
        requisitos: ["PC-0261"],
        estado: 0
      },
      {
        codigo: "PC-0202",
        nombre: "Contabilidad Intermedia I",
        creditos: 3,
        nivel: 4,
        requisitos: ["PC-0200"],
        estado: 0
      },
      {
        codigo: "DN-0123",
        nombre: "Metodología de la Investigación",
        creditos: 3,
        nivel: 4,
        requisitos: ["XS-0276"],
        estado: 0
      },
      {
        codigo: "XS-0277",
        nombre: "Estadística General II",
        creditos: 4,
        nivel: 4,
        requisitos: ["XS-0276", "MA-1022"],
        estado: 0
      },
      {
        codigo: "DN-0340",
        nombre: "Administración Financiera I",
        creditos: 3,
        nivel: 4,
        requisitos: ["PC-0240", "PC-0200"],
        estado: 0
      },

      // ============ V CICLO ============
      {
        codigo: "SR-II",
        nombre: "Seminario de Realidad Nacional II",
        creditos: 2,
        nivel: 5,
        requisitos: ["SR-I"],
        estado: 0
      },
      {
        codigo: "PC-0304",
        nombre: "Contabilidad Intermedia II",
        creditos: 3,
        nivel: 5,
        requisitos: ["PC-0240", "PC-0202"],
        estado: 0
      },
      {
        codigo: "PC-0320",
        nombre: "Auditoría Financiera I",
        creditos: 3,
        nivel: 5,
        requisitos: ["PC-0202", "XS-0276"],
        estado: 0
      },
      {
        codigo: "PC-0241",
        nombre: "Negocios y Entorno Económico",
        creditos: 3,
        nivel: 5,
        requisitos: ["PC-0261"],
        estado: 0
      },
      {
        codigo: "PC-0212",
        nombre: "Gerencia y Liderazgo para Contadores",
        creditos: 3,
        nivel: 5,
        requisitos: ["DN-0101"],
        estado: 0
      },
      {
        codigo: "DN-0341",
        nombre: "Administración Financiera II",
        creditos: 3,
        nivel: 5,
        requisitos: ["DN-0340", "XS-0277"],
        estado: 0
      },

      // ============ VI CICLO ============
      {
        codigo: "PC-0305",
        nombre: "Contabilizaciones Especiales",
        creditos: 3,
        nivel: 6,
        requisitos: ["PC-0304"],
        estado: 0
      },
      {
        codigo: "PC-0321",
        nombre: "Auditoría Financiera II",
        creditos: 3,
        nivel: 6,
        requisitos: ["PC-0320"],
        estado: 0
      },
      {
        codigo: "PC-0211",
        nombre: "Muestreo Aplicado a la Auditoría",
        creditos: 3,
        nivel: 6,
        requisitos: ["XS-0277", "PC-0320"],
        estado: 0
      },
      {
        codigo: "DN-0105",
        nombre: "Métodos Cuantitativos para la Toma de Decisiones I",
        creditos: 3,
        nivel: 6,
        requisitos: ["DN-0340", "XS-0277", "DN-0341", "DN-0320"],
        estado: 0
      },
      {
        codigo: "DN-0320",
        nombre: "Principios de Mercadeo",
        creditos: 3,
        nivel: 6,
        requisitos: ["PC-0200", "XS-0276"],
        estado: 0
      },
      {
        codigo: "PC-0242",
        nombre: "Entorno, Gestión y Control",
        creditos: 3,
        nivel: 6,
        requisitos: ["PC-0241"],
        estado: 0
      },

      // ============ VII CICLO ============
      {
        codigo: "PC-0407",
        nombre: "Contabilidad Avanzada I",
        creditos: 3,
        nivel: 7,
        requisitos: ["PC-0305"],
        estado: 0
      },
      {
        codigo: "PC-0204",
        nombre: "Laboratorio de Contabilidad",
        creditos: 3,
        nivel: 7,
        requisitos: ["PC-0305"],
        estado: 0
      },
      {
        codigo: "PC-0421",
        nombre: "Auditoría Financiera III",
        creditos: 3,
        nivel: 7,
        requisitos: ["PC-0321"],
        estado: 0
      },
      {
        codigo: "PC-0462",
        nombre: "Legislación Tributaria y Aduanera",
        creditos: 3,
        nivel: 7,
        requisitos: ["PC-0304", "PC-0260"],
        estado: 0
      },
      {
        codigo: "PC-0306",
        nombre: "Sistemas de Costeo Básico",
        creditos: 3,
        nivel: 7,
        requisitos: ["PC-0304"],
        estado: 0
      },
      {
        codigo: "PC-0344",
        nombre: "Formulación y Evaluación de Proyectos I",
        creditos: 3,
        nivel: 7,
        requisitos: ["DN-0341", "DN-0110"],
        estado: 0
      },

      // ============ VIII CICLO ============
      {
        codigo: "PC-0409",
        nombre: "Sistemas de Costeo Gerencial",
        creditos: 3,
        nivel: 8,
        requisitos: ["PC-0306"],
        estado: 0
      },
      {
        codigo: "PC-0410",
        nombre: "Contabilidad Avanzada II",
        creditos: 3,
        nivel: 8,
        requisitos: ["PC-0407"],
        estado: 0
      },
      {
        codigo: "PC-0205",
        nombre: "Contabilidad Gubernamental",
        creditos: 3,
        nivel: 8,
        requisitos: ["PC-0407"],
        estado: 0
      },
      {
        codigo: "PC-0531",
        nombre: "Auditoría Financiera IV",
        creditos: 3,
        nivel: 8,
        requisitos: ["PC-0421"],
        estado: 0
      },
      {
        codigo: "DN-0110",
        nombre: "Métodos Cuantitativos para la Toma de Decisiones II",
        creditos: 3,
        nivel: 8,
        requisitos: ["DN-0105", "PC-0344"],
        estado: 0
      },
      {
        codigo: "DN-0525",
        nombre: "Mercadeo de Servicios",
        creditos: 3,
        nivel: 8,
        requisitos: ["DN-0320"],
        estado: 0
      },

      // ============ IX CICLO (LICENCIATURA) ============
      {
        codigo: "PC-0423",
        nombre: "Auditoría Informática I",
        creditos: 3,
        nivel: 9,
        requisitos: ["PC-0531"],
        estado: 0
      },
      {
        codigo: "PC-0424",
        nombre: "Laboratorio de Auditoría Informática I",
        creditos: 1,
        nivel: 9,
        requisitos: ["PC-0531"],
        estado: 0
      },
      {
        codigo: "PC-0425",
        nombre: "Control Interno y Auditorías Especiales",
        creditos: 3,
        nivel: 9,
        requisitos: ["PC-0531"],
        estado: 0
      },
      {
        codigo: "PC-0528",
        nombre: "Auditoría de Gestión I",
        creditos: 4,
        nivel: 9,
        requisitos: ["PC-0531"],
        estado: 0
      },
      {
        codigo: "OPT-2",
        nombre: "Inteligencia Emocional en el Trabajo",
        creditos: 3,
        nivel: 9,
        requisitos: ["DN-0104"],
        estado: 0
      },
      {
        codigo: "DN-0114",
        nombre: "Comunicación Intercultural de los Negocios",
        creditos: 3,
        nivel: 9,
        requisitos: ["PC-0409"],
        estado: 0
      },

      // ============ X CICLO ============
      {
        codigo: "PC-0526",
        nombre: "Auditoría Informática II",
        creditos: 3,
        nivel: 10,
        requisitos: ["PC-0423", "PC-0424"],
        estado: 0
      },
      {
        codigo: "PC-0527",
        nombre: "Laboratorio de Auditoría Informática II",
        creditos: 1,
        nivel: 10,
        requisitos: ["PC-0423", "PC-0424"],
        estado: 0
      },
      {
        codigo: "PC-0529",
        nombre: "Auditoría de Gestión II",
        creditos: 4,
        nivel: 10,
        requisitos: ["PC-0528"],
        estado: 0
      },
      {
        codigo: "OPT-3",
        nombre: "Valoraciones, Fusiones y Adquisiciones de Empresas",
        creditos: 3,
        nivel: 10,
        requisitos: ["DN-0104"],
        estado: 0
      },
      {
        codigo: "DN-0115",
        nombre: "Taller de Investigación",
        creditos: 3,
        nivel: 10,
        requisitos: ["DN-0114"],
        estado: 0
      },
      {
        codigo: "PC-0210",
        nombre: "Auditoría Interna",
        creditos: 3,
        nivel: 10,
        requisitos: ["PC-0425"],
        estado: 0
      }
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
  // ── Compartidos entre las 3 carreras ──
  'EG-I': [{ carreraId: 'ingenieriaIndustrial', codigo: 'EG-I' },
  { carreraId: 'contaduriaPublica', codigo: 'EG-I' },
  { carreraId: 'direccionEmpresas', codigo: 'EG-I' }],

  'EG-II': [{ carreraId: 'ingenieriaIndustrial', codigo: 'EG-II' },
  { carreraId: 'contaduriaPublica', codigo: 'EG-II' },
  { carreraId: 'direccionEmpresas', codigo: 'EG-II' }],

  'EG-': [{ carreraId: 'ingenieriaIndustrial', codigo: 'EG-' },
  { carreraId: 'contaduriaPublica', codigo: 'EG-' },
  { carreraId: 'direccionEmpresas', codigo: 'EG-' }],

  'EF-': [{ carreraId: 'ingenieriaIndustrial', codigo: 'EF-' },
  { carreraId: 'contaduriaPublica', codigo: 'EF-' },
  { carreraId: 'direccionEmpresas', codigo: 'EF-' }],

  'SR-I': [{ carreraId: 'ingenieriaIndustrial', codigo: 'SR-I' },
  { carreraId: 'contaduriaPublica', codigo: 'SR-I' },
  { carreraId: 'direccionEmpresas', codigo: 'SR-I' }],

  'SR-II': [{ carreraId: 'ingenieriaIndustrial', codigo: 'SR-II' },
  { carreraId: 'contaduriaPublica', codigo: 'SR-II' },
  { carreraId: 'direccionEmpresas', codigo: 'SR-II' }],

  'MA0001': [{ carreraId: 'ingenieriaIndustrial', codigo: 'MA0001' },
  { carreraId: 'contaduriaPublica', codigo: 'MA0001' },
  { carreraId: 'direccionEmpresas', codigo: 'MA0001' }],

  'RP-': [{ carreraId: 'ingenieriaIndustrial', codigo: 'RP-' },
  { carreraId: 'contaduriaPublica', codigo: 'RP-' },
  { carreraId: 'direccionEmpresas', codigo: 'RP-' }],

  // ── Compartidos entre Contaduría Pública y Dirección de Empresas ──
  'MA-1021': [{ carreraId: 'contaduriaPublica', codigo: 'MA-1021' },
  { carreraId: 'direccionEmpresas', codigo: 'MA-1021' }],

  'MA-1022': [{ carreraId: 'contaduriaPublica', codigo: 'MA-1022' },
  { carreraId: 'direccionEmpresas', codigo: 'MA-1022' }],

  'XS-0276': [{ carreraId: 'contaduriaPublica', codigo: 'XS-0276' },
  { carreraId: 'direccionEmpresas', codigo: 'XS-0276' }],

  'XS-0277': [{ carreraId: 'contaduriaPublica', codigo: 'XS-0277' },
  { carreraId: 'direccionEmpresas', codigo: 'XS-0277' }],

  'DN-0101': [{ carreraId: 'contaduriaPublica', codigo: 'DN-0101' },
  { carreraId: 'direccionEmpresas', codigo: 'DN-0101' }],

  'DN-0102': [{ carreraId: 'contaduriaPublica', codigo: 'DN-0102' },
  { carreraId: 'direccionEmpresas', codigo: 'DN-0102' }],

  'DN-0103': [{ carreraId: 'contaduriaPublica', codigo: 'DN-0103' },
  { carreraId: 'direccionEmpresas', codigo: 'DN-0103' }],

  'DN-0104': [{ carreraId: 'contaduriaPublica', codigo: 'DN-0104' },
  { carreraId: 'direccionEmpresas', codigo: 'DN-0104' }],

  'DN-0123': [{ carreraId: 'contaduriaPublica', codigo: 'DN-0123' },
  { carreraId: 'direccionEmpresas', codigo: 'DN-0123' }],

  'DN-0340': [{ carreraId: 'contaduriaPublica', codigo: 'DN-0340' },
  { carreraId: 'direccionEmpresas', codigo: 'DN-0340' }],

  'DN-0341': [{ carreraId: 'contaduriaPublica', codigo: 'DN-0341' },
  { carreraId: 'direccionEmpresas', codigo: 'DN-0341' }],

  'DN-0105': [{ carreraId: 'contaduriaPublica', codigo: 'DN-0105' },
  { carreraId: 'direccionEmpresas', codigo: 'DN-0105' }],

  'DN-0110': [{ carreraId: 'contaduriaPublica', codigo: 'DN-0110' },
  { carreraId: 'direccionEmpresas', codigo: 'DN-0110' }],

  'DN-0320': [{ carreraId: 'contaduriaPublica', codigo: 'DN-0320' },
  { carreraId: 'direccionEmpresas', codigo: 'DN-0320' }],

  'PC-0200': [{ carreraId: 'contaduriaPublica', codigo: 'PC-0200' },
  { carreraId: 'direccionEmpresas', codigo: 'PC-0200' }],

  'PC-0202': [{ carreraId: 'contaduriaPublica', codigo: 'PC-0202' },
  { carreraId: 'direccionEmpresas', codigo: 'PC-0202' }],

  'PC-0240': [{ carreraId: 'contaduriaPublica', codigo: 'PC-0240' },
  { carreraId: 'direccionEmpresas', codigo: 'PC-0240' }],

  'PC-0261': [{ carreraId: 'contaduriaPublica', codigo: 'PC-0261' },
  { carreraId: 'direccionEmpresas', codigo: 'PC-0261' }],

  'PC-0260': [{ carreraId: 'contaduriaPublica', codigo: 'PC-0260' },
  { carreraId: 'direccionEmpresas', codigo: 'PC-0260' }],

  'PC-0304': [{ carreraId: 'contaduriaPublica', codigo: 'PC-0304' },
  { carreraId: 'direccionEmpresas', codigo: 'PC-0304' }],

  'PC-0344': [{ carreraId: 'contaduriaPublica', codigo: 'PC-0344' },
  { carreraId: 'direccionEmpresas', codigo: 'PC-0344' }],

  'PC-0462': [{ carreraId: 'contaduriaPublica', codigo: 'PC-0462' },
  { carreraId: 'direccionEmpresas', codigo: 'PC-0462' }],

  'OPT-ING': [{ carreraId: 'contaduriaPublica', codigo: 'OPT-ING' },
  { carreraId: 'direccionEmpresas', codigo: 'OPT-ING' }]
  // EXCLUIDOS: Taller de Investigación (DN-0114/DN-0115), Comunicación Intercultural,
  //            Optativas (OPT-2, OPT-3, DN-OPTxx) — son distintas por carrera.
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
