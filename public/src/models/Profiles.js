class Profiles {
    constructor(id, profileType, name, photoLink, email, gender, age, height, weight) {
        this._id = id;
        this._profileType = profileType; // "coach" o "user"
        this._name = name;
        this._photoLink = photoLink;
        this._email = email;
        this._gender = gender;
        this._age = age;
        this._height = height;
        this._weight = weight;

        this._searchHistory = [];
        this._favoriteExercises = [];
        this._favoriteBlocks = [];
        this._savedRoutines = [];
        this._notifications = [];
        this._sentRequests = [];
    }

    // Getters
    get id() { return this._id; }
    get profileType() { return this._profileType; }
    get name() { return this._name; }
    get photoLink() { return this._photoLink; }
    get email() { return this._email; }
    get gender() { return this._gender; }
    get age() { return this._age; }
    get height() { return this._height; }
    get weight() { return this._weight; }

    // Setters
    set id(id) { this._id = id; }
    set profileType(profileType) { this._profileType = profileType; }
    set name(name) { this._name = name; }
    set photoLink(photoLink) { this._photoLink = photoLink; }
    set email(email) { this._email = email; }
    set gender(gender) { this._gender = gender; }
    set age(age) { this._age = age; }
    set height(height) { this._height = height; }
    set weight(weight) { this._weight = weight; }

    set searchHistory(history) { this._searchHistory = history; }
    set favoriteExercises(exercises) { this._favoriteExercises = exercises; }
    set favoriteBlocks(blocks) { this._favoriteBlocks = blocks; }
    set savedRoutines(routines) { this._savedRoutines = routines; }
    set notifications(notifications) { this._notifications = notifications; }
    set sentRequests(requests) { this._sentRequests = requests; }

    // Métodos de utilidad
    nuevaBusqueda(uuid, type, name, photoLink) {
        this._searchHistory.push({ uuid, type, name, photoLink });
    }

    nuevoEjercicioFavorito(exercise) {
        this._favoriteExercises.push(exercise);
    }

    nuevoBloqueFavorito(block) {
        this._favoriteBlocks.push(block);
    }

    guardarRutina(routine) {
        this._savedRoutines.push(routine);
    }

    nuevaNotificacion(notification) {
        this._notifications.push(notification);
    }

    sendRequest(userId) {
        if (!this._sentRequests.includes(userId)) {
            this._sentRequests.push(userId);
        }
    }
}

window.Profiles = Profiles;