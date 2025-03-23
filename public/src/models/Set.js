class Set {
    constructor(num, serie_type, description) {
        this._num = num;
        this._serie_type = serie_type;
        this._description = description;
    }

    get num() {
        return this._num;
    }

    set num(value) {
        this._num = value;
    }

    get serie_type() {
        return this._serie_type;
    }

    set serie_type(value) {
        this._serie_type = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }
}

module.exports = Set;
