export class ExerciseSummary {
    constructor(exercise_id, name, photo_link, equipment=[], principal_muscle) {
        this.exercise_id = exercise_id; 
        this.name = name;
        this.photo_link = photo_link; 
        this.equipment = equipment; 
        this.principal_muscle = principal_muscle; 
    }

    set exercise_id(exercise_id) {
        this.exercise_id = exercise_id;
    }

    set name(name) {
        this.name = name;
    }

    set photo_link(photo_link) {
        this.photo_link = photo_link;
    }

    set equipment(equipment) {
        this.equipment = equipment;
    }

    set principal_muscle(principal_muscle) {
        this.principal_muscle = principal_muscle;
    }
    
}