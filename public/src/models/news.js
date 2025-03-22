const Notification = require('./Notification');

class News extends Notification {
    _SenderToken = null;
    _SenderName = null;

    constructor(ID, Title, Message, Date, Visibility, SenderToken, SenderName) {
        super(ID, Title, Message, Date, Visibility);
        this.setSenderToken(SenderToken);
        this.setSenderName(SenderName);
        super.setType('news');
    }

    setSenderToken(SenderToken){
        if (SenderToken && SenderToken.length > 0){
            this._SenderToken = SenderToken;
        }   
        else {
            throw new Error("Invalid sender token");
        }
    }

    setSenderName(SenderName){
        if (SenderName && SenderName.length > 0){
            this._SenderName = SenderName;
        }
        else {
            throw new Error("Error con el sender Name")
        }
    }
}

module.exports = News;