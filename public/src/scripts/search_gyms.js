document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const resultsContainer = document.getElementById('search-results');

    searchBar.addEventListener('input', function () {
        const query = this.value.trim();

        if (query.length < 1) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
            return;
        }

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
            resultsContainer.style.display = 'block';

            if (!data || data.length === 0) {
                resultsContainer.innerHTML = '<p class="no-results">No se encontraron resultados.</p>';
                return;
            }

            data.forEach(gym => {
                const gymDiv = document.createElement('div');
                gymDiv.classList.add('gym-card');

                gymDiv.innerHTML = `
                    <div class="gym-header">
                        <img src="${gym.Logo_link || 'https://via.placeholder.com/80'}" alt="Logo ${gym.Fullname}" class="gym-logo">
                        <h3 class="gym-name">${gym.Fullname}</h3>
                    </div>
                    <p><strong>Dirección:</strong> ${gym.Address || 'No disponible'}</p>
                    <p><strong>Email:</strong> ${gym.Email || 'No disponible'}</p>
                    <p><strong>Teléfono:</strong> ${gym.Phone || 'No disponible'}</p>
                    <p><strong>ID:</strong> ${gym.ID || 'No disponible'}</p>
                `;

                resultsContainer.appendChild(gymDiv);
            });
        })
        .catch(error => {
            console.error('Error en la búsqueda:', error);
            resultsContainer.innerHTML = '<p class="no-results">Error al cargar resultados.</p>';
        });
    });
});