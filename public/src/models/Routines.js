class Routine {
    constructor(routine_id, created_by, name, description, creation_date, muscles, blocks) {
        this.setID(routine_id);
        this.setCreatedBy(created_by);
        this.setCreationDate(creation_date);
        this.setName(name);
        this.setDescription(description);
        this.setMuscles(muscles);
        this.setBlocks(blocks);
    }
    setID(routine_id){
        if (typeof routine_id === 'string' && routine_id.length > 0 || routine_id === null) {
            this.routine_id = routine_id;
        } else {
            throw new Error('El id de la rutina debe ser un string');
        }
    }
    setCreatedBy(created_by){
        if (created_by instanceof Object && created_by.id && created_by.name) {
            this.created_by = created_by;
        } else {
            throw new Error('El creador de la rutina debe ser un objeto con id y name');
        }
    } 
    
    setCreationDate(creation_date) {
        if (typeof creation_date === 'string') {
            const date = new Date(creation_date);
            if (isNaN(date.getTime())) {
                throw new Error('La fecha de creación debe ser una fecha válida en formato ISO');
            }
            this.creation_date = creation_date;
        } else {
            throw new Error('La fecha de creación debe ser un string en formato ISO');
        }
    }

    setName(name){
        if (typeof name === "string" && name.trim().length > 0) {
            this.name = name;
        } else {
            throw new Error("El nombre de la rutina debe ser un string");
        }
    }
    
    setDescription(description){
        if (typeof description === "string" && description.trim().length > 0) {
            this.description = description;
        } else {
            throw new Error('La descripción de la rutina debe ser un string');
        }
    }
    setMuscles(muscles){
        if (muscles instanceof Array && muscles.every(muscle => typeof muscle === 'string')) {
            this.muscles = muscles;
        } else {
            throw new Error('Los músculos deben ser un array de strings');
        }
    }
    setBlocks(blocks){
        if (!(blocks instanceof Array)) {
            throw new Error('Los bloques deben ser un array');
        }
        for (let i = 0; i < blocks.length; i++) {
            try {
                new Block(true, blocks[i].id, blocks[i].exercise_summary, blocks[i].number_of_sets, blocks[i].sets);
            } catch (error) {
                throw new Error('Los bloques deben ser un array de objetos Block');
            }
        }
        this.blocks = blocks;
    }
}

function get_new_routine(created_by){
    return {
        routine_id: null,
        created_by: created_by,
        creation_date: new Date().toISOString(),
        name: "",
        description: "",
        muscles: [],
        blocks: [],
    }
}

window.Routine = Routine;