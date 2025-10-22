document.addEventListener('DOMContentLoaded', () => {
    // Selectores adaptados a tu HTML final:
    const navLinks = document.querySelectorAll('.navegacion a'); // Usamos .navegacion a
    const appSections = document.querySelectorAll('.app-section'); // Usamos .app-section

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // 1. Obtener el ID de la sección objetivo (ej: "#about")
            const targetId = link.getAttribute('href'); 
            const targetSection = document.querySelector(targetId);

            // Verificar si el enlace es para la sección de contenido original (Pages)
            // Si el enlace es a #pages, y no tiene contenido propio, 
            // no hacemos nada para evitar errores si no se implementa esa sección.
            if (!targetSection) {
                 console.error(`Sección no encontrada para el ID: ${targetId}`);
                 return;
            }

            // 2. Ocultar todas las secciones y quitar la clase 'activo'
            appSections.forEach(section => {
                section.classList.remove('active-section');
            });
            document.querySelector('.navegacion a.activo')?.classList.remove('activo');
            
            // 3. Mostrar la sección objetivo y activar el enlace
            targetSection.classList.add('active-section');
            link.classList.add('activo');
        });
    });
    
    // Al cargar la página, asegúrate de que el primer enlace muestre su sección
    // Esto es crucial para la clase 'activo' y la visibilidad inicial
    const initialLink = document.querySelector('.navegacion a.activo');
    const initialSectionId = initialLink?.getAttribute('href');
    if (initialSectionId) {
        document.querySelector(initialSectionId)?.classList.add('active-section');
    }
});