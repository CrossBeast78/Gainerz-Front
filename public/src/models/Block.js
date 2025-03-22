export class Block {
    constructor(block_id, exercise_summary, num_series, sets) {
        this.block_id = block_id; 
        this.exercise_summary = exercise_summary; // instancia de ExerciseSummary
        this.num_series = num_series; 
        this.sets = sets; 
    }
}