export class ExerciseSummary {
    constructor(exercise_id, name, photo_link, equipment=[], principal_muscle) {
        this.exercise_id = exercise_id; 
        this.name = name;
        this.photo_link = photo_link; 
        this.equipment = equipment; 
        this.principal_muscle = principal_muscle; 
    }
}