class SearchResult {
    constructor(uuid, type, name, photoUrl) {
      this.uuid = uuid; 
      this.type = type; // Tipo busqueda (coach, usuario, gym, gymchain)
      this.name = name; 
      this.photoUrl = photoUrl; 
    }

    set uuid(uuid) {
        this._uuid = uuid;
    }

    set type(type) {
        this._type = type;
    }

    set name(name) {
        this._name = name;
    }

    set photoUrl(photoUrl) {
        this._photoUrl = photoUrl;
    }

  }
  
  module.exports=SearchResult;