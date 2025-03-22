import { Set } from "./Set.js";

export class NormalSet extends Set {
    
    
    constructor(num, serie_type, description, reps_range) {
        super(num, serie_type, description);
        this.reps_range = reps_range;
    }
}
