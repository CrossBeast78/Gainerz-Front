class GroupMember {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    // Getters
    get memberId() {
        return this.id;
    }

    get memberName() {
        return this.name;
    }

    // Setters
    set memberId(id) {
        this.id = id;
    }

    set memberName(name) {
        this.name = name;
    }
}

module.exports = GroupMember;
