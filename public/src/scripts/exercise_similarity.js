/**
 * Funciones para obtener ejercicios similares
 */

/**
 * Obtiene ejercicios similares sin filtrar por equipamiento
 * @param {string} exerciseId - ID del ejercicio para buscar similares
 * @returns {Promise} - Promesa con el resultado de la búsqueda
 */
async function getSimilarExercises(exerciseId) {
    try {
        const token = AppStorage.getToken();
        console.log('Buscando ejercicios similares para ID:', exerciseId);
        
        // Crear una promesa con timeout
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout: La solicitud ha excedido el tiempo de espera')), 10000);
        });
        
        // Validar que el ID no sea undefined
        if (!exerciseId) {
            throw new Error('ID de ejercicio no válido');
        }
        
        // Función de fetch original
        const fetchPromise = fetch(`http://192.168.1.129:8082/exercise/similarity/${exerciseId}`, {
            method: 'GET',
            headers: {
                'token': `${token}`
            }
        });
        
        // Race entre el fetch y el timeout
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (response.status === 404) {
            console.log('No se encontraron ejercicios similares (404)');
            return { similar_exercises: [] };
        }
        
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Ejercicios similares obtenidos:', data);
        
        // Asegurar que retornamos un objeto con similar_exercises como array
        if (!data.similar_exercises) {
            return { similar_exercises: data && Array.isArray(data) ? data : [] };
        }
        
        return data;
    } catch (error) {
        console.error('Error al obtener ejercicios similares:', error);
        // Retornar un objeto con array vacío en caso de error
        return { similar_exercises: [] };
    }
}

async function getSimilarExercisesWithEquipment(exerciseId, availableEquipment) {
    try {
        const token = AppStorage.getToken();
        console.log('Buscando ejercicios similares con equipo para ID:', exerciseId);
        console.log('Equipamiento disponible:', availableEquipment);
        
        // Crear una promesa con timeout
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout: La solicitud ha excedido el tiempo de espera')), 10000);
        });
        
        // Validar que el ID no sea undefined
        if (!exerciseId) {
            throw new Error('ID de ejercicio no válido');
        }
        
        // Función de fetch original
        const fetchPromise = fetch(`http://192.168.1.129:8082/exercise/similarity/${exerciseId}`, {
            method: 'PUT',
            headers: {
                'token': `${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                equipment: availableEquipment
            })
        });

        console.log(JSON.stringify({
            equipment: availableEquipment
        }));
        
        // Race entre el fetch y el timeout
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (response.status === 404) {
            console.log('No se encontraron ejercicios similares (404)');
            return { similar_exercises: [] };
        }
        
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Ejercicios similares con equipo obtenidos:', data);
        
        // Asegurar que retornamos un objeto con similar_exercises como array
        if (!data.similar_exercises) {
            return { similar_exercises: data && Array.isArray(data) ? data : [] };
        }
        
        return data;
    } catch (error) {
        console.error('Error al obtener ejercicios similares con equipo:', error);
        // Retornar un objeto con array vacío en caso de error
        return { similar_exercises: [] };
    }
}

// Exportar las funciones al objeto global window
window.getSimilarExercises = getSimilarExercises;
window.getSimilarExercisesWithEquipment = getSimilarExercisesWithEquipment; 