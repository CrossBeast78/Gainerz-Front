function interact(id) {
    console.log('Función interact llamada con ID:', id);
    
    // Obtener referencias a los elementos del DOM
    const interactModal = document.getElementById('interact_gym_search');
    console.log('Modal encontrado:', interactModal);
    
    const interactButton = document.querySelector('.interact-button');
    const interactClose = document.querySelector('.interact-close');
    const gymSearchButton = document.querySelector('.gym-search-button');
    const gymSearchInput = document.querySelector('.gym-search-input');
    const gymResultsContainer = document.querySelector('.gym-results-container');
    const interactSkip = document.querySelector('.interact-skip');
    const interactCancel = document.querySelector('.interact-button');

    async function searchGymByName(name) {
        try {
            const token = AppStorage.getToken();
            console.log('Buscando gimnasio con nombre:', name);
            const response = await fetch(`http://192.168.1.129:8081/gym/${name}`, {
                method: 'GET',
                headers: {
                    'token': `${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            console.log('Respuesta del servidor en búsqueda de gimnasio:', data);
            
            // Verificar que data sea un array o tenga la estructura esperada
            if (!data || (Array.isArray(data) && data.length === 0)) {
                console.log('No se encontraron gimnasios');
                return [];
            }
            
            return data;
        } catch (error) {
            console.error('Error searching gym:', error);
            return [];
        }
    }

    // Mostrar el modal
    if (interactModal) {
        interactModal.style.display = 'flex';
        console.log('Modal mostrado para rutina:', id);
    } else {
        console.error('No se encontró el elemento interact_gym_search');
    }

    // Remover event listeners anteriores si existen
    if (interactClose) {
        interactClose.removeEventListener('click', () => {});
        interactClose.addEventListener('click', () => {
            console.log('Cerrando modal desde botón close');
            interactModal.style.display = 'none';
        });
    }

    if (interactModal) {
        interactModal.removeEventListener('click', () => {});
        interactModal.addEventListener('click', (event) => {
            if (event.target === interactModal) {
                console.log('Cerrando modal desde click fuera');
                interactModal.style.display = 'none';
            }
        });
    }

    // Manejar el botón de omitir
    if (interactSkip) {
        interactSkip.removeEventListener('click', () => {});
        interactSkip.addEventListener('click', () => {
            console.log('Omitiendo selección de gimnasio');
            interactModal.style.display = 'none';
            window.interact_gym = null; // Limpiar la selección
            window.interact_gym_equipment = null;
            window.gym_equipment = null; // Limpiar también esta variable
            get_routine(id); // Llamar a get_routine con el ID de la rutina
        });
    }

    // Manejar el botón de cancelar
    if (interactCancel) {
        interactCancel.removeEventListener('click', () => {});
        interactCancel.addEventListener('click', () => {
            console.log('Cancelando interacción');
            interactModal.style.display = 'none';
            window.interact_gym = null; // Limpiar la selección
            window.gym_equipment = null; // Limpiar también esta variable
        });
    }

    if (gymSearchButton && gymSearchInput && gymResultsContainer) {
        gymSearchButton.removeEventListener('click', () => {});
        gymSearchButton.addEventListener('click', async () => {
            const gymName = gymSearchInput.value;
            console.log('Buscando gimnasio:', gymName);
            const gyms = await searchGymByName(gymName);
            console.log('Gimnasios encontrados:', gyms);
            if (Array.isArray(gyms)) {
                gymResultsContainer.innerHTML = gyms.map(gym => `
                    <div class="gym-result" onclick="window.interact_gym_func('${gym.ID}')">
                        <p>${gym.Fullname}</p>
                        <p>${gym.Address}</p>
                    </div>
                `).join('');
            } else {
                gymResultsContainer.innerHTML = '<p>No se encontraron gimnasios</p>';
            }
        });
    }
}

window.interact_gym = null;
window.interact_gym_equipment = null;
window.gym_equipment = null;
window.incompatible_exercises = []; // Nuevo array para almacenar IDs de ejercicios incompatibles

// Variables globales para guardar el estado
window.previous_content = null;

function interact_gym_fetch(gym_id){
    const token = AppStorage.getToken();
    
    console.log('Obteniendo equipamiento para gym_id:', gym_id);
    
    fetch('http://192.168.1.129:8085/gym/equipment', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'id_gym': gym_id,
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Equipamiento del gimnasio recibido:', data);
        
        // Procesar el equipamiento recibido - ahora sabemos que son strings (IDs)
        if (data && data.equipment && Array.isArray(data.equipment)) {
            // Filtrar valores undefined o null
            const validEquipment = data.equipment.filter(item => item !== undefined && item !== null);
            
            // Guardar en variables globales
            window.interact_gym_equipment = validEquipment;
            window.gym_equipment = validEquipment;
            
            console.log('Equipo guardado correctamente. Cantidad:', validEquipment.length);
            console.log('Equipamiento disponible (IDs):', validEquipment.join(', '));
            
            // Verificar si hay rutina cargada
            if (window.current_routine && window.current_routine.blocks) {
                console.log('Rutina detectada, verificando compatibilidad...');
                
                // Forzar a cero el array de incompatibles antes de identificar
                window.incompatible_exercises = [];
                
                // Identificar ejercicios incompatibles
                window.identifyIncompatibleExercises();
                
                // Forzar refresco inmediato de la vista con un breve retraso
                setTimeout(() => {
                    console.log('Refrescando vista con nuevos datos de compatibilidad');
                    window.refreshExerciseBlocks();
                }, 200);
            } else {
                console.log('No hay rutina cargada para verificar compatibilidad');
            }
            
        } else {
            console.error('La respuesta no contiene un array de equipamiento válido');
            window.interact_gym_equipment = [];
            window.gym_equipment = [];
            
            // Limpiar lista de incompatibles
            window.incompatible_exercises = [];
        }
    })
    .catch(error => {
        console.error('Error al obtener el equipamiento:', error);
        window.interact_gym_equipment = [];
        window.gym_equipment = [];
        window.incompatible_exercises = [];
    });
}

// Nueva función para identificar ejercicios incompatibles
window.identifyIncompatibleExercises = function() {
    console.log('Identificando ejercicios incompatibles');
    
    // Limpiar array de incompatibles
    window.incompatible_exercises = [];
    
    if (!window.current_routine || !window.current_routine.blocks) {
        console.log('No hay rutina para verificar compatibilidad');
        return;
    }
    
    if (!window.gym_equipment || !Array.isArray(window.gym_equipment)) {
        console.log('No hay equipo de gimnasio para verificar compatibilidad');
        return;
    }
    
    // Filtrar cualquier equipo undefined o null
    const validGymEquipment = window.gym_equipment.filter(item => item !== undefined && item !== null);
    
    if (validGymEquipment.length === 0) {
        console.log('No hay equipo válido de gimnasio para verificar compatibilidad');
        return;
    }
    
    console.log('Equipo válido para verificar (IDs):', validGymEquipment.join(', '));
    
    // Recorrer todos los bloques y encontrar incompatibles
    window.current_routine.blocks.forEach(block => {
        // Si ya está marcado como necesita reemplazo, mantenerlo
        if (block.needs_replacement) {
            window.incompatible_exercises.push(block.block_id);
            return;
        }
        
        // Verificar compatibilidad de equipamiento
        if (block.equipment_needed && Array.isArray(block.equipment_needed)) {
            // Ahora comparamos IDs directamente
            const missingEquipment = block.equipment_needed.filter(equipmentId => 
                !validGymEquipment.includes(equipmentId)
            );
            
            const isCompatible = missingEquipment.length === 0;
            
            if (!isCompatible) {
                window.incompatible_exercises.push(block.block_id);
                block.missingEquipment = missingEquipment; // Guardar el equipo que falta
                console.log(`Ejercicio ${block.exercise_summary?.name || 'sin nombre'} es incompatible. Equipo faltante (IDs): ${missingEquipment.join(', ')}`);
            }
        }
    });
    
    // Extra logging para depuración
    window.current_routine.blocks.forEach(block => {
        if (window.incompatible_exercises.includes(block.block_id)) {
            console.log(`Ejercicio marcado como incompatible: ${block.exercise_summary?.name || 'sin nombre'} (${block.block_id})`);
            console.log('Equipo que falta (IDs):', block.missingEquipment || 'No especificado');
        }
    });
    
    console.log('Ejercicios incompatibles identificados:', window.incompatible_exercises);
    
    // Forzar refresco inmediato si hay incompatibles
    if (window.incompatible_exercises.length > 0) {
        window.refreshExerciseBlocks();
    }
}

window.interact_gym_func = function(gym_id) {
    console.log("gym_id seleccionado = ", gym_id);
    window.interact_gym = gym_id;
    interact_gym_fetch(gym_id);
    
    // Cerrar el modal después de seleccionar un gimnasio
    const interactModal = document.getElementById('interact_gym_search');
    if (interactModal) {
        interactModal.style.display = 'none';
        console.log('Modal cerrado después de seleccionar gimnasio:', gym_id);
    }
}

window.interact = interact;

// Asegurarse de que el modal esté oculto inicialmente
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando modal');
    const interactModal = document.getElementById('interact_gym_search');
    if (interactModal) {
        interactModal.style.display = 'none';
        console.log('Modal inicializado como oculto');
    } else {
        console.error('No se encontró el elemento interact_gym_search al cargar el DOM');
    }
});

function get_routine(routine_id){
    const token = AppStorage.getToken();
    console.log('Obteniendo rutina con ID:', routine_id);
    
    fetch(`http://192.168.1.129:8085/routine/${routine_id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Rutina obtenida:', data);
        // Guardar la rutina en window
        window.current_routine = data.routine;
        
        // Limpiar lista de ejercicios incompatibles al cargar una nueva rutina
        window.incompatible_exercises = [];
        
        // Identificar ejercicios incompatibles si ya hay un gimnasio seleccionado
        if (window.gym_equipment && Array.isArray(window.gym_equipment)) {
            window.identifyIncompatibleExercises();
        }
        
        // Guardar el contenido actual
        const mainContent = document.querySelector('.content');
        window.previous_content = mainContent.innerHTML;
        
        // Refrescar bloques para mostrar la rutina
        window.refreshExerciseBlocks();
    })
    .catch(error => {
        console.error('Error al obtener la rutina:', error);
    });
}

// Función para restaurar el contenido anterior
window.restorePreviousContent = function() {
    if (window.previous_content) {
        const mainContent = document.querySelector('.content');
        mainContent.innerHTML = window.previous_content;
        window.previous_content = null;
    }
}

// Funciones para mostrar la rutina
async function showRoutineModal(routine_id) {
    console.log('Mostrando rutina para ID:', routine_id);
    const token = AppStorage.getToken();
    
    try {
        const response = await fetch(`http://192.168.1.129:8085/routine/${routine_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener la rutina');
        }
        
        const data = await response.json();
        console.log('Rutina obtenida:', data);
        
        // Guardar la rutina en window
        window.current_routine = data.routine;
        
        // Limpiar lista de ejercicios incompatibles al cargar una nueva rutina
        window.incompatible_exercises = [];
        
        // Identificar ejercicios incompatibles si ya hay un gimnasio seleccionado
        if (window.gym_equipment && Array.isArray(window.gym_equipment)) {
            window.identifyIncompatibleExercises();
        }
        
        // Guardar el contenido actual
        const mainContent = document.querySelector('.content');
        window.previous_content = mainContent.innerHTML;
        
        // Refrescar bloques para mostrar la rutina
        window.refreshExerciseBlocks();
        
    } catch (error) {
        console.error('Error al obtener la rutina:', error);
    }
}

// Hacer disponible la función showRoutineModal globalmente
window.showRoutineModal = showRoutineModal;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando modales');
    const routineModal = document.getElementById('interact_routine_modal');
    if (routineModal) {
        routineModal.style.display = 'none';
        console.log('Modal de rutina inicializado como oculto');
    } else {
        console.error('No se encontró el modal de rutina al cargar el DOM');
    }
});

// Agregar al inicio del archivo, después de las declaraciones de window
window.openGymSearch = function() {
    console.log('Abriendo modal de búsqueda de gimnasio');
    
    // Obtener referencias a los elementos del DOM
    const interactModal = document.getElementById('interact_gym_search');
    const interactButton = document.querySelector('.interact-button');
    const interactClose = document.querySelector('.interact-close');
    const gymSearchButton = document.querySelector('.gym-search-button');
    const gymSearchInput = document.querySelector('.gym-search-input');
    const gymResultsContainer = document.querySelector('.gym-results-container');
    const interactSkip = document.querySelector('.interact-skip');
    const interactCancel = document.querySelector('.interact-button');
    
    async function searchGymByName(name) {
        try {
            const token = AppStorage.getToken();
            const response = await fetch(`http://192.168.1.129:8081/gym/${name}`, {
                method: 'GET',
                headers: {
                    'token': `${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log('Respuesta del servidor:', data);
            return data;
        } catch (error) {
            console.error('Error searching gym:', error);
            return [];
        }
    }

    // Mostrar el modal
    if (interactModal) {
        interactModal.style.display = 'flex';
        console.log('Modal de búsqueda de gimnasio mostrado');
    }

    // Remover event listeners anteriores si existen
    if (interactClose) {
        interactClose.removeEventListener('click', closeModal);
        interactClose.addEventListener('click', closeModal);
    }

    // Función para cerrar el modal
    function closeModal() {
        console.log('Cerrando modal desde botón close');
        interactModal.style.display = 'none';
    }

    if (interactModal) {
        interactModal.removeEventListener('click', closeModalOutside);
        interactModal.addEventListener('click', closeModalOutside);
    }

    // Función para cerrar el modal al hacer clic fuera
    function closeModalOutside(event) {
        if (event.target === interactModal) {
            console.log('Cerrando modal desde click fuera');
            interactModal.style.display = 'none';
        }
    }

    // Manejar el botón de omitir
    if (interactSkip) {
        interactSkip.removeEventListener('click', skipGymSelection);
        interactSkip.addEventListener('click', skipGymSelection);
    }

    // Función para omitir selección de gimnasio
    function skipGymSelection() {
        console.log('Omitiendo selección de gimnasio');
        interactModal.style.display = 'none';
        window.interact_gym = null; // Limpiar la selección
        window.interact_gym_equipment = null;
        window.gym_equipment = null; // Limpiar también esta variable
    }

    // Manejar el botón de cancelar
    if (interactCancel) {
        interactCancel.removeEventListener('click', cancelInteraction);
        interactCancel.addEventListener('click', cancelInteraction);
    }

    // Función para cancelar interacción
    function cancelInteraction() {
        console.log('Cancelando interacción');
        interactModal.style.display = 'none';
        window.interact_gym = null; // Limpiar la selección
        window.gym_equipment = null; // Limpiar también esta variable
    }

    // Manejar la búsqueda de gimnasios
    if (gymSearchButton && gymSearchInput && gymResultsContainer) {
        gymSearchButton.removeEventListener('click', searchGym);
        gymSearchButton.addEventListener('click', searchGym);
    }

    // Función para buscar gimnasios
    async function searchGym() {
        const gymName = gymSearchInput.value;
        console.log('Buscando gimnasio:', gymName);
        const gyms = await searchGymByName(gymName);
        console.log('Gimnasios encontrados:', gyms);
        if (Array.isArray(gyms)) {
            gymResultsContainer.innerHTML = gyms.map(gym => `
                <div class="gym-result" onclick="window.interact_gym_func('${gym.ID}')">
                    <p>${gym.Fullname}</p>
                    <p>${gym.Address}</p>
                </div>
            `).join('');
        } else {
            gymResultsContainer.innerHTML = '<p>No se encontraron gimnasios</p>';
        }
    }
}

// Modal para mostrar ejercicios similares
let similarExercisesModal = null;
let currentSelectedExerciseId = null;

// Función para crear el modal de ejercicios similares
function createSimilarExercisesModal() {
    // Verificar si ya existe
    if (document.getElementById('similar_exercises_modal')) {
        return document.getElementById('similar_exercises_modal');
    }
    
    // Crear estructura del modal
    const modal = document.createElement('div');
    modal.className = 'interact';
    modal.id = 'similar_exercises_modal';
    modal.style.display = 'none';
    
    modal.innerHTML = `
        <div class="interact-content">
            <div class="interact-header">
                <h2 class="squada-one-regular">Ejercicios similares</h2>
                <button class="similar-close"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="interact-body">
                <div class="similar-exercises-container">
                    <!-- Aquí se mostrarán los ejercicios similares -->
                </div>
            </div>
            <div class="interact-footer">
                <button class="similar-cancel">Cancelar</button>
            </div>
        </div>
    `;
    
    // Agregar al body
    document.body.appendChild(modal);
    
    // Configurar event listeners
    const closeBtn = modal.querySelector('.similar-close');
    const cancelBtn = modal.querySelector('.similar-cancel');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    return modal;
}

// Función para mostrar los ejercicios similares en el modal
function showSimilarExercisesInModal(similarExercises, blockId) {
    console.log('Mostrando modal de ejercicios similares');
    console.log('similarExercises:', JSON.stringify(similarExercises));
    console.log('blockId:', blockId);
    
    // Crear o obtener el modal
    const modal = createSimilarExercisesModal();
    const container = modal.querySelector('.similar-exercises-container');
    
    // Guardar el ID del ejercicio actual
    currentSelectedExerciseId = blockId;
    
    // Limpiar contenido anterior
    container.innerHTML = '';
    
    // Verificar si hay ejercicios similares
    if (!similarExercises || !Array.isArray(similarExercises) || similarExercises.length === 0) {
        console.log('No hay ejercicios similares para mostrar');
        container.innerHTML = '<p class="no-similar">No se encontraron ejercicios similares</p>';
        modal.style.display = 'flex';
        return;
    }
    
    console.log('Cantidad de ejercicios similares:', similarExercises.length);
    
    // Mostrar hasta 3 ejercicios similares
    const exercisesToShow = similarExercises.slice(0, 3);
    console.log('Ejercicios a mostrar:', JSON.stringify(exercisesToShow));
    
    // Crear HTML para cada ejercicio similar
    exercisesToShow.forEach((exercise, index) => {
        console.log(`Procesando ejercicio similar #${index + 1}:`, exercise);
        
        // Verificar si el ejercicio tiene las propiedades necesarias
        if (!exercise || !exercise.name) {
            console.error('Ejercicio inválido:', exercise);
            return;
        }
        
        const exerciseElement = document.createElement('div');
        exerciseElement.className = 'similar-exercise';
        
        // Safely access properties with fallbacks
        const name = exercise.name || 'Nombre no disponible';
        const muscle = exercise.principal_muscle || 'No especificado';
        const equipment = Array.isArray(exercise.equipment_needed) ? 
                          exercise.equipment_needed.join(', ') : 
                          (exercise.equipment_needed || 'Ninguno');
        const description = exercise.description || '';
        const id = exercise.id || '';
        
        console.log(`Ejercicio #${index + 1} - Nombre: ${name}, Músculo: ${muscle}, Equipo: ${equipment}`);
        
        exerciseElement.innerHTML = `
            <div class="similar-exercise-info">
                <h3>${name}</h3>
                <p>Músculo principal: ${muscle}</p>
                <p>Equipo necesario: ${equipment}</p>
                <p>${description}</p>
            </div>
            <button class="select-similar-btn" data-exercise-id="${id}">Seleccionar</button>
        `;
        
        container.appendChild(exerciseElement);
        console.log(`Ejercicio #${index + 1} añadido al container`);
        
        // Agregar event listener al botón
        const selectBtn = exerciseElement.querySelector('.select-similar-btn');
        selectBtn.addEventListener('click', () => {
            console.log(`Seleccionado ejercicio similar: ${name} (ID: ${id})`);
            
            // Cerrar el modal
            modal.style.display = 'none';
            
            // Aplicar el ejercicio seleccionado
            applySelectedSimilarExercise(exercise, blockId);
        });
    });
    
    // Mostrar el modal
    modal.style.display = 'flex';
    console.log('Modal de ejercicios similares mostrado');
}

// Función para aplicar el ejercicio similar seleccionado
function applySelectedSimilarExercise(selectedExercise, blockId) {
    console.log('Aplicando ejercicio similar seleccionado');
    
    // Verificar si tenemos la rutina
    if (!window.current_routine || !window.current_routine.blocks) {
        console.log('No hay una rutina seleccionada para reemplazar ejercicio');
        return;
    }
    
    // Buscar el bloque por su ID
    const blockIndex = window.current_routine.blocks.findIndex(b => b.block_id === blockId);
    if (blockIndex === -1) {
        console.log('No se encontró el bloque con ID:', blockId);
        return;
    }
    
    const block = window.current_routine.blocks[blockIndex];
    
    // Guardar el ejercicio anterior para referencia
    const previousExercise = block.exercise_summary.name;
    
    // Reemplazar la información del ejercicio
    block.exercise_summary = selectedExercise;
    block.exercise_id = selectedExercise.id;
    block.equipment_needed = selectedExercise.equipment_needed || [];
    block.needs_replacement = false;
    
    // Remover de la lista de incompatibles
    const incompatibleIndex = window.incompatible_exercises.indexOf(blockId);
    if (incompatibleIndex !== -1) {
        window.incompatible_exercises.splice(incompatibleIndex, 1);
    }
    
    // Verificar compatibilidad con el gimnasio seleccionado
    if (window.gym_equipment && Array.isArray(window.gym_equipment)) {
        window.identifyIncompatibleExercises();
    }
    
    // Mostrar mensaje de éxito
    alert(`Ejercicio "${previousExercise}" reemplazado por "${selectedExercise.name}"`);
    
    // Refrescar vista
    window.refreshExerciseBlocks();
}

// Función para reemplazar un ejercicio
window.replaceExercise = function(blockId) {
    console.log('Reemplazando ejercicio con block_id:', blockId);
    
    // Verificar si tenemos la rutina
    if (!window.current_routine || !window.current_routine.blocks) {
        console.log('No hay una rutina seleccionada para reemplazar ejercicio');
        return;
    }
    
    // Buscar el bloque por su ID
    const block = window.current_routine.blocks.find(b => b.block_id === blockId);
    if (!block) {
        console.log('No se encontró el bloque con ID:', blockId);
        return;
    }
    
    // Imprimir más información para depuración
    console.log('Estructura completa del bloque:', JSON.stringify(block));
    
    if (block.exercise_summary) {
        console.log('Propiedades de exercise_summary:', Object.keys(block.exercise_summary));
        console.log('Contenido de exercise_summary:', JSON.stringify(block.exercise_summary));
    }
    
    // Marcar el bloque como que necesita reemplazo
    block.needs_replacement = true;
    
    // Añadir a la lista de incompatibles si no está ya
    if (!window.incompatible_exercises.includes(blockId)) {
        window.incompatible_exercises.push(blockId);
    }
    
    // Mostrar información del bloque actual
    console.log('Bloque a reemplazar:', block);
    console.log('Ejercicio actual:', block.exercise_summary ? block.exercise_summary.name : 'Desconocido');
    console.log('Músculo principal:', block.exercise_summary ? block.exercise_summary.principal_muscle : 'Desconocido');
    
    // Obtener ejercicios similares
    let exerciseId = null;
    
    // De la captura de pantalla vemos que la propiedad disponible es exercise_id dentro de exercise_summary
    if (block.exercise_summary && block.exercise_summary.exercise_id) {
        exerciseId = block.exercise_summary.exercise_id;
        console.log('Usando exercise_summary.exercise_id del bloque:', exerciseId);
    }
    
    // Si no está ahí, revisar si está directamente en el bloque
    if (!exerciseId && block.exercise_id) {
        exerciseId = block.exercise_id;
        console.log('Usando exercise_id del bloque:', exerciseId);
    }
    
    // Si tampoco está ahí, buscar otras propiedades que podrían contener el ID
    if (!exerciseId && block.exercise_summary) {
        for (let key in block.exercise_summary) {
            if (key.toLowerCase().includes('id')) {
                exerciseId = block.exercise_summary[key];
                console.log(`Encontrado posible ID en exercise_summary.${key}:`, exerciseId);
                break;
            }
        }
    }
    
    // Si todavía no encontramos, verificar si hay alguna propiedad que se llame "id"
    if (!exerciseId && block.exercise_summary && block.exercise_summary.id) {
        exerciseId = block.exercise_summary.id;
        console.log('Usando exercise_summary.id del bloque:', exerciseId);
    }
    
    if (!exerciseId) {
        console.error('ID de ejercicio no disponible');
        alert('No se puede buscar ejercicios similares: ID de ejercicio no disponible');
        return;
    }
    
    // Si tenemos equipo de gimnasio seleccionado, usamos la función con filtro de equipo
    if (window.gym_equipment && Array.isArray(window.gym_equipment)) {
        console.log('Buscando ejercicios similares con filtro de equipo');
        
        // Usar directamente los IDs del equipamiento del gimnasio
        const equipmentIds = window.gym_equipment.filter(id => id !== undefined && id !== null);
        
        if (equipmentIds.length > 0) {
            console.log('Usando IDs de equipamiento para filtrar similares:', equipmentIds);
            
            window.getSimilarExercisesWithEquipment(exerciseId, equipmentIds)
                .then(data => {
                    console.log('Resultado de ejercicios similares con equipo:', data);
                    
                    // Verificar que data.similar_exercises existe y tiene elementos
                    if (data && data.similar_exercises && Array.isArray(data.similar_exercises) && data.similar_exercises.length > 0) {
                        // Mostrar los ejercicios similares en el modal
                        showSimilarExercisesInModal(data.similar_exercises, blockId);
                    } else {
                        alert('No se encontraron ejercicios similares compatibles con tu gimnasio.');
                    }
                })
                .catch(error => {
                    console.error('Error al obtener ejercicios similares:', error);
                    alert('Error al buscar ejercicios similares. Inténtalo de nuevo.');
                });
        } else {
            console.warn('No hay IDs de equipamiento válidos para filtrar, usando búsqueda sin filtro');
            useFallbackSearch();
        }
    } else {
        // Si no hay gimnasio seleccionado, usamos la búsqueda simple
        useFallbackSearch();
    }
    
    // Función auxiliar para la búsqueda sin filtro
    function useFallbackSearch() {
        console.log('Buscando ejercicios similares sin filtro de equipo');
        
        window.getSimilarExercises(exerciseId)
            .then(data => {
                console.log('Resultado de ejercicios similares:', data);
                
                // Verificar que data.similar_exercises existe y tiene elementos
                if (data && data.similar_exercises && Array.isArray(data.similar_exercises) && data.similar_exercises.length > 0) {
                    // Mostrar los ejercicios similares en el modal
                    showSimilarExercisesInModal(data.similar_exercises, blockId);
                } else {
                    alert('No se encontraron ejercicios similares.');
                }
            })
            .catch(error => {
                console.error('Error al obtener ejercicios similares:', error);
                alert('Error al buscar ejercicios similares. Inténtalo de nuevo.');
            });
    }
};

// Asegurar que se crea el modal al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Código existente para inicializar otros modales...
    
    // Inicializar el modal de ejercicios similares
    similarExercisesModal = createSimilarExercisesModal();
});

// Función para aplicar estilos a los botones incompatibles
window.markIncompatibleButtons = function() {
    console.log('Marcando botones incompatibles automáticamente');
    
    // Verificar si hay una rutina y un gimnasio seleccionado
    if (!window.current_routine || !window.current_routine.blocks) {
        console.log('No hay rutina para marcar compatibilidad');
        return;
    }
    
    if (!window.gym_equipment || !Array.isArray(window.gym_equipment)) {
        console.log('No hay equipo de gimnasio para verificar compatibilidad');
        return;
    }
    
    // Filtrar cualquier equipo undefined o null
    const validGymEquipment = window.gym_equipment.filter(item => item !== undefined && item !== null);
    
    if (validGymEquipment.length === 0) {
        console.log('No hay equipo válido de gimnasio para verificar compatibilidad de botones');
        return;
    }
    
    const exerciseBlocks = document.querySelectorAll('.exercise-block');
    
    // Recorrer todos los bloques de la rutina
    window.current_routine.blocks.forEach((block, index) => {
        // Verificar si el bloque tiene equipamiento necesario
        if (block.equipment_needed && Array.isArray(block.equipment_needed) && index < exerciseBlocks.length) {
            
            // Buscar el equipo que falta - comparamos IDs directamente
            const missingEquipment = block.equipment_needed.filter(equipmentId => 
                !validGymEquipment.includes(equipmentId)
            );
            
            const isCompatible = missingEquipment.length === 0;
            
            // Obtener el botón y la información del ejercicio
            const blockElement = exerciseBlocks[index];
            const replaceBtn = blockElement.querySelector('.exercise-replace-btn');
            const exerciseInfo = blockElement.querySelector('.exercise-info');
            
            // Aplicar estilos si el ejercicio es incompatible
            if (!isCompatible && replaceBtn) {
                console.log(`Ejercicio ${block.exercise_summary?.name || 'sin nombre'} es incompatible. Equipo faltante (IDs): ${missingEquipment.join(', ')}`);
                
                // Aplicar estilos directamente al botón
                replaceBtn.style.backgroundColor = '#f1c40f';
                replaceBtn.style.color = '#2c3e50';
                replaceBtn.style.fontWeight = 'bold';
                
                // Añadir la clase para estilos CSS
                replaceBtn.classList.add('incompatible');
                
                // Actualizar el mensaje de incompatibilidad
                if (exerciseInfo) {
                    // Eliminar mensaje anterior si existe
                    const existingMessage = exerciseInfo.querySelector('.incompatible-message');
                    if (existingMessage) {
                        existingMessage.remove();
                    }
                    
                    // Crear nuevo mensaje
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'incompatible-message';
                    messageDiv.innerHTML = `
                        <p><i class="fas fa-exclamation-triangle"></i> Equipamiento incompatible (IDs): ${missingEquipment.join(', ')}</p>
                    `;
                    exerciseInfo.appendChild(messageDiv);
                }
            } else if (replaceBtn) {
                // Quitar estilos si el ejercicio es compatible
                replaceBtn.style.backgroundColor = '';
                replaceBtn.style.color = '';
                replaceBtn.style.fontWeight = '';
                replaceBtn.classList.remove('incompatible');
                
                // Quitar mensaje de incompatibilidad si existe
                if (exerciseInfo) {
                    const existingMessage = exerciseInfo.querySelector('.incompatible-message');
                    if (existingMessage) {
                        existingMessage.remove();
                    }
                }
            }
        }
    });
}

// Nueva función para refrescar completamente los bloques de ejercicios
window.refreshExerciseBlocks = function() {
    console.log('Refrescando bloques de ejercicios');
    
    if (!window.current_routine || !window.current_routine.blocks) {
        console.log('No hay rutina para refrescar');
        return;
    }
    
    const mainContent = document.querySelector('.content');
    if (!mainContent) {
        console.log('No se encontró el contenedor principal');
        return;
    }
    
    // Guardar el estado actual de la página antes de refrescar
    const currentScroll = window.scrollY;
    
    // Log del estado actual de incompatibles antes de regenerar HTML
    console.log('Estado de incompatibles antes de regenerar HTML:', JSON.stringify(window.incompatible_exercises));
    
    // Regenerar todo el HTML de la rutina
    let routineHTML = `
        <div class="routine-content">
    `;
    
    routineHTML += `
        <div class="routine-header">
            <h1 class="header1">${window.current_routine.name}</h1>
            <p class="header2">${window.current_routine.description}</p>
            <p class="header2">Músculos: ${window.current_routine.muscles.join(', ')}</p>
            <div class="gym-search-section">
                <p class="gym-search-text">¿Deseas ajustar tu rutina al equipo disponible en tu gym?</p>
                <button class="gym-search-btn" onclick="window.openGymSearch()">
                    Busca tu gimnasio
                </button>
            </div>
            <div class="routine-divider"></div>
        </div>
    `;
    
    window.current_routine.blocks.forEach(block => {
        // Verificar si este ejercicio está en la lista de incompatibles
        const isIncompatible = window.incompatible_exercises.includes(block.block_id);
        console.log(`Verificando ejercicio ${block.exercise_summary?.name || 'Desconocido'} (${block.block_id}): incompatible = ${isIncompatible}`);
        
        const compatibilityClass = isIncompatible ? "incompatible" : "";
        let incompatibleMessage = "";
        
        // Generar mensaje de incompatibilidad si es necesario
        if (isIncompatible) {
            if (block.missingEquipment && block.missingEquipment.length > 0) {
                incompatibleMessage = `
                    <div class="incompatible-message">
                        <p><i class="fa-solid fa-exclamation-triangle"></i> Equipamiento no disponible (IDs): ${block.missingEquipment.join(', ')}</p>
                    </div>
                `;
                console.log(`Mensaje para ${block.exercise_summary?.name || 'Desconocido'}: Equipamiento no disponible (IDs): ${block.missingEquipment.join(', ')}`);
            } else {
                incompatibleMessage = `
                    <div class="incompatible-message">
                        <p><i class="fa-solid fa-exclamation-triangle"></i> Este ejercicio necesita ser reemplazado</p>
                    </div>
                `;
                console.log(`Mensaje para ${block.exercise_summary?.name || 'Desconocido'}: Necesita ser reemplazado`);
            }
        }
        
        routineHTML += `
            <div class="exercise-block" data-block-id="${block.block_id}" data-incompatible="${isIncompatible}">
                <div class="exercise-header">
                    <div class="exercise-info">
                        <h2 class="header3">${block.exercise_summary?.name || 'Ejercicio sin nombre'}</h2>
                        <p class="exercise-muscle">Músculo principal: ${block.exercise_summary?.principal_muscle || 'No especificado'}</p>
                        ${incompatibleMessage}
                    </div>
                    <button class="exercise-replace-btn ${compatibilityClass}" onclick="replaceExercise('${block.block_id}')" 
                        style="${isIncompatible ? 'background-color:#f1c40f; color:#2c3e50; font-weight:bold;' : ''}">
                        <i class="fa-solid fa-exchange-alt"></i> Reemplazar
                    </button>
                </div>
                <div class="exercise-divider"></div>
                <div class="exercise-series">
                    ${block.sets && Array.isArray(block.sets) ? block.sets.map(set => `
                        <div class="serie-item">
                            <div class="serie-header">
                                <input type="checkbox" class="serie-checkbox">
                                <h3 class="header4">${set.type || 'Serie'}</h3>
                            </div>
                            <div class="serie-content">
                                <p class="serie-description">${set.description || ''}</p>
                                ${set.reps ? `<p class="serie-range">Repeticiones: ${set.reps}</p>` : ''}
                                ${set.weight ? `<p class="serie-range">Peso: ${set.weight}</p>` : ''}
                                ${set.time ? `<p class="serie-range">Tiempo: ${set.time}</p>` : ''}
                            </div>
                        </div>
                    `).join('') : '<p>No hay series definidas</p>'}
                </div>
            </div>
        `;
    });
    
    routineHTML += `
            <div class="routine-actions">
                <button class="routine-back-btn" onclick="window.restorePreviousContent()">
                    <i class="fa-solid fa-arrow-left"></i> Volver
                </button>
            </div>
        </div>
    `;
    
    // Actualizar el contenido
    mainContent.innerHTML = routineHTML;
    
    // Restaurar la posición de desplazamiento
    window.scrollTo(0, currentScroll);
    
    // Verificación adicional después de actualizar el DOM
    setTimeout(() => {
        console.log('Verificando elementos en el DOM después del refresco:');
        const blocks = document.querySelectorAll('.exercise-block');
        blocks.forEach(block => {
            const blockId = block.getAttribute('data-block-id');
            const isIncompatible = block.getAttribute('data-incompatible') === 'true';
            const replaceBtn = block.querySelector('.exercise-replace-btn');
            console.log(`Bloque ${blockId}: incompatible=${isIncompatible}, clase=${replaceBtn ? replaceBtn.className : 'no button'}`);
        });
    }, 100);
    
    console.log('Bloques de ejercicios refrescados correctamente');
}

// Modificar también la función de obtener ejercicios similares para usar IDs de equipo
window.getSimilarExercisesWithEquipment = async function(exerciseId, equipmentIds) {
    const token = AppStorage.getToken();
    console.log('Buscando ejercicios similares con filtro de equipo');
    console.log('ID de ejercicio:', exerciseId);
    console.log('IDs de equipamiento:', equipmentIds);
    
    try {
        const response = await fetch(`http://192.168.1.129:8085/exercise/similar/${exerciseId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                equipment: equipmentIds // Enviar directamente el array de IDs
            })
        });
        
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor: ' + response.status);
        }
        
        const data = await response.json();
        console.log('Datos de ejercicios similares recibidos:', data);
        return data;
    } catch (error) {
        console.error('Error al obtener ejercicios similares con equipo:', error);
        throw error;
    }
};