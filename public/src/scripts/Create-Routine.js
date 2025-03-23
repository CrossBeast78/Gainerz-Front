document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('searchInput');
    const suggestions = document.getElementById('suggestions');

    input.addEventListener('input', () => {
        const value = input.value.toLowerCase();
        const items = suggestions.querySelectorAll('li');

        let hasMatch = false;

        items.forEach(item => {
            if (item.textContent.toLowerCase().includes(value) && value !== '') {
                item.style.display = 'block';
                hasMatch = true;
            } else {
                item.style.display = 'none';
            }
        });

        // Muestra u oculta la lista según haya coincidencias
        suggestions.classList.toggle('d-none', !hasMatch);
    });

    // Rellenar el input al hacer clic en un elemento de la lista
    suggestions.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            input.value = e.target.textContent;
            suggestions.classList.add('d-none');
        }
    });

    // Ocultar la lista si se hace clic fuera
    document.addEventListener('click', (e) => {
        if (!suggestions.contains(e.target) && e.target !== input) {
            suggestions.classList.add('d-none');
        }
    });
});
