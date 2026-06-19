// ===================================
// FUNCIONALIDAD DE EXPORTACIÓN A PNG
// ===================================

/**
 * Exporta la malla curricular actual como imagen PNG
 * Usa html2canvas desde CDN (incluido en index.html)
 */
async function exportarPNG() {
    try {
        // Mostrar mensaje de carga
        const btnExportar = document.getElementById('btn-exportar');
        const textoOriginal = btnExportar.innerHTML;
        btnExportar.innerHTML = '⏳ Generando...';
        btnExportar.disabled = true;

        // Seleccionar el contenedor a exportar
        const elemento = document.getElementById('export-area');

        if (!elemento) {
            throw new Error('Elemento no encontrado');
        }

        // Verificar que html2canvas esté disponible
        if (typeof html2canvas === 'undefined') {
            throw new Error('html2canvas no está cargado. Verificá tu conexión a internet.');
        }

        // Configuración para html2canvas
        const opciones = {
            backgroundColor: '#0f172a',
            scale: 2, // Mayor resolución
            logging: false,
            useCORS: true,
            allowTaint: true,
            windowWidth: elemento.scrollWidth,
            windowHeight: elemento.scrollHeight
        };

        // Generar canvas
        const canvas = await html2canvas(elemento, opciones);

        // Convertir a blob y descargar
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');

            // Nombre del archivo
            const carrera = CARRERAS[carreraActual].codigo;
            const fecha = new Date().toISOString().slice(0, 10);
            const progreso = getProgreso(carreraActual);

            a.href = url;
            a.download = `Plan_${carrera}_${progreso}%_${fecha}.png`;
            a.click();

            // Limpiar
            URL.revokeObjectURL(url);

            // Restaurar botón
            btnExportar.innerHTML = textoOriginal;
            btnExportar.disabled = false;

            // Notificación
            mostrarNotificacion('¡Imagen exportada exitosamente! 🎉', 'success');
        }, 'image/png');

    } catch (error) {
        console.error('Error al exportar PNG:', error);
        alert('Error al exportar la imagen: ' + error.message);

        // Restaurar botón
        const btnExportar = document.getElementById('btn-exportar');
        btnExportar.innerHTML = '📸 Exportar PNG';
        btnExportar.disabled = false;
    }
}

/**
 * Muestra una notificación temporal
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${tipo === 'success' ? 'var(--color-success)' : 'var(--color-primary)'};
    color: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    font-weight: 600;
  `;

    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

// Animaciones para notificaciones
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
