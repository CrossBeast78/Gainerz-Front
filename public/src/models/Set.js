class Set_ {
    constructor(num, serie_type, description) {
        this.num = num;
        this.serie_type = serie_type;
        this.description = description;
    }
    setNum(num){
        if ((typeof num === 'number' || num instanceof Number) && num > 0) {
            this.num = num;
        } else {
            throw new Error('El numero de serie debe ser un numero positivo');
        }
    }
    setSerieType(serie_type){
        if ((typeof serie_type === 'string' || serie_type instanceof String) && 
            ['normal_set', 'dropset', 'rest_pause_set', 'rir_set'].includes(serie_type)) {
            this.serie_type = serie_type;
        } else {
            throw new Error('El tipo de serie debe ser un string');
        }
    }
    setDescription(description){
        if ((typeof description === 'string' || description instanceof String) && description.length > 0) {
            this.description = description;
        } else {
            throw new Error('La descripcion debe ser un string');
        }
    }
    
    // Método base para representación HTML
    ToHTML() {
        console.log(`[Serie Base] Renderizando serie ${this.num} de tipo ${this.serie_type}`);
        return `
            <div class="serie-base">
                <div class="serie-header">
                    <h5 class="ubuntu-condensed-regular">Serie ${this.num}</h5>
                    <span class="badge bg-secondary">${this.getTipoSerie()}</span>
                </div>
                ${this.description ? `<p class="ubuntu-condensed-regular">${this.description}</p>` : ''}
            </div>
        `;
    }
    
    getTipoSerie() {
        switch(this.serie_type) {
            case 'normal_set': return 'Normal';
            case 'dropset': return 'Dropset';
            case 'rest_pause_set': return 'Rest-Pause';
            case 'rir_set': return 'RIR';
            default: return this.serie_type;
        }
    }
}

class NormalSet extends Set_ {
    constructor(num, description, reps_range) {
        super(num, 'normal_set', description);
        this.setRepsRange(reps_range);
    }
    setRepsRange(reps_range){
        if (!Array.isArray(reps_range) || reps_range.length !== 2) {
            throw new Error('El rango de repeticiones debe ser un array de dos números');
        }

        if (typeof reps_range[0] !== 'number' || typeof reps_range[1] !== 'number') {
            throw new Error('Los elementos del rango deben ser números');
        }

        if (reps_range[0] <= 0) {
            throw new Error('El primer número debe ser positivo');
        }

        if (reps_range[1] !== 0 && reps_range[1] <= reps_range[0]) {
            throw new Error('El segundo número debe ser 0 o mayor que el primero');
        }

        this.reps_range = reps_range[1] === 0 ? [reps_range[0], reps_range[0]] : reps_range;
    }
    
    // Representación HTML específica para NormalSet
    ToHTML() {
        console.log(`[NormalSet] Renderizando serie ${this.num} con rango ${this.reps_range[0]}-${this.reps_range[1]}`);
        const baseHTML = super.ToHTML();
        return `
            <div class="normal-set">
                ${baseHTML}
                <div class="reps-info">
                    <span class="ubuntu-condensed-regular">Repeticiones: ${this.reps_range[0]} - ${this.reps_range[1]}</span>
                </div>
            </div>
        `;
    }
}

class Dropset extends Set_ {
    constructor(num, description, sub_sets) {
        super(num, 'dropset', description);
        this.setSubSets(sub_sets);
    }
    
    setSubSets(sub_sets) {
        if (!Array.isArray(sub_sets)) {
            throw new Error('sub_sets debe ser un array');
        }

        if (sub_sets.length === 0) {
            throw new Error('sub_sets no puede estar vacío');
        }

        for (const sub_set of sub_sets) {
            if (!Array.isArray(sub_set)) {
                throw new Error('Cada sub-set debe ser un array');
            }

            if (sub_set.length !== 2) {
                throw new Error('Cada sub-set debe tener exactamente 2 elementos');
            }

            if (typeof sub_set[0] !== 'number' || typeof sub_set[1] !== 'number') {
                throw new Error('Los elementos del sub-set deben ser números');
            }

            if (sub_set[0] <= 0) {
                throw new Error('El número de repeticiones debe ser mayor a 0');
            }

            if (sub_set[1] <= 0 || sub_set[1] > 100) {
                throw new Error('El porcentaje de peso debe estar entre 0 y 100');
            }
        }

        this.sub_sets = sub_sets;
    }
    
    // Representación HTML específica para Dropset
    ToHTML() {
        console.log(`[Dropset] Renderizando serie ${this.num} con ${this.sub_sets.length} sub-series`);
        const baseHTML = super.ToHTML();
        
        const subsetsHTML = this.sub_sets.map((subset, index) => `
            <div class="subset-item">
                <span class="ubuntu-condensed-regular">Sub-Serie ${index + 1}:</span>
                <span class="ubuntu-condensed-regular">Repeticiones: ${subset[0]}</span>
                <span class="ubuntu-condensed-regular">Peso: ${subset[1]}%</span>
            </div>
        `).join('');
        
        return `
            <div class="dropset">
                ${baseHTML}
                <div class="subset-list">
                    ${subsetsHTML}
                </div>
            </div>
        `;
    }
}

class RestPauseSet extends Set_ {
    constructor(num, description, rest_between_sub_sets, sub_sets) {
        super(num, 'rest_pause_set', description);
        this.setRestBetweenSubSets(rest_between_sub_sets);
        this.setSubSets(sub_sets);
    }
    setRestBetweenSubSets(rest_between_sub_sets) {
        if (typeof rest_between_sub_sets === 'number' && rest_between_sub_sets > 0) {
            this.rest_between_sub_sets = rest_between_sub_sets;
        } else {
            throw new Error('El descanso entre sub-series debe ser un número positivo');
        }
    }

    setSubSets(sub_sets) {
        if (typeof sub_sets === 'number' && sub_sets > 0) {
            this.sub_sets = sub_sets;
        } else {
            throw new Error('El número de sub-series debe ser un número positivo');
        }
    }
    
    // Representación HTML específica para RestPauseSet
    ToHTML() {
        console.log(`[RestPauseSet] Renderizando serie ${this.num} con ${this.sub_sets} sub-series`);
        const baseHTML = super.ToHTML();
        return `
            <div class="rest-pause-set">
                ${baseHTML}
                <div class="rest-pause-info">
                    <span class="ubuntu-condensed-regular">Número de sub-series: ${this.sub_sets}</span>
                    <span class="ubuntu-condensed-regular">Descanso entre sub-series: ${this.rest_between_sub_sets} segundos</span>
                </div>
            </div>
        `;
    }
}

class RIRSet extends Set_ {
    constructor(num, description, rir_range) {
        super(num, 'rir_set', description);
        this.setRIRRange(rir_range);
    }
    setRIRRange(rir_range){
        if (!(rir_range instanceof Array)) {
            throw new Error('El rango RIR debe ser un array');
        }

        if (rir_range.length !== 2) {
            throw new Error('El rango RIR debe tener exactamente 2 elementos');
        }

        if (typeof rir_range[0] !== 'number' || typeof rir_range[1] !== 'number') {
            throw new Error('Los elementos del rango RIR deben ser números');
        }

        if (rir_range[0] < 0 || rir_range[1] < 0) {
            throw new Error('Los elementos del rango RIR deben ser no negativos');
        }

        if (rir_range[0] > rir_range[1]) {
            throw new Error('El primer elemento del rango RIR debe ser menor o igual al segundo');
        }

        this.rir_range = rir_range;
        return;
    }
    
    // Representación HTML específica para RIRSet
    ToHTML() {
        console.log(`[RIRSet] Renderizando serie ${this.num} con rango RIR ${this.rir_range[0]}-${this.rir_range[1]}`);
        const baseHTML = super.ToHTML();
        return `
            <div class="rir-set">
                ${baseHTML}
                <div class="rir-info">
                    <span class="ubuntu-condensed-regular">RIR: ${this.rir_range[0]} - ${this.rir_range[1]}</span>
                </div>
            </div>
        `;
    }
}

function validateSet(set){
    if (!set.serie_type || !set.num || !set.description){
        throw new Error('Faltan datos de la serie');
    }
    try {
        switch (set.serie_type){
            case 'normal_set':
                new NormalSet(set.num, set.description, set.reps_range);
                break;
            case 'dropset':
                new Dropset(set.num, set.description, set.sub_sets);
                break;
            case 'rest_pause_set':
                new RestPauseSet(set.num, set.description, set.rest_between_sub_sets, set.sub_sets);
                break;
            case 'rir_set':
                new RIRSet(set.num, set.description, set.rir_range);
                break;
            default:
                throw new Error('Tipo de serie no válido');
        }

    } catch (error){
        throw new Error('Error al validar la serie: ' + error.message);
    }
}

// Exportar clases al objeto global window para accesibilidad
window.Set_ = Set_;
window.NormalSet = NormalSet;
window.Dropset = Dropset;
window.RestPauseSet = RestPauseSet;
window.RIRSet = RIRSet;

// Verificar que las clases estén disponibles globalmente
console.log("Clases de series exportadas globalmente:", {
    Set_: typeof window.Set_,
    NormalSet: typeof window.NormalSet,
    Dropset: typeof window.Dropset,
    RestPauseSet: typeof window.RestPauseSet,
    RIRSet: typeof window.RIRSet
});
