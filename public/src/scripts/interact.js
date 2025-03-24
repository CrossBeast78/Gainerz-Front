function interact() {
    const interact = document.querySelector('.interact');
    const interactButton = document.querySelector('.interact-button');
    const interactClose = document.querySelector('.interact-close');
    const gymSearchInput = document.querySelector('.gym-search-input');
    const gymSearchButton = document.querySelector('.gym-search-button');
    const gymResultsContainer = document.querySelector('.gym-results-container');

    async function searchGymByName(name) {
        try {

            token = AppStorage.getToken();
            const response = await fetch(`http://192.168.1.129:8085/gyms?name=${name}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                    
                }
            });
            const data = await response.json();
            return data.gyms;
        } catch (error) {
            console.error('Error searching gym:', error);
            return [];
        }
    }

    interactButton.addEventListener('click', () => {
        interact.classList.add('active');
    });

    interactClose.addEventListener('click', () => {
        interact.classList.remove('active');
    });

    interact.addEventListener('click', (event) => {
        if (event.target === interact) {
            interact.classList.remove('active');
        }
    });

    gymSearchButton.addEventListener('click', async () => {
        const gymName = gymSearchInput.value;
        const gyms = await searchGymByName(gymName);
        gymResultsContainer.innerHTML = gyms.map(gym => `
            <div class="gym-result">
                <p>${gym.name}</p>
                <p>${gym.address}</p>
            </div>
        `).join('');
    });
}

document.addEventListener('DOMContentLoaded', interact);