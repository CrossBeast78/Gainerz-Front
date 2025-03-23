class GymProfile {
    constructor(gymId) {
        this._gymId = gymId;
        this._equipment = [];
        this._notifications = [];
        this._searchHistory = [];
        this._sentRequests = [];
    }

    // Getters
    get gymId() {
        return this._gymId;
    }

    get equipment() {
        return this._equipment;
    }

    get notifications() {
        return this._notifications;
    }

    get searchHistory() {
        return this._searchHistory;
    }

    get sentRequests() {
        return this._sentRequests;
    }

    addEquipment(id, quantity) {
        this._equipment.push({ id, quantity });
    }

    updateEquipment(id, quantity) {
        let equip = this._equipment.find(e => e.id === id);
        if (equip) {
            equip.quantity = quantity;
        } else {
            throw new Error("Equipo no encontrado");
        }
    }

    removeEquipment(id) {
        this._equipment = this._equipment.filter(e => e.id !== id);
    }

    // Métodos para manejar notificaciones
    addNotification(notification) {
        this._notifications.push(notification);
    }

    clearNotifications() {
        this._notifications = [];
    }

    addSearch(uuid, type, name, photoLink) {    // Historial Busqueda
        this._searchHistory.push({ uuid, type, name, photoLink });
    }

    clearSearchHistory() {
        this._searchHistory = [];
    }

    sendRequest(coachId) {  // Solicuitudes enviadas
        if (!this._sentRequests.includes(coachId)) {
            this._sentRequests.push(coachId);
        }
    }

    removeRequest(coachId) {
        this._sentRequests = this._sentRequests.filter(id => id !== coachId);
    }
}

module.exports = GymProfile;
