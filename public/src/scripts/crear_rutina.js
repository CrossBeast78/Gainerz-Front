document.addEventListener('DOMContentLoaded', () => {
    console.log('Script de creación de rutinas cargado');

    // Primero definimos la función
    window.crearYEnviarRutina = function() {
        console.log('Iniciando proceso de creación de rutina...');

        try {
            // Obtener información del usuario desde sessionStorage
            if (!AppStorage.isLogged()) {
                throw new Error('No hay sesión activa. Por favor, inicia sesión para crear una rutina.');
            }

            const usuario = AppStorage.getUser();
            if (!usuario || !usuario.id || !usuario.name) {
                throw new Error('Información de usuario incompleta en la sesión.');
            }

            console.log('Usuario autenticado:', usuario.name);

            // Obtener datos del formulario
            const titulo = document.getElementById('title-input').value.trim();
            const descripcion = document.getElementById('desc-input').value.trim();
            
            // Validar datos básicos
            if (!titulo) {
                throw new Error('Por favor, ingresa un título para la rutina');
            }
            
            if (!descripcion) {
                throw new Error('Por favor, ingresa una descripción para la rutina');
            }

            // Obtener músculos seleccionados
            const musclesCheckboxes = document.querySelectorAll('.muscle-checkbox:checked');
            const musculos = Array.from(musclesCheckboxes).map(cb => cb.value);
            
            if (musculos.length === 0) {
                throw new Error('Por favor, selecciona al menos un músculo involucrado');
            }

            // Obtener bloques (ejercicios con sus series)
            const rutinaDiv = document.getElementById('rutina');
            if (!rutinaDiv || !window.rutinaActual || !window.rutinaActual.blocks || window.rutinaActual.blocks.length === 0) {
                throw new Error('Por favor, agrega al menos un ejercicio a la rutina');
            }

            // Crear objeto para la rutina
            const rutina = {
                routine_id: null,
                created_by: {
                    id: usuario.id,
                    name: usuario.name
                },
                creation_date: new Date().toISOString(),
                name: titulo,
                description: descripcion,
                muscles: musculos,
                blocks: window.rutinaActual.blocks
            };

            console.log('Datos de rutina recopilados:', rutina);

            // Validar con la clase Routine
            try {
                // Intentamos crear una instancia de Routine para validar la estructura
                new Routine(
                    rutina.routine_id,
                    rutina.created_by,
                    rutina.name,
                    rutina.description,
                    rutina.creation_date,
                    rutina.muscles,
                    rutina.blocks
                );
                console.log("================================")
                console.log('Rutina validada correctamente');
                
                // Enviar la rutina al servidor
                enviarRutinaAlServidor(rutina);
                
            } catch (validationError) {
                console.error('Error de validación:', validationError);
                alert(`Error de validación: ${validationError.message}`);
            }
        } catch (error) {
            console.error('Error al crear rutina:', error);
            alert(`Error: ${error.message}`);
        }
    };

    // Luego configuramos el evento para el botón
    const btnCrear = document.getElementById('btn-crear');
    if (btnCrear) {
        btnCrear.addEventListener('click', window.crearYEnviarRutina);
        console.log('Evento de creación de rutina configurado');
    } else {
        console.error('No se encontró el botón de crear rutina');
    }

    /**
     * Función para enviar la rutina al servidor
     */
    function enviarRutinaAlServidor(rutina) {
        console.log('Enviando rutina al servidor...');
        
        // Obtener token de autenticación
        const token = AppStorage.getToken();
        if (!token) {
            console.error('No hay token de autenticación disponible');
            alert('Error: No hay token de autenticación. Por favor, inicia sesión nuevamente.');
            return;
        }

        // Realizar la petición al servidor
        fetch('http://192.168.1.129:8085/routine', {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rutina)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
            }
            console.log('Respuesta del servidor:', response);
            return response.json();
        })
        .then(data => {
            
            console.log('Rutina creada exitosamente:', data);
            alert('¡Rutina creada con éxito!');
            
            // Limpiar el formulario o redirigir a otra página
            document.getElementById('title-input').value = '';
            document.getElementById('desc-input').value = '';
            
            // Desmarcar checkboxes de músculos
            document.querySelectorAll('.muscle-checkbox:checked').forEach(cb => {
                cb.checked = false;
            });
            
            // Limpiar bloques
            const rutinaDiv = document.getElementById('rutina');
            if (rutinaDiv) {
                rutinaDiv.innerHTML = '';
            }
            
            // Reiniciar la rutina actual
            window.rutinaActual = {
                id: null,
                title: "",
                description: "",
                muscles: [],
                blocks: []
            };
            
            // Actualizar la interfaz
            const dropdownButton = document.getElementById('dropdownMenuButton1');
            if (dropdownButton) {
                dropdownButton.textContent = 'Músculos Involucrados';
            }
            
            const selectedMusclesList = document.getElementById('selected-muscles-list');
            if (selectedMusclesList) {
                selectedMusclesList.innerHTML = '<p class="text-muted small mb-0">No hay músculos seleccionados</p>';
            }
        })
        .catch(error => {
            console.error('Error al enviar la rutina:', error);
            alert(`Error al enviar la rutina: ${error.message}`);
        });
    }
}); 