import { Set } from "./Set.js";

export class Dropset extends Set {
    
    
    constructor(num, serie_type, description, sub_sets=[]) {
        super(num, serie_type, description);
        this.sub_sets = sub_sets;
    }
}
