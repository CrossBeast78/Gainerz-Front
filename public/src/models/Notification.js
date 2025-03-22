export class Notification {
    constructor(IdRemitente, NombreRemitente, Asunto, Mensaje) {
        this.id = Notification.IdGenerator();
        this.IdRemitente = IdRemitente;
        this.NombreRemitente = NombreRemitente;
        this.Asunto = Asunto;
        this.Mensaje = Mensaje;
        this.Fecha = new Date();
        this.Visibilidad = true;
    }

    static IdGenerator() {
        return `notif-${Date.now()}`
    }

    ocultarNotificaciones() {
        this.Visibilidad = false;
    }
}
