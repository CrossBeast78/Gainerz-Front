export class Set {
    constructor(num, serie_type, description) {
        this.num = num;
        this.serie_type = serie_type;
        this.description = description;
    }

    set num(num) {
        this.num = num;
    }

    set serie_type(serie_type) {
        this.serie_type = serie_type;
    }

    set description(description) {
        this.description = description;
    }
}
