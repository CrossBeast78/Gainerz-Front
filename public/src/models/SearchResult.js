export class SearchResult {
    constructor(uuid, type, name, photoUrl) {
      this.uuid = uuid; 
      this.type = type; // Tipo busqueda (coach, usuario, gym, gymchain)
      this.name = name; 
      this.photoUrl = photoUrl; 
    }
  }
  