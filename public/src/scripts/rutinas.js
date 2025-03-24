document.addEventListener('DOMContentLoaded', () => {
    const abrirBtn = document.getElementById('abrir-modal');
    const contentDiv = document.querySelector('.content');
    const originalContent = contentDiv.innerHTML;

    let rutinaActual = null;

    // Variable para almacenar el bloque actual al que se le añadirá la serie
    let bloqueActualId = null;

    const crearRutinaHTML = `
        <div class="crear-rutina content2">
            <div class="new-rt">
                <div style="display: flex; flex-direction: row;">
                    <div style="display: flex; flex-direction: column; width: 70%;">
                        <input class="title-input squada-one-regular" id="title-input" type="text" placeholder="Agrega un título a tu rutina">
                        <textarea class="desc-input ubuntu-condensed-regular" id="desc-input" placeholder="Agrega una descripción breve"></textarea>
                    </div>
                    <div class="dropdown ubuntu-condensed-regular">
                        <button class="btn btn-secondary dropdown-toggle menu" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Músculos Involucrados
                        </button>
                        <ul class="dropdown-menu muscles-menu" aria-labelledby="dropdownMenuButton1">
                            <li class="dropdown-header">Selecciona los músculos:</li>
                            <li>
                                <div class="form-check dropdown-item">
                                    <input class="form-check-input muscle-checkbox" type="checkbox" value="Pecho" id="muscle-pecho">
                                    <label class="form-check-label" for="muscle-pecho">Pecho</label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check dropdown-item">
                                    <input class="form-check-input muscle-checkbox" type="checkbox" value="Espalda" id="muscle-espalda">
                                    <label class="form-check-label" for="muscle-espalda">Espalda</label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check dropdown-item">
                                    <input class="form-check-input muscle-checkbox" type="checkbox" value="Hombros" id="muscle-hombros">
                                    <label class="form-check-label" for="muscle-hombros">Hombros</label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check dropdown-item">
                                    <input class="form-check-input muscle-checkbox" type="checkbox" value="Bíceps" id="muscle-biceps">
                                    <label class="form-check-label" for="muscle-biceps">Bíceps</label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check dropdown-item">
                                    <input class="form-check-input muscle-checkbox" type="checkbox" value="Tríceps" id="muscle-triceps">
                                    <label class="form-check-label" for="muscle-triceps">Tríceps</label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check dropdown-item">
                                    <input class="form-check-input muscle-checkbox" type="checkbox" value="Antebrazo" id="muscle-antebrazo">
                                    <label class="form-check-label" for="muscle-antebrazo">Antebrazo</label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check dropdown-item">
                                    <input class="form-check-input muscle-checkbox" type="checkbox" value="Cuádriceps" id="muscle-cuadriceps">
                                    <label class="form-check-label" for="muscle-cuadriceps">Cuádriceps</label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check dropdown-item">
                                    <input class="form-check-input muscle-checkbox" type="checkbox" value="Isquiotibiales" id="muscle-isquios">
                                    <label class="form-check-label" for="muscle-isquios">Isquiotibiales</label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check dropdown-item">
                                    <input class="form-check-input muscle-checkbox" type="checkbox" value="Gemelos" id="muscle-gemelos">
                                    <label class="form-check-label" for="muscle-gemelos">Gemelos</label>
                                </div>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li class="dropdown-header">Músculos seleccionados:</li>
                            <li id="selected-muscles-list" class="px-3 py-2">
                                <p class="text-muted small mb-0">No hay músculos seleccionados</p>
                            </li>
                        </ul>
                        <div class="create">
                            <i class="fa-solid fa-circle-plus add-rt"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div style="width: 100%">
                <div class="add-ejercicios armar">
                    <h1 class="squada-one-regular">Ejercicios</h1>
                    <div id="rutina">
                        <!-- Aquí se agregarán bloques de ejercicios -->
                    </div>
                </div>
            </div>
            <div class="botones squada-one-regular">
                <button class="btn-rtns btn-crear" id="btn-crear" onclick="crearYEnviarRutina()">CREAR</button>
                <button class="btn-rtns btn-cancelar" id="btn-cancelar">CANCELAR</button>
            </div>
        </div>
        <div id="modal-ejercicio" class="modal-overlay" style="display: none;">
            <div class="modal-content">
                <h1 class="squada-one-regular">New Block</h1>
                <h2 class="squada-one-regular">Agregar Ejercicios:</h2>
                <div class="botones squada-one-regular">
                <input class="form-control ubuntu-condensed-regular" list="datalistOptions" id="exampleDataList" placeholder="Type to search...">
                <datalist id="datalistOptions"></datalist>
                <div id="busqueda-ejercicios" style="max-height: 300px; overflow-y: auto; margin-top: 10px;">
                    <!-- Aquí se agregarán bloques de ejercicios -->
                </div>
                <span id="cerrar-modal-ej" class="cerrar-x">&times;</span>
                </div>
            </div>
        </div>
        
        <!-- Modal para agregar series -->
        <div id="modal-series" class="modal-overlay" style="display: none;">
            <div class="modal-content">
                <h1 class="squada-one-regular">Nueva Serie</h1>
                
                <div class="form-group mb-3">
                    <label class="squada-one-regular">Tipo de Serie:</label>
                    <select id="tipo-serie" class="form-control ubuntu-condensed-regular">
                        <option value="">Selecciona un tipo</option>
                        <option value="normal_set">Serie Normal</option>
                        <option value="dropset">Dropset</option>
                        <option value="rest_pause_set">Rest-Pause</option>
                        <option value="rir_set">RIR</option>
                    </select>
                </div>
                
                <!-- Formulario para Serie Normal -->
                <div id="form-normal-set" class="serie-form" style="display: none;">
                    <div class="form-group mb-3">
                        <label class="ubuntu-condensed-regular">Número de Serie:</label>
                        <input type="number" id="normal-num" class="form-control" disabled>
                    </div>
                    <div class="form-group mb-3">
                        <label class="ubuntu-condensed-regular">Descripción:</label>
                        <input type="text" id="normal-desc" class="form-control" placeholder="Descripción opcional">
                    </div>
                    <div class="form-group mb-3">
                        <label class="ubuntu-condensed-regular">Rango de Repeticiones:</label>
                        <div class="d-flex gap-2">
                            <div class="flex-grow-1">
                                <label class="ubuntu-condensed-regular">Mínimo:</label>
                                <input type="number" id="normal-reps-min" class="form-control" min="1" value="8">
                            </div>
                            <div class="flex-grow-1">
                                <label class="ubuntu-condensed-regular">Máximo:</label>
                                <input type="number" id="normal-reps-max" class="form-control" min="1" value="12">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Formulario para Dropset -->
                <div id="form-dropset" class="serie-form" style="display: none;">
                    <div class="form-group mb-3">
                        <label class="ubuntu-condensed-regular">Número de Serie:</label>
                        <input type="number" id="dropset-num" class="form-control" disabled>
                    </div>
                    <div class="form-group mb-3">
                        <label class="ubuntu-condensed-regular">Descripción:</label>
                        <input type="text" id="dropset-desc" class="form-control" placeholder="Descripción opcional">
                    </div>
                    <div id="dropset-subsets">
                        <div class="subset mb-3">
                            <h3 class="ubuntu-condensed-regular">Sub-Serie 1:</h3>
                            <div class="form-group mb-2">
                                <label class="ubuntu-condensed-regular">Repeticiones:</label>
                                <input type="number" class="form-control dropset-reps" min="1" value="12">
                            </div>
                            <div class="form-group mb-2">
                                <label class="ubuntu-condensed-regular">Porcentaje de peso (%):</label>
                                <input type="number" class="form-control dropset-weight" min="0" max="100" value="100">
                            </div>
                        </div>
                    </div>
                    <button type="button" id="add-subset" class="btn btn-sm btn-primary ubuntu-condensed-regular">+ Añadir Sub-Serie</button>
                </div>
                
                <!-- Formulario para Rest-Pause -->
                <div id="form-rest-pause" class="serie-form" style="display: none;">
                    <div class="form-group mb-3">
                        <label class="ubuntu-condensed-regular">Número de Serie:</label>
                        <input type="number" id="restpause-num" class="form-control" disabled>
                    </div>
                    <div class="form-group mb-3">
                        <label class="ubuntu-condensed-regular">Descripción:</label>
                        <input type="text" id="restpause-desc" class="form-control" placeholder="Descripción opcional">
                    </div>
                    <div class="form-group mb-3">
                        <label class="ubuntu-condensed-regular">Descanso entre sub-series (segundos):</label>
                        <input type="number" id="restpause-rest" class="form-control" min="1" value="15">
                    </div>
                    <div id="restpause-subsets">
                        <div class="subset mb-3">
                            <h3 class="ubuntu-condensed-regular">Sub-Serie 1:</h3>
                            <div class="form-group mb-2">
                                <label class="ubuntu-condensed-regular">Repeticiones:</label>
                                <input type="number" class="form-control restpause-reps" min="1" value="8">
                            </div>
                        </div>
                    </div>
                    <button type="button" id="add-restpause-subset" class="btn btn-sm btn-primary ubuntu-condensed-regular">+ Añadir Sub-Serie</button>
                </div>
                
                <!-- Formulario para RIR -->
                <div id="form-rir" class="serie-form" style="display: none;">
                    <div class="form-group mb-3">
                        <label class="ubuntu-condensed-regular">Número de Serie:</label>
                        <input type="number" id="rir-num" class="form-control" disabled>
                    </div>
                    <div class="form-group mb-3">
                        <label class="ubuntu-condensed-regular">Descripción:</label>
                        <input type="text" id="rir-desc" class="form-control" placeholder="Descripción opcional">
                    </div>
                    <div class="form-group mb-3">
                        <label class="ubuntu-condensed-regular">Rango RIR:</label>
                        <div class="d-flex gap-2">
                            <div class="flex-grow-1">
                                <label class="ubuntu-condensed-regular">Mínimo:</label>
                                <input type="number" id="rir-range-min" class="form-control" min="0" value="1">
                            </div>
                            <div class="flex-grow-1">
                                <label class="ubuntu-condensed-regular">Máximo:</label>
                                <input type="number" id="rir-range-max" class="form-control" min="0" value="2">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="botones squada-one-regular mt-3">
                    <button id="btn-crear-serie" class="btn-rtns btn-crear">CREAR</button>
                    <button id="btn-cancelar-serie" class="btn-rtns btn-cancelar">CANCELAR</button>
                </div>
                
                <span id="cerrar-modal-series" class="cerrar-x">&times;</span>
            </div>
        </div>
    `;

    // Función para crear una rutina vacía
    function crearRutinaVacia() {
        contentDiv.innerHTML = crearRutinaHTML;
        
        // Inicializar una rutina vacía
        window.rutinaActual = {
            id: null,
            title: "",
            description: "",
            muscles: [], // Array para almacenar los músculos seleccionados
            blocks: []
        };
        
        console.log("Rutina vacía creada:", rutinaActual);
        
        // Configurar botones y eventos
        configurarEventosRutina();
    }
    
    // Función para configurar los eventos en la pantalla de rutina
    function configurarEventosRutina() {
        const cancelarBtn = document.getElementById('btn-cancelar');
        cancelarBtn.addEventListener('click', () => {
            contentDiv.innerHTML = originalContent;
            rutinaActual = null;
            location.reload();
        });

        const botonAgregar = document.querySelector('.add-rt');
        const modal = document.getElementById('modal-ejercicio');
        const cerrarModal = () => modal.style.display = 'none';

        // Configurar botón para agregar bloque
        botonAgregar.addEventListener('click', () => {
            window.mostrarModalEjercicio();
        });

        // Cerrar modal
        document.getElementById('cerrar-modal-ej').addEventListener('click', cerrarModal);
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'modal-ejercicio') cerrarModal();
        });
        
        // Configurar eventos para los checkboxes de músculos
        const muscleCheckboxes = document.querySelectorAll('.muscle-checkbox');
        
        // Función para actualizar el array de músculos
        function actualizarMusclesArray() {
            // Obtener todos los checkboxes seleccionados
            const checkedMuscles = document.querySelectorAll('.muscle-checkbox:checked');
            
            // Extraer los valores (nombres de músculos) y guardarlos en el array
            window.rutinaActual.muscles = Array.from(checkedMuscles).map(checkbox => checkbox.value);
            
            console.log("Músculos seleccionados:", window.rutinaActual.muscles);
            
            // Actualizar el texto del botón del dropdown
            const dropdownButton = document.getElementById('dropdownMenuButton1');
            if (window.rutinaActual.muscles.length > 0) {
                dropdownButton.textContent = `Músculos: ${window.rutinaActual.muscles.length}`;
            } else {
                dropdownButton.textContent = 'Músculos Involucrados';
            }
            
            // Actualizar la visualización de músculos seleccionados
            const selectedMusclesList = document.getElementById('selected-muscles-list');
            if (selectedMusclesList) {
                // Limpiar el contenido actual
                selectedMusclesList.innerHTML = '';
                
                // Si no hay músculos seleccionados, mostrar un mensaje
                if (window.rutinaActual.muscles.length === 0) {
                    selectedMusclesList.innerHTML = '<p class="text-muted small mb-0">No hay músculos seleccionados</p>';
                    return;
                }
                
                // Crear badges para cada músculo seleccionado
                window.rutinaActual.muscles.forEach(muscle => {
                    const badge = document.createElement('span');
                    badge.className = 'badge bg-primary me-1 mb-1 d-inline-block';
                    badge.textContent = muscle;
                    selectedMusclesList.appendChild(badge);
                });
            }
        }
        
        // Llamar a la función una vez al inicio para mostrar el estado inicial
        actualizarMusclesArray();
        
        // Asignar evento a cada checkbox para actualizar el array cuando cambie
        muscleCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                // Evitar que el dropdown se cierre al hacer clic en los checkboxes
                e.stopPropagation();
                actualizarMusclesArray();
            });
        });

        // Evitar que los clics en la sección de músculos cierren el dropdown
        document.querySelectorAll('.dropdown-item.form-check').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        // Configurar eventos del modal de series
        const modalSeries = document.getElementById('modal-series');
        const tipoSerieSelect = document.getElementById('tipo-serie');
        const formNormalSet = document.getElementById('form-normal-set');
        const formDropset = document.getElementById('form-dropset');
        const formRestPause = document.getElementById('form-rest-pause');
        const formRIR = document.getElementById('form-rir');
        
        // Mostrar el formulario correcto según el tipo de serie seleccionado
        tipoSerieSelect.addEventListener('change', function() {
            // Ocultar todos los formularios
            formNormalSet.style.display = 'none';
            formDropset.style.display = 'none';
            formRestPause.style.display = 'none';
            formRIR.style.display = 'none';
            
            // Mostrar el formulario correspondiente
            switch(this.value) {
                case 'normal_set':
                    formNormalSet.style.display = 'block';
                    break;
                case 'dropset':
                    formDropset.style.display = 'block';
                    break;
                case 'rest_pause_set':
                    formRestPause.style.display = 'block';
                    break;
                case 'rir_set':
                    formRIR.style.display = 'block';
                    break;
            }
        });
        
        // Botones para añadir subsets a dropsets y rest-pause
        document.getElementById('add-subset').addEventListener('click', function() {
            const subsets = document.getElementById('dropset-subsets');
            const subsetCount = subsets.children.length + 1;
            
            const newSubset = document.createElement('div');
            newSubset.className = 'subset mb-3';
            newSubset.innerHTML = `
                <h3 class="ubuntu-condensed-regular">Sub-Serie ${subsetCount}:</h3>
                <div class="form-group mb-2">
                    <label class="ubuntu-condensed-regular">Repeticiones:</label>
                    <input type="number" class="form-control dropset-reps" min="1" value="10">
                </div>
                <div class="form-group mb-2">
                    <label class="ubuntu-condensed-regular">Porcentaje de peso (%):</label>
                    <input type="number" class="form-control dropset-weight" min="0" max="100" value="${100 - subsetCount * 20}">
                </div>
                <button type="button" class="btn btn-sm btn-danger remove-subset">- Eliminar</button>
            `;
            
            subsets.appendChild(newSubset);
            
            // Agregar evento para eliminar subset
            newSubset.querySelector('.remove-subset').addEventListener('click', function() {
                subsets.removeChild(newSubset);
                // Renumerar subsets
                const allSubsets = subsets.children;
                for (let i = 0; i < allSubsets.length; i++) {
                    allSubsets[i].querySelector('h3').textContent = `Sub-Serie ${i + 1}:`;
                }
            });
        });
        
        document.getElementById('add-restpause-subset').addEventListener('click', function() {
            const subsets = document.getElementById('restpause-subsets');
            const subsetCount = subsets.children.length + 1;
            
            const newSubset = document.createElement('div');
            newSubset.className = 'subset mb-3';
            newSubset.innerHTML = `
                <h3 class="ubuntu-condensed-regular">Sub-Serie ${subsetCount}:</h3>
                <div class="form-group mb-2">
                    <label class="ubuntu-condensed-regular">Repeticiones:</label>
                    <input type="number" class="form-control restpause-reps" min="1" value="6">
                </div>
                <button type="button" class="btn btn-sm btn-danger remove-subset">- Eliminar</button>
            `;
            
            subsets.appendChild(newSubset);
            
            // Agregar evento para eliminar subset
            newSubset.querySelector('.remove-subset').addEventListener('click', function() {
                subsets.removeChild(newSubset);
                // Renumerar subsets
                const allSubsets = subsets.children;
                for (let i = 0; i < allSubsets.length; i++) {
                    allSubsets[i].querySelector('h3').textContent = `Sub-Serie ${i + 1}:`;
                }
            });
        });
        
        // Cerrar modal de series
        document.getElementById('cerrar-modal-series').addEventListener('click', () => {
            modalSeries.style.display = 'none';
        });
        modalSeries.addEventListener('click', (e) => {
            if (e.target.id === 'modal-series') modalSeries.style.display = 'none';
        });
        document.getElementById('btn-cancelar-serie').addEventListener('click', () => {
            modalSeries.style.display = 'none';
        });
        
        // Botón de crear serie
        document.getElementById('btn-crear-serie').addEventListener('click', function() {
            const tipoSerie = tipoSerieSelect.value;
            let nuevaSerie;
            
            if (!bloqueActualId) {
                console.error("No hay ID de bloque guardado");
                alert("Error: No se pudo determinar el bloque al que pertenece la serie");
                return;
            }
            
            // Obtener el bloque correspondiente
            const bloque = encontrarBloquePorId(bloqueActualId);
            if (!bloque) {
                console.error("No se pudo encontrar el bloque:", bloqueActualId);
                alert("Error: No se pudo encontrar el bloque");
                return;
            }
            
            try {
                switch(tipoSerie) {
                    case 'normal_set':
                        const numNormal = parseInt(document.getElementById('normal-num').value);
                        const descNormal = document.getElementById('normal-desc').value;
                        const repsMinNormal = parseInt(document.getElementById('normal-reps-min').value);
                        const repsMaxNormal = parseInt(document.getElementById('normal-reps-max').value);
                        const repsRangeNormal = [repsMinNormal, repsMaxNormal];
                        
                        nuevaSerie = new NormalSet(numNormal, descNormal, repsRangeNormal);
                        break;
                        
                    case 'dropset':
                        numeroSerie = parseInt(document.getElementById('dropset-num').value);
                        descripcion = document.getElementById('dropset-desc').value || '';
                        const subsetsDropset = [];
                        
                        const dropsetSubsets = document.querySelectorAll('#dropset-subsets .subset');
                        dropsetSubsets.forEach(subset => {
                            const reps = parseInt(subset.querySelector('.dropset-reps').value);
                            const weight = parseFloat(subset.querySelector('.dropset-weight').value);
                            subsetsDropset.push([reps, weight]);
                        });
                        
                        if (subsetsDropset.length === 0) {
                            throw new Error("Debes añadir al menos un subset para el dropset");
                        }
                        
                        nuevaSerie = new Dropset(numeroSerie, descripcion, subsetsDropset);
                        break;
                        
                    case 'rest_pause_set':
                        numeroSerie = parseInt(document.getElementById('restpause-num').value);
                        descripcion = document.getElementById('restpause-desc').value || '';
                        const restTime = parseInt(document.getElementById('restpause-rest').value);
                        
                        // Contar el número de sub-series
                        const restPauseSubsets = document.querySelectorAll('#restpause-subsets .subset');
                        
                        // Verificar que haya al menos una sub-serie
                        if (restPauseSubsets.length === 0) {
                            throw new Error("Debe haber al menos una sub-serie");
                        }
                        
                        // Obtener el número de sub-series (no un array)
                        const numSubSets = restPauseSubsets.length;
                        
                        console.log("Número de sub-series de Rest-Pause:", numSubSets);
                        nuevaSerie = new RestPauseSet(numeroSerie, descripcion, restTime, numSubSets);
                        break;
                        
                    case 'rir_set':
                        numeroSerie = parseInt(document.getElementById('rir-num').value);
                        descripcion = document.getElementById('rir-desc').value || '';
                        const rirMin = parseInt(document.getElementById('rir-range-min').value);
                        const rirMax = parseInt(document.getElementById('rir-range-max').value);
                        const rirRange = [rirMin, rirMax];
                        
                        nuevaSerie = new RIRSet(numeroSerie, descripcion, rirRange);
                        break;
                        
                    default:
                        alert('Por favor, selecciona un tipo de serie');
                        return;
                }
                
                // Agregar la serie al bloque correspondiente
                bloque.addSet(nuevaSerie);
                
                // Actualizar toda la interfaz para reflejar los cambios
                actualizarInterfazRutina();
                
                // Ocultar el modal y resetear el formulario
                modalSeries.style.display = 'none';
                resetearFormularioSeries();
            } catch (error) {
                alert(`Error al crear la serie: ${error.message}`);
            }
        });
        
        // Función para resetear el formulario de series
        function resetearFormularioSeries() {
            tipoSerieSelect.value = '';
            
            // Ocultar todos los formularios
            formNormalSet.style.display = 'none';
            formDropset.style.display = 'none';
            formRestPause.style.display = 'none';
            formRIR.style.display = 'none';
            
            // Resetear campos
            document.getElementById('normal-num').value = '1';
            document.getElementById('normal-desc').value = '';
            document.getElementById('normal-reps-min').value = '8';
            document.getElementById('normal-reps-max').value = '12';
            
            document.getElementById('dropset-num').value = '1';
            document.getElementById('dropset-desc').value = '';
            
            document.getElementById('restpause-num').value = '1';
            document.getElementById('restpause-desc').value = '';
            document.getElementById('restpause-rest').value = '15';
            
            document.getElementById('rir-num').value = '1';
            document.getElementById('rir-desc').value = '';
            document.getElementById('rir-range-min').value = '1';
            document.getElementById('rir-range-max').value = '2';
            
            // Resetear subsets
            document.getElementById('dropset-subsets').innerHTML = `
                <div class="subset mb-3">
                    <h3 class="ubuntu-condensed-regular">Sub-Serie 1:</h3>
                    <div class="form-group mb-2">
                        <label class="ubuntu-condensed-regular">Repeticiones:</label>
                        <input type="number" class="form-control dropset-reps" min="1" value="12">
                    </div>
                    <div class="form-group mb-2">
                        <label class="ubuntu-condensed-regular">Porcentaje de peso (%):</label>
                        <input type="number" class="form-control dropset-weight" min="0" max="100" value="100">
                    </div>
                </div>
            `;
            
            document.getElementById('restpause-subsets').innerHTML = `
                <div class="subset mb-3">
                    <h3 class="ubuntu-condensed-regular">Sub-Serie 1:</h3>
                    <div class="form-group mb-2">
                        <label class="ubuntu-condensed-regular">Repeticiones:</label>
                        <input type="number" class="form-control restpause-reps" min="1" value="8">
                    </div>
                </div>
            `;
        }
        
        // Configurar eventos para cambiar título y descripción
        const titleInput = document.getElementById('title-input');
        const descInput = document.getElementById('desc-input');
        
        titleInput.addEventListener('input', (e) => {
            window.rutinaActual.title = e.target.value;
        });
        
        descInput.addEventListener('input', (e) => {
            window.rutinaActual.description = e.target.value;
        });
        
        // Configurar botón de crear
        document.getElementById('btn-crear').addEventListener('click', () => {
            if (!window.rutinaActual.title) {
                alert("Por favor, agrega un título a tu rutina");
                return;
            }
            
            if (window.rutinaActual.muscles.length === 0) {
                alert("Por favor, selecciona al menos un músculo involucrado");
                return;
            }
            
            if (window.rutinaActual.blocks.length === 0) {
                alert("Por favor, agrega al menos un ejercicio a tu rutina");
                return;
            }
            
            // Aquí iría el código para guardar la rutina en el servidor
            console.log("Guardando rutina:", window.rutinaActual);
            
            // Mostrar mensaje de éxito
            alert("Rutina creada con éxito");
            
            // Volver a la pantalla principal
            contentDiv.innerHTML = originalContent;
            window.rutinaActual = null;
        });
        
        // Exponer la función agregarSerie globalmente para manejar la adición de series
        window.agregarSerie = function(blockId) {
            console.log("Agregando serie al bloque:", blockId);
            
            // Obtener el bloque para determinar el número de la próxima serie
            const bloque = encontrarBloquePorId(blockId);
            if (!bloque) {
                console.error("No se pudo encontrar el bloque:", blockId);
                alert("Error: No se pudo encontrar el bloque");
                return;
            }
            
            // Mostrar el modal de series
            const modalSeries = document.getElementById('modal-series');
            if (!modalSeries) {
                console.error("No se encontró el modal de series");
                return;
            }
            
            // Guardar el ID del bloque actual en una variable global para usarlo en la creación de la serie
            bloqueActualId = blockId;
            
            // Resetear el formulario antes de mostrarlo
            resetearFormularioSeries();
            
            // Establecer el número correcto de la siguiente serie
            const proximoNum = bloque.number_of_sets + 1;
            
            // Actualizar los campos de número de serie en todos los formularios
            document.getElementById('normal-num').value = proximoNum;
            document.getElementById('dropset-num').value = proximoNum;
            document.getElementById('restpause-num').value = proximoNum;
            document.getElementById('rir-num').value = proximoNum;
            
            // Mostrar el modal
            modalSeries.style.display = 'flex';
            
            // Limpiar la selección del tipo de serie
            document.getElementById('tipo-serie').value = '';
            document.getElementById('form-normal-set').style.display = 'none';
            document.getElementById('form-dropset').style.display = 'none';
            document.getElementById('form-rest-pause').style.display = 'none';
            document.getElementById('form-rir').style.display = 'none';
        }
    }
    
    // Asociar la función de crear rutina al botón de abrir modal
    abrirBtn.addEventListener('click', crearRutinaVacia);
    
    // Función para agregar un bloque a la rutina actual
    window.agregarBloqueARutina = function(bloque) {
        console.log("Agregando bloque a la rutina:", bloque);
        
        if (!window.rutinaActual) {
            console.error("No hay rutina activa");
            alert("Error: No hay una rutina activa. Por favor, crea una rutina primero.");
            return false;
        }
        
        if (!window.rutinaActual.blocks) {
            window.rutinaActual.blocks = [];
        }
        
        // Agregar el bloque a la rutina
        window.rutinaActual.blocks.push(bloque);
        console.log("Bloque agregado. Total de bloques:", window.rutinaActual.blocks.length);
        
        return true;
    };

    // Función para seleccionar un ejercicio
    window.seleccionarEjercicio = function(id, name, photo_link, principal_muscle) {
        // Ocultar el modal
        document.getElementById('modal-ejercicio').style.display = 'none';
        
        // Usar directamente los datos recibidos sin hacer llamada al endpoint
        try {
            // Crear un objeto ejercicio con los datos recibidos
            const ejercicio = new ExerciseSummary(
                id, 
                name, 
                photo_link,
                [], // Equipamiento vacío ya que no es necesario para la visualización
                principal_muscle
            );
            
            // Crear un bloque vacío utilizando la función crearBloqueVacio
            const nuevoBloque = crearBloqueVacio();
            // Asignar el ejercicio seleccionado
            nuevoBloque.exercise_summary = ejercicio;
            
            // Crear un ID temporal para el bloque
            const tempId = 'temp-' + Date.now();
            nuevoBloque.temp_id = tempId; // Guardar el ID temporal como propiedad
            
            // Agregar el bloque a la rutina actual
            if (typeof window.agregarBloqueARutina === 'function') {
                window.agregarBloqueARutina(nuevoBloque);
            }
            
            // Agregar el bloque a la rutina (UI) usando ToHTML
            const rutinaDiv = document.getElementById('rutina');
            if (rutinaDiv) {
                rutinaDiv.innerHTML += nuevoBloque.ToHTML();
            }
            
            console.log("Bloque creado:", nuevoBloque);
            console.log("ID temporal asignado:", tempId);
        } catch (err) {
            console.error('Error al crear bloque de ejercicio:', err.message);
        }
    };

    // Función para actualizar la UI de la rutina completa
    function actualizarInterfazRutina() {
        const rutinaDiv = document.getElementById('rutina');
        if (!rutinaDiv || !window.rutinaActual || !window.rutinaActual.blocks) {
            console.error("No se puede actualizar la interfaz: falta el div o la rutina actual");
            return;
        }
        
        console.log("Actualizando interfaz de rutina. Bloques:", window.rutinaActual.blocks.length);
        
        // Limpiar y volver a dibujar todos los bloques
        rutinaDiv.innerHTML = '';
        window.rutinaActual.blocks.forEach((bloque, index) => {
            console.log(`Renderizando bloque ${index}:`, bloque);
            const bloqueHTML = bloque.ToHTML();
            rutinaDiv.innerHTML += bloqueHTML;
        });
        
        console.log("Interfaz de rutina actualizada");
    }

    // Función global para encontrar un bloque por ID
    function encontrarBloquePorId(id) {
        console.log("Buscando bloque con ID:", id);
        
        if (!window.rutinaActual || !window.rutinaActual.blocks || window.rutinaActual.blocks.length === 0) {
            console.error("No hay bloques disponibles en la rutina actual");
            return null;
        }
        
        console.log("Bloques disponibles:", window.rutinaActual.blocks);
        
        // Buscar el bloque por ID o ID temporal
        let bloque = window.rutinaActual.blocks.find(block => {
            if (id.startsWith('temp-')) {
                // Si es un ID temporal, comparar con la propiedad temp_id
                return block.temp_id === id;
            } else {
                // Si es un ID normal, comparar con block_id
                return block.block_id === id;
            }
        });
        
        if (bloque) {
            console.log("Bloque encontrado:", bloque);
        } else {
            console.error("No se encontró ningún bloque con ID:", id);
        }
        
        return bloque;
    }

    // Función mejorada para duplicar series usando comparación de serie_type
    window.duplicarSerie = function(blockId, serieIndex) {
        console.log(`Duplicando serie ${serieIndex} del bloque ${blockId}`);
        
        // Encontrar el bloque
        const bloque = encontrarBloquePorId(blockId);
        
        if (!bloque || !bloque.sets || serieIndex >= bloque.sets.length) {
            console.error("No se pudo encontrar la serie a duplicar", { bloque, serieIndex });
            alert('No se pudo encontrar la serie a duplicar');
            return;
        }
        
        try {
            // Obtener la serie original
            const serieOriginal = bloque.sets[serieIndex];
            console.log("Serie original a duplicar:", serieOriginal);
            
            // Crear una copia simple con un nuevo número
            const nuevoNumero = bloque.number_of_sets + 1;
            
            // Crear una copia según el tipo de serie (usando serie_type)
            let nuevaSerie;
            
            switch (serieOriginal.serie_type) {
                case 'normal_set':
                    console.log("Duplicando serie normal");
                    nuevaSerie = new NormalSet(
                        nuevoNumero,
                        serieOriginal.description,
                        [...serieOriginal.reps_range]
                    );
                    break;
                
                case 'dropset':
                    console.log("Duplicando dropset");
                    const nuevoSubsets = Array.isArray(serieOriginal.sub_sets) ? 
                        serieOriginal.sub_sets.map(subset => [...subset]) : [];
                    nuevaSerie = new Dropset(
                        nuevoNumero,
                        serieOriginal.description,
                        nuevoSubsets
                    );
                    break;
                
                case 'rest_pause_set':
                    console.log("Duplicando rest-pause set");
                    nuevaSerie = new RestPauseSet(
                        nuevoNumero,
                        serieOriginal.description,
                        serieOriginal.rest_between_sub_sets,
                        serieOriginal.sub_sets
                    );
                    break;
                
                case 'rir_set':
                    console.log("Duplicando RIR set");
                    nuevaSerie = new RIRSet(
                        nuevoNumero,
                        serieOriginal.description,
                        [...serieOriginal.rir_range]
                    );
                    break;
                
                default:
                    throw new Error(`Tipo de serie no reconocido: ${serieOriginal.serie_type}`);
            }
            
            console.log("Nueva serie creada:", nuevaSerie);
            
            // Añadir la nueva serie al bloque
            bloque.addSet(nuevaSerie);
            console.log("Serie duplicada añadida. Total series:", bloque.sets.length);
            
            // Actualizar la interfaz
            actualizarInterfazRutina();
            
        } catch (error) {
            console.error('Error al duplicar serie:', error);
            alert(`Error al duplicar serie: ${error.message}`);
        }
    };

    // Versión simplificada y directa para duplicar series
    window.duplicarSerie = function(blockId, serieIndex) {
        console.log(`Iniciando duplicarSerie: blockId=${blockId}, serieIndex=${serieIndex}`);
        
        try {
            // Encontrar el bloque por ID
            console.log("Buscando bloque...");
            const bloque = encontrarBloquePorId(blockId);
            
            if (!bloque) {
                console.error("ERROR: No se encontró el bloque con ID:", blockId);
                alert("No se pudo encontrar el bloque especificado");
                return;
            }
            
            console.log("Bloque encontrado:", bloque);
            
            // Verificar que el bloque tenga un array de series válido
            if (!bloque.sets || !Array.isArray(bloque.sets)) {
                console.error("ERROR: El bloque no tiene un array de series válido");
                alert("Error: El bloque no tiene series válidas");
                return;
            }
            
            // Verificar que el índice sea válido
            if (serieIndex < 0 || serieIndex >= bloque.sets.length) {
                console.error(`ERROR: Índice de serie inválido: ${serieIndex}. El bloque tiene ${bloque.sets.length} series`);
                alert("Error: Índice de serie inválido");
                return;
            }
            
            // Obtener la serie original
            const serieOriginal = bloque.sets[serieIndex];
            console.log("Serie original encontrada:", serieOriginal);
            
            // Verificar que la serie original tenga un tipo válido
            if (!serieOriginal || !serieOriginal.serie_type) {
                console.error("ERROR: La serie original no tiene un tipo válido");
                alert("Error: La serie original no tiene un formato válido");
                return;
            }
            
            // Crear una nueva serie del mismo tipo
            const nuevoNumero = bloque.sets.length + 1;
            let nuevaSerie;
            
            console.log(`Creando nueva serie de tipo: ${serieOriginal.serie_type}`);
            
            switch (serieOriginal.serie_type) {
                case 'normal_set':
                    nuevaSerie = new NormalSet(
                        nuevoNumero,
                        serieOriginal.description || '',
                        serieOriginal.reps_range ? [...serieOriginal.reps_range] : [8, 12]
                    );
                    break;
                    
                case 'dropset':
                    const subsetsDropset = Array.isArray(serieOriginal.sub_sets) ? 
                        serieOriginal.sub_sets.map(subset => [...subset]) : [[12, 100]];
                    nuevaSerie = new Dropset(
                        nuevoNumero,
                        serieOriginal.description || '',
                        subsetsDropset
                    );
                    break;
                    
                case 'rest_pause_set':
                    nuevaSerie = new RestPauseSet(
                        nuevoNumero,
                        serieOriginal.description || '',
                        serieOriginal.rest_between_sub_sets || 15,
                        serieOriginal.sub_sets || 1
                    );
                    break;
                    
                case 'rir_set':
                    nuevaSerie = new RIRSet(
                        nuevoNumero,
                        serieOriginal.description || '',
                        serieOriginal.rir_range ? [...serieOriginal.rir_range] : [1, 2]
                    );
                    break;
                    
                default:
                    throw new Error(`Tipo de serie no reconocido: ${serieOriginal.serie_type}`);
            }
            
            console.log("Nueva serie creada:", nuevaSerie);
            
            // Añadir la serie al array
            bloque.sets.push(nuevaSerie);
            
            // Actualizar el contador de series del bloque
            bloque.number_of_sets = bloque.sets.length;
            
            console.log(`Serie duplicada con éxito. Total series: ${bloque.sets.length}`);
            
            // Actualizar la interfaz
            actualizarInterfazRutina();
            
        } catch (error) {
            console.error("ERROR CRÍTICO en duplicarSerie:", error);
            alert(`Error al duplicar serie: ${error.message}`);
        }
    };

    window.eliminarSerie = function(blockId, serieIndex) {
        console.log(`Eliminando serie ${serieIndex} del bloque ${blockId}`);
        
        // Encontrar el bloque
        const bloque = encontrarBloquePorId(blockId);
        
        if (!bloque) {
            console.error("No se pudo encontrar el bloque para eliminar la serie:", blockId);
            alert('No se pudo encontrar el bloque para eliminar la serie');
            return;
        }
        
        if (!bloque.sets || !Array.isArray(bloque.sets)) {
            console.error("El bloque no tiene un array de series válido:", bloque);
            alert('Error: El bloque no tiene series válidas');
            return;
        }
        
        if (serieIndex < 0 || serieIndex >= bloque.sets.length) {
            console.error(`Índice de serie inválido: ${serieIndex}. El bloque tiene ${bloque.sets.length} series`);
            alert('Error: Índice de serie inválido');
            return;
        }
        
        // Confirmar antes de eliminar
        if (confirm('¿Estás seguro de que deseas eliminar esta serie?')) {
            try {
                // Obtener información de la serie antes de eliminarla para diagnóstico
                const serieAEliminar = bloque.sets[serieIndex];
                console.log("Serie a eliminar:", serieAEliminar);
                
                // Usar el método removeSet del bloque si existe
                if (typeof bloque.removeSet === 'function') {
                    bloque.removeSet(serieIndex);
                    console.log("Serie eliminada usando bloque.removeSet()");
                } else {
                    // Eliminación manual como alternativa
                    console.log("El método removeSet no está disponible, usando eliminación manual");
                    bloque.sets.splice(serieIndex, 1);
                    bloque.number_of_sets = bloque.sets.length;
                }
                
                console.log(`Serie eliminada. Quedan ${bloque.sets.length} series`);
                
                // Renumerar las series restantes
                bloque.sets.forEach((serie, idx) => {
                    serie.num = idx + 1;
                    console.log(`Serie ${idx} renumerada a ${serie.num}`);
                });
                
                // Actualizar la interfaz
                actualizarInterfazRutina();
                
            } catch (error) {
                console.error('Error al eliminar serie:', error);
                alert(`Error al eliminar serie: ${error.message}`);
            }
        } else {
            console.log("Eliminación de serie cancelada por el usuario");
        }
    };

    // Versión simplificada y directa para eliminar series
    window.eliminarSerie = function(blockId, serieIndex) {
        console.log(`Iniciando eliminarSerie: blockId=${blockId}, serieIndex=${serieIndex}`);
        
        try {
            // Encontrar el bloque por ID
            console.log("Buscando bloque...");
            const bloque = encontrarBloquePorId(blockId);
            
            if (!bloque) {
                console.error("ERROR: No se encontró el bloque con ID:", blockId);
                alert("No se pudo encontrar el bloque especificado");
                return;
            }
            
            console.log("Bloque encontrado:", bloque);
            
            // Verificar que el bloque tenga un array de series válido
            if (!bloque.sets || !Array.isArray(bloque.sets)) {
                console.error("ERROR: El bloque no tiene un array de series válido");
                alert("Error: El bloque no tiene series válidas");
                return;
            }
            
            // Verificar que el índice sea válido
            if (serieIndex < 0 || serieIndex >= bloque.sets.length) {
                console.error(`ERROR: Índice de serie inválido: ${serieIndex}. El bloque tiene ${bloque.sets.length} series`);
                alert("Error: Índice de serie inválido");
                return;
            }
            
            // Confirmar antes de eliminar
            if (confirm('¿Estás seguro de que deseas eliminar esta serie?')) {
                console.log(`Eliminando serie en índice ${serieIndex}...`);
                
                // Eliminar directamente la serie del array
                bloque.sets.splice(serieIndex, 1);
                
                // Actualizar el contador de series del bloque
                bloque.number_of_sets = bloque.sets.length;
                
                console.log(`Serie eliminada con éxito. Quedan ${bloque.sets.length} series`);
                
                // Renumerar las series restantes
                bloque.sets.forEach((serie, idx) => {
                    serie.num = idx + 1;
                    console.log(`Serie ${idx} renumerada a ${serie.num}`);
                });
                
                // Actualizar la interfaz
                actualizarInterfazRutina();
            } else {
                console.log("Eliminación cancelada por el usuario");
            }
            
        } catch (error) {
            console.error("ERROR CRÍTICO en eliminarSerie:", error);
            alert(`Error al eliminar serie: ${error.message}`);
        }
    };

    // Funciones para eliminar bloques
    window.eliminarBloque = function(blockId) {
        console.log(`Eliminando bloque ${blockId}`);
        
        if (!window.rutinaActual || !window.rutinaActual.blocks) {
            alert('No hay rutina activa');
            return;
        }
        
        // Confirmar antes de eliminar
        if (confirm('¿Estás seguro de que deseas eliminar este bloque y todas sus series?')) {
            try {
                // Encontrar el índice del bloque
                const bloqueIndex = window.rutinaActual.blocks.findIndex(bloque => {
                    if (blockId.startsWith('temp-')) {
                        return bloque.temp_id === blockId;
                    }
                    return bloque.block_id === blockId;
                });
                
                if (bloqueIndex === -1) {
                    alert('No se pudo encontrar el bloque a eliminar');
                    return;
                }
                
                // Eliminar el bloque
                window.rutinaActual.blocks.splice(bloqueIndex, 1);
                
                // Actualizar la interfaz
                actualizarInterfazRutina();
                
            } catch (error) {
                console.error('Error al eliminar bloque:', error);
                alert(`Error al eliminar bloque: ${error.message}`);
            }
        }
    };

    // Función para crear una serie desde el modal
    window.crearSerie = function() {
        // Obtener el ID del bloque desde la variable global
        const blockId = bloqueActualId;
        
        if (!blockId) {
            console.error("No se encontró el ID del bloque");
            alert("Error: No se pudo determinar el bloque al que pertenece la serie");
            return;
        }
        
        // Obtener el bloque
        const bloque = encontrarBloquePorId(blockId);
        if (!bloque) {
            console.error("No se pudo encontrar el bloque con ID:", blockId);
            alert("Error: No se pudo encontrar el bloque");
            return;
        }
        
        // Obtener el tipo de serie seleccionado
        const tipoSerie = document.getElementById('tipo-serie').value;
        
        if (!tipoSerie) {
            alert("Por favor, selecciona un tipo de serie");
            return;
        }
        
        // Formularios para cada tipo de serie
        let descripcion = '';
        let numeroSerie = 0;
        
        try {
            let nuevaSerie;
            
            switch(tipoSerie) {
                case 'normal_set':
                    numeroSerie = parseInt(document.getElementById('normal-num').value);
                    descripcion = document.getElementById('normal-desc').value || '';
                    const repsMinNormal = parseInt(document.getElementById('normal-reps-min').value);
                    const repsMaxNormal = parseInt(document.getElementById('normal-reps-max').value);
                    const repsRangeNormal = [repsMinNormal, repsMaxNormal];
                    
                    nuevaSerie = new NormalSet(numeroSerie, descripcion, repsRangeNormal);
                    break;
                    
                case 'dropset':
                    numeroSerie = parseInt(document.getElementById('dropset-num').value);
                    descripcion = document.getElementById('dropset-desc').value || '';
                    const subsetsDropset = [];
                    
                    const dropsetSubsets = document.querySelectorAll('#dropset-subsets .subset');
                    dropsetSubsets.forEach(subset => {
                        const reps = parseInt(subset.querySelector('.dropset-reps').value);
                        const weight = parseFloat(subset.querySelector('.dropset-weight').value);
                        subsetsDropset.push([reps, weight]);
                    });
                    
                    if (subsetsDropset.length === 0) {
                        throw new Error("Debes añadir al menos un subset para el dropset");
                    }
                    
                    nuevaSerie = new Dropset(numeroSerie, descripcion, subsetsDropset);
                    break;
                    
                case 'rest_pause_set':
                    numeroSerie = parseInt(document.getElementById('restpause-num').value);
                    descripcion = document.getElementById('restpause-desc').value || '';
                    const restTime = parseInt(document.getElementById('restpause-rest').value);
                    
                    // Contar el número de sub-series
                    const restPauseSubsets = document.querySelectorAll('#restpause-subsets .subset');
                    
                    // Verificar que haya al menos una sub-serie
                    if (restPauseSubsets.length === 0) {
                        throw new Error("Debe haber al menos una sub-serie");
                    }
                    
                    // Obtener el número de sub-series (no un array)
                    const numSubSets = restPauseSubsets.length;
                    
                    console.log("Número de sub-series de Rest-Pause:", numSubSets);
                    nuevaSerie = new RestPauseSet(numeroSerie, descripcion, restTime, numSubSets);
                    break;
                    
                case 'rir_set':
                    numeroSerie = parseInt(document.getElementById('rir-num').value);
                    descripcion = document.getElementById('rir-desc').value || '';
                    const rirMin = parseInt(document.getElementById('rir-range-min').value);
                    const rirMax = parseInt(document.getElementById('rir-range-max').value);
                    const rirRange = [rirMin, rirMax];
                    
                    nuevaSerie = new RIRSet(numeroSerie, descripcion, rirRange);
                    break;
                    
                default:
                    throw new Error("Tipo de serie no reconocido");
            }
            
            console.log("Serie creada:", nuevaSerie);
            
            // Añadir la serie al bloque
            bloque.addSet(nuevaSerie);
            console.log("Serie añadida al bloque. Total series:", bloque.sets.length);
            
            // Actualizar la interfaz
            actualizarInterfazRutina();
            
            // Cerrar el modal
            const modalSeries = document.getElementById('modal-series');
            if (modalSeries) {
                modalSeries.style.display = 'none';
                console.log("Modal de series cerrado");
            } else {
                console.error("No se encontró el modal de series");
            }
            
            // Resetear formulario
            resetearFormularioSeries();
            console.log("Formulario de series reseteado");
            
        } catch (error) {
            console.error("Error al crear serie:", error);
            alert("Error al crear la serie: " + error.message);
        }
    };
});