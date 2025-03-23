document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const resultsContainer = document.getElementById('search-results');

    searchBar.addEventListener('input', function () {
        const query = this.value.trim();

        if (query.length < 1) {
            resultsContainer.innerHTML = '';
            return;
        }

        // Obtener token desde tu almacenamiento
        const token = AppStorage.getToken();

        fetch(`http://192.168.1.119:8081/gym/${encodeURIComponent(query)}`, {
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

            console.log("Resultados encontrados:", data);

            if (!data || data.length === 0) {
                resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
                return;
            }

            data.forEach(gym => {
                const gymDiv = document.createElement('div');
                gymDiv.classList.add('gym-result');

                gymDiv.innerHTML = `
                    <h3>${gym.name}</h3>
                    <p><strong>Ubicación:</strong> ${gym.location || 'No disponible'}</p>
                    <p><strong>Teléfono:</strong> ${gym.phone || 'No disponible'}</p>
                    <p><strong>ID Gym:</strong> ${gym.id_gym || 'No disponible'}</p>
                `;

                resultsContainer.appendChild(gymDiv);
            });
        })
        .catch(error => {
            console.error('Error en la búsqueda:', error);
            resultsContainer.innerHTML = '<p>Error al cargar resultados.</p>';
        });
    });
});