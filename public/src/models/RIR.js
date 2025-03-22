import { Set } from "./Set.js";

export class RIR extends Set {
    constructor(num, serie_type, description, rir_range = [0, 0]) {
        super(num, serie_type, description);
        this.rir_range = rir_range;
    }

    set rir_range(rir_range) {
        this.rir_range = rir_range;
    }
    
}