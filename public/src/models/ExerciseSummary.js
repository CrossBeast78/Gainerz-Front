class ExerciseSummary {
    constructor(exercise_id, name, photo_link, equipment, principal_muscle) {
        this.setExerciseId(exercise_id);
        this.setName(name);
        this.setPhotoLink(photo_link);
        this.setEquipment(equipment);
        this.setPrincipalMuscle(principal_muscle);
    }

    setExerciseId(exercise_id) {
        console.log("exercise_id = ", exercise_id)
        if (typeof exercise_id === 'string' && exercise_id.length > 0) {
            this.id = exercise_id;
        } else {
            throw new Error('El ID del ejercicio debe ser un string no vacío');
        }
    }

    setName(name) {
        if (typeof name === 'string' && name.length > 0) {
            this.name = name;
        } else {
            throw new Error('El nombre del ejercicio debe ser un string no vacío');
        }
    }

    setPhotoLink(photo_link) {
        // Interpreta "<nil>" o "nil" como null
        if (photo_link === '<nil>' || photo_link === "nil") {
            this.photo_link = null;
            return;
        }
    
        if (photo_link === null || typeof photo_link === 'string') {
            this.photo_link = photo_link;
        } else {
            throw new Error('El enlace de la foto debe ser una cadena o null');
        }
    }    

    setEquipment(equipment) {
        if (Array.isArray(equipment)) {
            this.equipment = equipment.map((item) => new EquipmentGroup(item.group, item.equipment));
        } else {
            throw new Error('Los equipos deben ser un array de objetos EquipmentGroup válidos');
        }
    }

    setPrincipalMuscle(principal_muscle) {
        if (typeof principal_muscle === 'string' && principal_muscle.length > 0) {
            this.principal_muscle = principal_muscle;
        } else {
            throw new Error('El músculo principal debe ser un string no vacío');
        }
    }
    
    async validateInstance(token) {
        try {
            // Importar aquí para evitar referencia circular
            const validExerciseSummary = require('../utils/validExerciseSummary');
            
            const { valid, data } = await validExerciseSummary(this.exercise_id, token);
            
            if (valid) {
                this.name = data.name;
                this.photo_link = data.photo_link;
                this.equipment = data.equipment;
                this.principal_muscle = data.principal_muscle;
                return true;
            } else {
                throw new Error('No se pudo validar la instancia');
            }
        } catch (error) {
            throw new Error(`Error validando ejercicio: ${error.message}`);
        }
    }
    ToHTML(){
        return `
                                <div class="series-ej">
                                    <p class="ej ubuntu-condensed-regular">${this.name}</p>
                                    <div class="datos-serie ubuntu-condensed-regular">
                                        <h2 class="squada-one-regular">Serie 1</h2>
                                        <p>Músculo: ${ejercicio.principal_muscle}</p>
                                        <p style="padding-left: 20px;">Reps: --</p>
                                        <p style="padding-left: 20px;">Peso: --</p>
                                    </div>
                                </div>
                                <div class="crear-series">
                                    <p class="ubuntu-condensed-regular">Agregar serie</p>
                                    <i class="fa-solid fa-circle-plus add-ej"></i>
                                </div>
                            `

    }
}

class EquipmentGroup {
    constructor(group, equipment = []) {
        this.setGroup(group);
        this.setEquipment(equipment);
    }
    setGroup(group) {
        console.log(group);
        if (typeof group === 'number') {
            this.group = group;
        } else {
            throw new Error('El grupo debe ser un número');
        }
    }

    setEquipment(equipment) {
        if (Array.isArray(equipment) && equipment.every(e => typeof e === 'string')) {
            this.equipment = equipment;
        } else {
            throw new Error('Los equipos deben ser un array de strings');
        }
    }

}


window.ExerciseSummary = ExerciseSummary;

