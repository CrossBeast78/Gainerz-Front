class Block {
    constructor(flag, block_id, exercise_summary, number_of_sets, sets = []) { 
        // Si se llama sin parámetros o con flag=false, crear un bloque vacío
        if (arguments.length === 0 || flag === false) {
            this.block_id = null;   
            this.exercise_summary = null;
            this.number_of_sets = 0;
            this.sets = [];
        }
        else {
            this.setExerciseSummary(exercise_summary);
            this.setBlockId(block_id);
            this.setNumberOfSets(number_of_sets);
            this.setSets(sets);
        }
    }
    
    getEmptyBlock(){
        return new Block(false,null, null, 0, []);
    }

    setBlockId(block_id) {
        if (typeof block_id === 'string' && block_id.length > 0) {
            this.block_id = block_id;
        } else {
            throw new Error('El id del bloque debe ser un string no vacío');
        }
    }
    
    setExerciseSummary(exercise_summary) {
        if (!exercise_summary || typeof exercise_summary !== 'object') {
            throw new Error('El resumen del ejercicio debe ser un objeto válido');
        }
        
        try {

            const exerciseSummary = new ExerciseSummary(exercise_summary.id, exercise_summary.name, exercise_summary.photo_link, exercise_summary.equipment, exercise_summary.principal_muscle);
            this.exercise_summary = exerciseSummary;
        }
       
        catch (error) {
            throw new Error('No se pudo validar el ejercicio: ' + error.message);
        }
    }
    
    setNumberOfSets(number_of_sets) {
        console.log(number_of_sets)
        console.log(typeof number_of_sets);
        if (typeof number_of_sets !== 'number' || isNaN(number_of_sets) || number_of_sets <= 0) {
            throw new Error('El número de series debe ser un número positivo');
        }
        this.number_of_sets = number_of_sets;
    }
    
    setSets(sets) {
        console.log("+++++++++++++++++++++\n",sets);
        if (!Array.isArray(sets)) {
            throw new Error('Las series deben ser un array');
        }
        
        if (sets.length !== this.number_of_sets) {
            throw new Error(`El número de series (${sets.length}) debe ser igual al número especificado (${this.number_of_sets})`);
        }
        
        const validatedSets = [];
        
        for (let i = 0; i < sets.length; i++) {
            const set = sets[i];
            
            if (!set || typeof set !== 'object') {
                throw new Error(`La serie en posición ${i} no es un objeto válido`);
            }
            
            if (!set.serie_type) {
                throw new Error(`La serie en posición ${i} debe tener un tipo definido`);
            }
            
            try {
                let validatedSet;
                
                switch (set.serie_type) {
                    case 'normal_set':
                        validatedSet = new NormalSet(set.num, set.description, set.reps_range);
                        break;
                    case 'dropset':
                        console.log("++++++++++++++++++++++++++++++\n",typeof set.sub_sets);
                        validatedSet = new Dropset(set.num, set.description, set.sub_sets);
                        break;
                    case 'rest_pause_set':
                        validatedSet = new RestPauseSet(set.num, set.description, set.rest_between_sub_sets, set.sub_sets);
                        break;
                    case 'rir_set':
                        validatedSet = new RIRSet(set.num, set.description, set.rir_range);
                        break;
                    default:
                        throw new Error(`El tipo de serie '${set.serie_type}' no es válido`);
                }
                
                validatedSets.push(validatedSet);
            } catch (error) {
                throw new Error(`No se pudo validar la serie en posición ${i}: ${error.message}`);
            }
        }
        
        this.sets = validatedSets;
    }
    ToHTML(){
        if (!this.exercise_summary) {
            return `
            <div class="bloque-ejercicio bloque-vacio" id="bloque-vacio">
                <div class="encabezado-bloque">
                    <span class="ejercicio-nombre">Sin ejercicio seleccionado</span>
                </div>
                <button class="btn btn-primary btn-sm" onclick="mostrarModalEjercicio()">Seleccionar ejercicio</button>
            </div>`;
        }
        
        const blockId = this.block_id || this.temp_id || `temp-${Date.now()}`;
        
        let seriesHTML = '';
        if (this.sets && this.sets.length > 0) {
            console.log(`Renderizando ${this.sets.length} series para el bloque ${blockId}`);
            
            seriesHTML = this.sets.map((serie, index) => {
                console.log(`Serie ${index}:`, serie);
                const serieHTML = serie.ToHTML ? serie.ToHTML() : `<div>Serie ${serie.num}</div>`;
                
                return `
                <div class="serie-container" data-serie-index="${index}">
                    ${serieHTML}
                    <div class="serie-actions">
                        <button class="btn btn-outline-primary btn-sm" onclick="window.duplicarSerie('${blockId}', ${index})">
                            <i class="fas fa-copy"></i> Duplicar
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="window.eliminarSerie('${blockId}', ${index})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>`;
            }).join('');
        } else {
            console.log(`No hay series para el bloque ${blockId}`);
        }
        
        return `
        <div class="bloque-ejercicio" id="${blockId}">
            <div class="encabezado-bloque">
                <div class="ejercicio-info">
                    <img src="${this.exercise_summary.photo_link}" alt="${this.exercise_summary.name}" class="img-ejercicio">
                    <div>
                        <h4 class="ejercicio-nombre">${this.exercise_summary.name}</h4>
                        <span class="badge bg-primary">${this.exercise_summary.principal_muscle}</span>
                    </div>
                </div>
                <div class="bloque-actions">
                    <button class="btn btn-outline-danger" onclick="window.eliminarBloque('${blockId}')">
                        <i class="fas fa-trash"></i> Eliminar bloque
                    </button>
                </div>
            </div>
            
            <div class="series-container">
                ${seriesHTML}
            </div>
            
            <div class="añadir-serie">
                <button class="btn btn-success" onclick="window.agregarSerie('${blockId}')">
                    <i class="fas fa-plus"></i> Añadir serie
                </button>
            </div>
        </div>`;
    }
    addSet(set){
        console.log("Añadiendo serie al bloque:", set);
        if (!set) {
            console.error("Error: No se puede añadir una serie vacía");
            throw new Error("No se puede añadir una serie vacía");
        }
        
        try {
            // Validar el tipo de serie
            if (!set.serie_type || typeof set.serie_type !== 'string') {
                console.error("Error: La serie debe tener un tipo válido");
                throw new Error("La serie debe tener un tipo válido");
            }
            
            // Añadir la serie
            this.sets.push(set);
            this.number_of_sets = this.sets.length;
            console.log(`Serie añadida. Total series: ${this.number_of_sets}`);
            
            return true;
        } catch (error) {
            console.error("Error al añadir serie:", error);
            throw error;
        }
    }
    updateSet(index, newSet){
        if (!Number.isInteger(index) || index < 0 || index >= this.sets.length) {
            throw new Error('Índice de serie inválido');
        }
        this.sets[index] = newSet;
    }
    removeSet(index) {
        console.log(`Intentando eliminar serie en índice ${index}`);
        
        if (!Number.isInteger(index)) {
            console.error("Error: El índice debe ser un número entero", index);
            throw new Error('El índice de serie debe ser un número entero');
        }
        
        if (index < 0 || index >= this.sets.length) {
            console.error(`Error: Índice ${index} fuera de rango. El bloque tiene ${this.sets.length} series`);
            throw new Error('Índice de serie fuera de rango');
        }
        
        // Eliminar la serie
        const serieEliminada = this.sets.splice(index, 1)[0];
        console.log("Serie eliminada:", serieEliminada);
        
        // Actualizar el número de series
        this.number_of_sets = this.sets.length;
        console.log(`Serie eliminada. Ahora hay ${this.number_of_sets} series en el bloque`);
        
        // Renumerar las series restantes
        this.sets.forEach((serie, idx) => {
            serie.num = idx + 1;
        });
        
        return true;
    }
}

// Función para crear un bloque vacío
function crearBloqueVacio() {
    return new Block(false);
}

// Función para abrir el modal de selección de ejercicios
window.mostrarModalEjercicio = function() {
    // Mostrar el modal de ejercicio
    const modal = document.getElementById('modal-ejercicio');
    modal.style.display = 'flex';

    // Configurar el input de búsqueda
    const inputBusqueda = document.getElementById('exampleDataList');
    const datalist = document.getElementById('datalistOptions');
    const busqueda_div = document.getElementById('busqueda-ejercicios');
    
    // Limpiar búsquedas anteriores
    busqueda_div.innerHTML = '';
    datalist.innerHTML = '';

    // Configurar evento de búsqueda
    inputBusqueda.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query.length < 1) return;
    
            // Limpiar resultados anteriores
            busqueda_div.innerHTML = '';
    
            fetch(`http://192.168.1.128:8082/exercise/${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'token': AppStorage.getToken(),
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (!data || data.length === 0) {
                    busqueda_div.innerHTML = '<p>No se encontraron ejercicios</p>';
                    return;
                }
                
                let ejercicios = [];
                data.forEach(ej => {
                    ejercicios.push(new ExerciseSummary(ej.id, ej.name, ej.photo_link, ej.equipment, ej.principal_muscle));
                });
                
                ejercicios.forEach(ej => {
                    busqueda_div.innerHTML += ej.ToHTML_Search();
                });
            })
            .catch(err => {
                console.error('Error en búsqueda:', err.message);
                busqueda_div.innerHTML = '<p>Error al buscar ejercicios</p>';
            });
        }
    });

    // Configurar cierre del modal
    document.getElementById('cerrar-modal-ej').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target.id === 'modal-ejercicio') {
            modal.style.display = 'none';
        }
    });
};

// Para mantener compatibilidad con código existente
window.newBlock = function() {
    window.mostrarModalEjercicio();
};

// Exportar Block al objeto global para accesibilidad
window.Block = Block;
window.crearBloqueVacio = crearBloqueVacio;

console.log("Clase Block y función crearBloqueVacio exportadas globalmente");

