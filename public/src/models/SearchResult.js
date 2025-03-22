export class SearchResult {
    constructor(uuid, type, name, photoUrl) {
      this.uuid = uuid; 
      this.type = type; // Tipo busqueda (coach, usuario, gym, gymchain)
      this.name = name; 
      this.photoUrl = photoUrl; 
    }

    set uuid(uuid) {
        this.uuid = uuid;
    }

    set type(type) {
        this.type = type;
    }

    set name(name) {
        this.name = name;
    }

    set photoUrl(photoUrl) {
        this.photoUrl = photoUrl;
    }

  }
  