# 📝 Guía para Agregar Cursos

Ya eliminé todos los cursos de ejemplo. Ahora podés agregar los cursos reales siguiendo este formato.

## Formato de Curso

Abrí el archivo [data.js](file:///c:/Users/Diego%20Dengo/Archivos/DENGO/Aplicaciones_UCR/Antigravity/App Universitaria/data.js) y agregá cursos usando este formato:

```javascript
{
  codigo: "PC-4321",                    // Código del curso
  nombre: "Auditoría Financiera II",    // Nombre completo
  creditos: 4,                          // Cantidad de créditos
  nivel: 6,                             // Número de semestre (1-10)
  requisitos: ["PC-4001"],              // Array de códigos de requisitos
  estado: "no-cursado"                  // Dejar así (se cambia desde la UI)
}
```

## Ejemplo Completo

```javascript
contaduriaPublica: {
  nombre: "Contaduría Pública",
  codigo: "CP",
  descripcion: "Escuela de Administración - Universidad de Costa Rica",
  cursos: [
    // SEMESTRE 1
    {
      codigo: "EG-1",
      nombre: "Curso Integrado de Humanidades I",
      creditos: 6,
      nivel: 1,
      requisitos: [],
      estado: "no-cursado"
    },
    {
      codigo: "EF-",
      nombre: "Actividad Deportiva",
      creditos: 0,
      nivel: 1,
      requisitos: [],
      estado: "no-cursado"
    },
    // ... más cursos del Semestre 1
    
    // SEMESTRE 2
    {
      codigo: "EG-3",
      nombre: "Curso Integrado de Humanidades II",
      creditos: 6,
      nivel: 2,
      requisitos: ["EG-1"],
      estado: "no-cursado"
    },
    // ... más cursos
  ]
}
```

## Instrucciones

1. **Abrí** [data.js](file:///c:/Users/Diego%20Dengo/Archivos/DENGO/Aplicaciones_UCR/Antigravity/App Universitaria/data.js)

2. **Para Contaduría Pública:**
   - Ir a la línea donde dice `// Los cursos se agregarán aquí` (línea ~20)
   - Agregar todos los cursos siguiendo el formato

3. **Para Ingeniería Industrial:**
   - Ir a la línea donde dice `// Los cursos se agregarán aquí` (línea ~11)
   - Agregar todos los cursos siguiendo el formato

4. **Guardar** el archivo

5. **Recargar** la página (F5)

## Notas Importantes

- **nivel**: Debe ser un número de 1 a 10 (correspondiente al semestre)
- **requisitos**: Lista de códigos de cursos prerrequisitos
  - Si no tiene requisitos: `[]`
  - Un requisito: `["PC-0001"]`
  - Varios: `["PC-0001", "MA-1101", "DN-0101"]`
- **creditos**: Número entero
- **estado**: Siempre `"no-cursado"` al agregar un curso nuevo

## ¿Necesitás Ayuda?

Si querés, podés pasarme la lista de cursos (puede ser texto, tabla, o la imagen) y yo te ayudo a formatearlos correctamente.
