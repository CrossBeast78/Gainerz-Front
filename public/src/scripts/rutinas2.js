

async function fetchRoutines() {
    const token = AppStorage.getToken();
    // Obtén el token desde Appstorage
    try {
        const response = await fetch('http://192.168.1.129:8085/routine', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }); // Reemplaza con tu endpoint real
        const data = await response.json();
        const routines = data.routines.map(routine => new rutinesummary(
            routine.routine_id,
            routine.name,
            routine.description,
            routine.muscles
        ));
        displayRoutines(routines);
    } catch (error) {
        console.error('Error fetching routines:', error);
    }
}

function displayRoutines(routines) {
    const routinesContainer = document.getElementById('routines-container');
    routinesContainer.innerHTML = routines.map(routine => `
        <div class="saved-rt">
            ${routine.get_routine_summary()}
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', fetchRoutines);