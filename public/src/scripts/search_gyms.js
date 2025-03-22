document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const resultsContainer = document.getElementById('search-results');

    searchBar.addEventListener('input', function () {
        const query = this.value.trim();

        if (query.length < 1) {
            resultsContainer.innerHTML = '';
            return;
        }

        // Obtener token desde sessionStorage (ajusta según cómo lo tengas guardado)
        const token = AppStorage.getToken();
        
        fetch(`http://192.168.1.70:8081/gym/${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            resultsContainer.innerHTML = '';

            if (data.length === 0) {
                resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
                return;
            }

            const ul = document.createElement('ul');
            data.forEach(gym => {
                const li = document.createElement('li');
                li.textContent = gym.name;
                ul.appendChild(li);
            });
            resultsContainer.appendChild(ul);
        })
        .catch(error => {
            console.error('Error en la búsqueda:', error);
            resultsContainer.innerHTML = '<p>Error al cargar resultados.</p>';
        });
    });
});