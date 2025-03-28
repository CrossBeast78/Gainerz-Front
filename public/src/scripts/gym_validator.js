/**
 * Valida si un gimnasio tiene el equipamiento necesario para realizar una rutina
 * Revisa bloque por bloque y verifica si al menos un grupo de equipamiento está disponible
 */
function validateGymEquipment() {
    console.log('Validando equipamiento de gimnasio para la rutina actual...');
    
    try {
        // Verificar si tenemos la información necesaria
        if (!window.current_routine) {
            console.log('No hay una rutina seleccionada para validar');
            return false;
        }
        
        if (!window.gym_equipment || !Array.isArray(window.gym_equipment) || window.gym_equipment.length === 0) {
            console.log('No hay equipamiento de gimnasio seleccionado para validar');
            return false;
        }
        
        // Mapear IDs del equipamiento del gimnasio para facilitar búsquedas
        const gymEquipmentIds = window.gym_equipment.map(equipment => equipment.ID || '').filter(id => id);
        console.log('Equipamiento disponible en el gimnasio:', gymEquipmentIds);
        
        const incompatibleExercises = [];
        
        // Verificar cada bloque de ejercicios
        if (window.current_routine.blocks && Array.isArray(window.current_routine.blocks)) {
            window.current_routine.blocks.forEach(block => {
                try {
                    if (!block) {
                        console.log('Bloque no definido, saltando...');
                        return;
                    }
                    
                    // Imprimir el ID del bloque sin importar lo demás
                    const blockId = block.block_id || 'Sin ID';
                    console.log(`ID del bloque: ${blockId}`);
                    
                    if (!block.exercise_summary) {
                        console.log(`Bloque ${blockId}: No tiene exercise_summary, saltando...`);
                        return;
                    }
                    
                    const exerciseName = block.exercise_summary.name || 'Ejercicio sin nombre';
                    console.log(`Validando equipamiento para: ${exerciseName} (Block ID: ${blockId})`);
                    
                    // Obtener el equipamiento con verificaciones de seguridad
                    const exerciseEquipment = block.exercise_summary.equipment || [];
                    
                    if (!Array.isArray(exerciseEquipment) || exerciseEquipment.length === 0) {
                        console.log(`El ejercicio ${exerciseName} no requiere equipamiento específico`);
                        return; // Este ejercicio no requiere equipamiento, pasamos al siguiente
                    }
                    
                    // Verificar si al menos un grupo tiene el equipamiento completo
                    let isCompatible = false;
                    
                    exerciseEquipment.forEach(group => {
                        try {
                            // Verificar si este grupo es válido
                            if (!group) {
                                console.log('Grupo de equipamiento no válido');
                                return;
                            }
                            
                            // Mostrar el grupo
                            const groupId = group.group || 'Grupo sin ID';
                            console.log(`Analizando grupo: ${groupId}`);
                            
                            // Verificar si este grupo tiene equipamiento
                            const groupEquipment = group.equipment || [];
                            if (!Array.isArray(groupEquipment) || groupEquipment.length === 0) {
                                console.log(`Grupo ${groupId} no tiene equipamiento definido`);
                                return;
                            }
                            
                            // Mostrar los IDs del equipamiento
                            console.log(`Equipamiento del grupo ${groupId}:`, groupEquipment);
                            
                            // Verificar si todos los equipos del grupo están disponibles
                            // Usar un try/catch para evitar errores en la verificación
                            try {
                                const allEquipmentAvailable = groupEquipment.every(equipmentId => 
                                    gymEquipmentIds.includes(equipmentId || '')
                                );
                                
                                if (allEquipmentAvailable) {
                                    console.log(`Grupo ${groupId} compatible para ${exerciseName}`);
                                    isCompatible = true;
                                } else {
                                    const missingEquipment = groupEquipment.filter(id => !gymEquipmentIds.includes(id || ''));
                                    console.log(`Grupo ${groupId} NO compatible para ${exerciseName}`);
                                    console.log(`Equipamiento faltante:`, missingEquipment);
                                }
                            } catch (groupError) {
                                console.log(`Error al verificar compatibilidad del grupo ${groupId}:`, groupError.message);
                            }
                        } catch (groupError) {
                            console.log('Error procesando grupo de equipamiento:', groupError.message);
                        }
                    });
                    
                    if (!isCompatible) {
                        console.log(`El ejercicio ${exerciseName} NO es compatible con el equipamiento disponible`);
                        incompatibleExercises.push({
                            name: exerciseName,
                            muscle: block.exercise_summary.principal_muscle || 'Músculo no especificado',
                            blockId: blockId
                        });
                    } else {
                        console.log(`El ejercicio ${exerciseName} es compatible con el equipamiento disponible`);
                    }
                } catch (blockError) {
                    // Si hay un error procesando este bloque, simplemente seguimos con el siguiente
                    console.log(`Error procesando bloque:`, blockError.message);
                    if (block && block.block_id) {
                        console.log(`ID del bloque con error: ${block.block_id}`);
                    }
                }
            });
        } else {
            console.log('La rutina no tiene bloques de ejercicios para validar');
            return false;
        }
        
        // Mostrar resumen de compatibilidad
        if (incompatibleExercises.length > 0) {
            console.log('=== EJERCICIOS INCOMPATIBLES CON EL GIMNASIO ===');
            incompatibleExercises.forEach(exercise => {
                console.log(`${exercise.name} (${exercise.muscle}) - Block ID: ${exercise.blockId}`);
            });
            return false;
        } else {
            console.log('¡Todos los ejercicios son compatibles con el equipamiento del gimnasio!');
            return true;
        }
    } catch (error) {
        console.log('Error al validar el equipamiento del gimnasio:', error.message);
        return false;
    }
}

// Función para mostrar un mensaje en la interfaz
function showCompatibilityMessage(isCompatible) {
    // Buscar o crear el contenedor para mensajes
    let messageContainer = document.querySelector('.gym-compatibility-message');
    if (!messageContainer) {
        const gymSearchSection = document.querySelector('.gym-search-section');
        if (gymSearchSection) {
            messageContainer = document.createElement('div');
            messageContainer.className = 'gym-compatibility-message';
            gymSearchSection.after(messageContainer);
        }
    }
    
    // Si no hay contenedor, no podemos mostrar el mensaje
    if (!messageContainer) return;
    
    // Limpiar mensajes anteriores
    messageContainer.innerHTML = '';
    
    // Añadir el mensaje según la compatibilidad
    if (isCompatible) {
        messageContainer.innerHTML = `
            <div class="compatibility-success">
                <i class="fa-solid fa-check-circle"></i>
                <p>Esta rutina es compatible con el equipamiento del gimnasio seleccionado</p>
            </div>
        `;
    } else {
        messageContainer.innerHTML = `
            <div class="compatibility-warning">
                <i class="fa-solid fa-exclamation-triangle"></i>
                <p>Algunos ejercicios no son compatibles con el equipamiento disponible</p>
                <button class="show-details-btn">Ver detalles</button>
            </div>
        `;
        
        // Añadir evento para mostrar detalles
        const detailsButton = messageContainer.querySelector('.show-details-btn');
        if (detailsButton) {
            detailsButton.addEventListener('click', function() {
                console.log('Mostrando detalles de incompatibilidad...');
                // Aquí se podría mostrar un modal o expandir la información
            });
        }
    }
}

// Exportar funciones
window.validateGymEquipment = validateGymEquipment;
window.showCompatibilityMessage = showCompatibilityMessage;
