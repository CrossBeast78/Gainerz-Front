// router.js - Maneja la navegación entre páginas sin recargar

// Mapeo de rutas y archivos HTML
const routes = {
    "login": "login.html",
    "register": "register.html",
    "index": "index.html",
    "calendario": "calendario.html"
};

// Función para cargar contenido dinámico
function navigateTo(page) {
    if (routes[page]) {
        window.location.href = routes[page];
    } else {
        console.error("Página no encontrada");
    }
}

// Detectar clicks en los enlaces de navegación
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".navLink").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const page = link.getAttribute("href").replace(".html", "");
            navigateTo(page);
        });
    });
});