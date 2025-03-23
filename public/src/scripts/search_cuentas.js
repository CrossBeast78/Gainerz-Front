document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const resultsContainer = document.getElementById('search-results');

    searchBar.addEventListener('input', function () {
        const query = this.value.trim();

        if (query.length < 1) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none'; // Oculta los resultados si el campo está vacío
            return;
        }

        // Obtener token desde sessionStorage (según tu lógica actual)
        const token = AppStorage.getToken();
        console.log(token);

        fetch(`http://192.168.1.128:8080/account/${encodeURIComponent(query)}`, {
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

            // Mostrar el contenedor de resultados
            resultsContainer.style.display = 'block';

            if (!data || data.length === 0) {
                resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
                return;
            }

            // Crear elemento dinámico para cada resultado
            data.forEach(account => {
                const divResult = document.createElement('div');
                divResult.classList.add('result-item');

                divResult.innerHTML = `
                    <h3>${account.name}</h3>
                    <p><strong>Email:</strong> ${account.email || 'No disponible'}</p>
                    <p><strong>ID Cuenta:</strong> ${account.id_account || 'No disponible'}</p>
                `;

                resultsContainer.appendChild(divResult);
            });
        })
        .catch(error => {
            console.error('Error en la búsqueda:', error);
            resultsContainer.innerHTML = '<p>Error al cargar resultados.</p>';
            resultsContainer.style.display = 'block';
        });
    });
});