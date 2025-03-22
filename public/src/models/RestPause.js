import { Set } from "./Set.js";

export class RestPause extends Set {
    constructor(num, serie_type, description, rest_between_sub_sets = 0, sub_sets = 0) {
        super(num, serie_type, description);
        this.rest_between_sub_sets = rest_between_sub_sets;
        this.sub_sets = sub_sets;
    }
}