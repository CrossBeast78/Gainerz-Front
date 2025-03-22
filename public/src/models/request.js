const Notification = require('./Notification');

class Request extends Notification {
    _RequestType = null;
    _RequestToken = null;

    constructor(ID, Title, Message, Date, Visibility, RequestType, RequestToken){
        super(ID, Title, Message, Date, Visibility);
        super.setType('request');
        this.setRelationType(RequestType);
        this.setRequestToken(RequestToken);
    }

    setRelationType(RequestType){
        const validTypes = ["c2u", "u2c", "c2g", "g2c"];
        if (RequestType && validTypes.includes(RequestType)){
            this._RequestType = RequestType;
        }
        else {
            throw new Error("Invalid relation type");
        }
    }

    setRequestToken(RequestToken){
        if (RequestToken && RequestToken.length > 0){
            this._RequestToken = RequestToken;
        }
        else {
            throw new Error("Invalid request token");
        }
    }
}

module.exports = Request;
