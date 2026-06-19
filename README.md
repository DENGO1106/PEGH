# 📚 Sistema de Gestión de Planes de Estudio - UCR

Sistema web local para gestionar y visualizar tus planes de estudio universitarios de la Universidad de Costa Rica.

## ✨ Características

- **📊 Visualización de Malla Curricular**: Vista organizada por niveles de ambas carreras
- **🎯 Gestión de Estados**: Marca cursos como "Cursando", "Aprobado" o sin cursar
- **🔒 Validación de Requisitos**: Sistema automático que bloquea cursos si no cumplís los prerrequisitos
- **💾 Persistencia Automática**: Todos tus datos se guardan automáticamente en el navegador
- **📸 Exportación PNG**: Descargá tu malla curricular con progreso como imagen
- **📈 Dashboard de Progreso**: Visualizá créditos, cursos aprobados y progreso porcentual
- **🎨 Animaciones**: Interfaz moderna con efectos y animaciones suaves
- **🎉 Confetti**: Animación de celebración al aprobar cursos

## 🚀 Cómo Usar

### Inicio Rápido

1. **Abrí el archivo `index.html`** directamente en tu navegador (doble clic)
2. **Seleccioná tu carrera** usando los botones en la parte superior
3. **Marcá tus cursos**:
   - Clic en "Cursando" para cursos que estás llevando actualmente
   - Clic en "Aprobado" para cursos que ya pasaste
   - Clic en "Limpiar" para resetear el estado

### Funcionalidades

#### Navegación entre Carreras
- **Ingeniería Industrial**: Cursos organizados por nivel
- **Contaduría Pública**: Cursos organizados por nivel

#### Exportar Imagen
- Clic en **"📸 Exportar PNG"** para descargar tu malla curricular
- El archivo se guarda como: `Plan_[Carrera]_[Progreso]%_[Fecha].png`

#### Backup de Datos
- **Exportar Datos**: Descargá un archivo JSON con todos tus datos
- **Importar Datos**: Restaurá tus datos desde un archivo JSON
- **Resetear Todo**: Borrá todos los datos y volvé a empezar

## 📁 Estructura de Archivos

```
App Universitaria/
│
├── index.html       # Página principal
├── styles.css       # Estilos y diseño
├── data.js          # Datos de carreras y cursos
├── app.js           # Lógica principal
├── export.js        # Funcionalidad de exportación
└── README.md        # Este archivo
```

## 🎨 Personalización

### Agregar/Modificar Cursos

Editá el archivo `data.js` para:

1. **Agregar nuevos cursos**: Añadí objetos en el array `cursos` de cada carrera
2. **Modificar cursos existentes**: Cambiá nombre, créditos, nivel o requisitos
3. **Estructura de un curso**:

```javascript
{
  codigo: "MA1001",           // Código del curso
  nombre: "Cálculo I",        // Nombre completo
  creditos: 4,                // Cantidad de créditos
  nivel: 1,                   // Nivel/semestre sugerido
  requisitos: [],             // Array con códigos de requisitos
  estado: "no-cursado"        // Estado inicial
}
```

### Cambiar Colores

Editá las variables CSS en `styles.css` (líneas 8-20):

```css
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-cursando: #3b82f6;
  --color-aprobado: #10b981;
  /* ... más colores */
}
```

## 💾 Almacenamiento de Datos

Los datos se guardan automáticamente en **localStorage** del navegador:
- Se guarda cada vez que cambiás el estado de un curso
- Persiste incluso si cerrás el navegador
- Es específico del navegador donde abrís el archivo

**Nota**: Si borrás los datos del navegador o usás modo incógnito, perdés el progreso. Hacé backups regulares con "Exportar Datos".

## 🌐 Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Conexión a internet **solo para**:
  - Cargar la fuente Google Fonts (opcional)
  - Librería html2canvas para exportar PNG

## 🔧 Solución de Problemas

### No se exporta la imagen
- Verificá tu conexión a internet (necesaria para html2canvas)
- Intentá refrescar la página (F5)

### Se perdieron mis datos
- Revisá si estás usando el mismo navegador
- Intentá importar un backup si tenés uno

### Los requisitos no se validan correctamente
- Verificá que los códigos de requisitos en `data.js` coincidan exactamente
- Los códigos son sensibles a mayúsculas/minúsculas

## 📝 Agregar Más Carreras

Para agregar una nueva carrera, editá `data.js`:

```javascript
const CARRERAS = {
  // ... carreras existentes ...
  
  nuevaCarrera: {
    nombre: "Nombre de la Carrera",
    codigo: "NC",
    descripcion: "Descripción",
    cursos: [
      // ... cursos ...
    ]
  }
};
```

Luego agregá un botón en `index.html`:

```html
<button class="tab-btn" data-carrera="nuevaCarrera">
  🎓 Nombre de la Carrera
</button>
```

## 📄 Licencia

Uso personal - Diego Dengo

---

**¡Mucho éxito con tus estudios! 🎓✨**
