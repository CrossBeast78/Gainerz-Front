class Profiles {
    constructor(id, profileType, name, photoLink) {
        this.id = id;
        this.profileType = profileType; // coach o user
        this.name = name;
        this.photoLink=photoLink;
        this.searchHistory = [];
        this.favoriteExercises = []; 
        this.favoriteBlocks = []; 
        this.savedRoutines = [];
        this.notifications = [];
        this.sentRequests = []; 
    }

    set id(id) {
        this.id = id;
    }

    set profileType(profileType) {
        this.profileType = profileType;
    }

    set name(name) {
        this.name = name;
    }

    set photoLink(photoLink) {
        this.photoLink = photoLink;
    }

    set searchHistory(searchHistory) {
        this.searchHistory = searchHistory;
    }

    set favoriteExercises(favoriteExercises) {
        this.favoriteExercises = favoriteExercises;
    }

    set favoriteBlocks(favoriteBlocks) {
        this.favoriteBlocks = favoriteBlocks;
    }

    set savedRoutines(savedRoutines) {
        this.savedRoutines = savedRoutines;
    }

    set notifications(notifications) {
        this.notifications = notifications;
    }

    set sentRequests(sentRequests) {
        this.sentRequests = sentRequests;
    }

    nuevaBusqueda(uuid, type, name, photoLink) {
        this.searchHistory.push({ uuid, type, name, photoLink });
    }

    nuevoEjercicioFavorito(exercise) {
        this.favoriteExercises.push(exercise);
    }

    nuevoBloqueFavorito(block) {
        this.favoriteBlocks.push(block);
    }

    guardarRutina(routine) {
        this.savedRoutines.push(routine);
    }

    nuevaNotificacion(notification) {
        this.notifications.push(notification);
    }

    sendRequest(userId) {
        if (!this.sentRequests.includes(userId)) {
            this.sentRequests.push(userId);
        }
    }
}