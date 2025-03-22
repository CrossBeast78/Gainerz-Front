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