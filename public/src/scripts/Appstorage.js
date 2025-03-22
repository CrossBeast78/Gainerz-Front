class AppStorage{

    /* ocupo que tenga un valor booleano que representa si ya fue inicializado otro que si ya esta logeado un token y un usuario*/

    static init(){
        if (!sessionStorage.getItem("initialized")){
            sessionStorage.setItem("initialized", true);
        }
        if (!sessionStorage.getItem("logged")){
            sessionStorage.setItem("logged", false);
        }
        if (!sessionStorage.getItem("token")){
            sessionStorage.setItem("token", "");
        }
        if (!sessionStorage.getItem("user")){
            sessionStorage.setItem("user", "");
        }
    }

    static setInitialized(value){
        sessionStorage.setItem("initialized", value.toString());
    }

    static setLogged(value){
        sessionStorage.setItem("logged", value.toString());
    }

    static setToken(value){
        sessionStorage.setItem("token", token);
    }

    static setUser(userObj){
        sessionStorage.setItem("user", JSON.stringify(userObj));
    }

    static isInitialized(){
        return sessionStorage.getItem("initialized") === "true";
    }

    static isLogged(){
        return sessionStorage.getItem("logged") === "true";
    }

    static getToken(){
        return sessionStorage.getItem("token");
    }

    static getUser(){
        return JSON.parse(sessionStorage.getItem("user"));
    }


    static clear(){
        sessionStorage.removeItem("initialized");
        sessionStorage.removeItem("logged");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
    }


}