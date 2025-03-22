const { v4: uuidv4 } = require('uuid');

class Notification {

    _NotificationId = null
    _Type = null
    _Title = null
    _Message = null
    _Date = null
    _Visibility = true

    constructor(ID,Title, Message, Date_, Visibility) {
        this.setDefaultValues(ID, Date_, Visibility);
        this.setTitle(Title);
        this.setMessage(Message);

    }

    setType(Type){
        if (Type === 'request' || Type === 'news'){
            this._Type = Type
        }
        else {
            throw new Error("Type cannot be empty")
        }
    }
    setDefaultValues(ID, Date_, Visibility){
        this._NotificationId = ID || uuidv4().toString();

        if (Date_) {
            this._Date = Date_;
        } else {
            const currentDate = new Date();
            this._Date = currentDate.toISOString().split('T')[0];
        }

        this._Visibility = Visibility !== null ? Visibility : true;
    }
    // Setters
    setTitle(Title){
        if (Title && Title.length > 0){
            this._Title = Title
        } else {
            throw new Error("Title cannot be empty")
        }
    }

    setMessage(Message){
        if (Message && Message.length > 0){
            this._Message = Message
        }
        else {
            throw new Error("Message cannot be empty") 
        }
    }

    GetVisibility(){
        return this._Visibility
    }
    
}

module.exports = Notification;