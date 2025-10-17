// Espera a que todo el contenido del documento esté listo
document.addEventListener("DOMContentLoaded", () => {
    console.log("Página cargada correctamente ✅");

    // Ejemplo opcional: marcar enlace activo en el menú
    const links = document.querySelectorAll(".navegacion a");

    links.forEach(link => {
        link.addEventListener("click", () => {
            // Quita la clase activa de todos los enlaces
            links.forEach(l => l.classList.remove("activo"));
            // Agrega la clase activa al enlace clicado
            link.classList.add("activo");
        });
    });
});
