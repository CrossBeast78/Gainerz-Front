const Set = require('./Set')

class NormalSet extends Set {
    
    constructor(num, serie_type, description, reps_range) {
        super(num, serie_type, description);
        this.reps_range = reps_range;
    }

    set reps_range(reps_range) {
        this._reps_range = reps_range;
    }

}

module.exports=NormalSet;