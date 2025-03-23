const Profiles = require('./Profiles');

class User_Profile extends Profiles {
    constructor(id, profileType, name, photoLink, email, gender, age, height, weight) {
        super(id, profileType, name, photoLink, email, gender, age, height, weight);

        this._week_distribution = {
            monday: [null, null],
            tuesday: [null, null],
            wednesday: [null, null],
            thursday: [null, null],
            friday: [null, null],
            saturday: [null, null],
            sunday: [null, null]
        };
    }

    // Getter
    get weekDistribution() {
        return this._week_distribution;
    }

    // Setter para asignar rutinas 
    setRoutine(day, userRoutine, coachRoutine) {
        if (this._week_distribution.hasOwnProperty(day)) {
            this._week_distribution[day] = [userRoutine, coachRoutine];
        } else {
            throw new Error("Dia invalido, escribelo en ingles");
        }
    }

    getRoutine(day) {   // Obtener rutinass dia en especifico
        if (this._week_distribution.hasOwnProperty(day)) {
            return this._week_distribution[day];
        }
        throw new Error("Día inválido. Usa un día de la semana en inglés.");
    }
}

module.exports = User_Profile;
