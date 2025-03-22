export class Block {
    constructor(block_id, exercise_summary, num_series, sets) {
        this.block_id = block_id; 
        this.exercise_summary = exercise_summary; // instancia de ExerciseSummary
        this.num_series = num_series; 
        this.sets = sets; 
    }

    set block_id(block_id) {
        this.block_id = block_id;
    }   

    set exercise_summary(exercise_summary) {
        this.exercise_summary = exercise_summary;
    }

    set num_series(num_series) {
        this.num_series = num_series;
    }

    set sets(sets) {
        this.sets = sets;
    }

    

}