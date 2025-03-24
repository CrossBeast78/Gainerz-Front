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
    ToHTML_Search(){
        return `
            <div class="series-ej" onclick="seleccionarEjercicio('${this.id}', '${this.name}', '${this.photo_link || ""}', '${this.principal_muscle}')">
                <p class="ej ubuntu-condensed-regular">${this.name}</p>
                <div class="datos-serie ubuntu-condensed-regular">
                    <p>Músculo: ${this.principal_muscle}</p>
                </div>
            </div>
        `;
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

