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
            resultsContainer.style.display = 'block';

            // Si la API devuelve un solo objeto en vez de un array


            const accounts = Array.isArray(data.results) ? data.results : [];

            console.log(accounts);

            if (!accounts || accounts.length === 0) {
                resultsContainer.innerHTML = '<p class="no-results">No se encontraron resultados.</p>';
                return;
            }

            accounts.forEach(account => {
                const accDiv = document.createElement('div');
                accDiv.classList.add('account-card');
            
                accDiv.innerHTML = `
                    <h3 class="account-name">${account.name}</h3>
                    <p><strong>Tipo de cuenta:</strong> ${account.account_type || 'No disponible'}</p>
                `;
            
                resultsContainer.appendChild(accDiv);
            });
        })
        .catch(error => {
            console.error('Error en la búsqueda:', error);
            resultsContainer.innerHTML = '<p class="no-results">Error al cargar resultados.</p>';
        });
    });
});