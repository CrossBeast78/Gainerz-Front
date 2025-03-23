const Set = require('./Set')

class Dropset extends Set {
    
    constructor(num, serie_type, description, sub_sets=[]) {
        super(num, serie_type, description);
        this.sub_sets = sub_sets;
    }

    set sub_sets(sub_sets) {
        this.sub_sets = sub_sets;
    }   
}

module.exports=Set;