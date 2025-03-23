const GroupMember = require("./GroupMember");

class Group {
    constructor(group_id, group_name, members = []) {
        this.group_id = group_id;
        this.group_name = group_name;
        this.members = members; // Arreglo de objetos GroupMember
    }

    addMember(member) {
        this.members.push(member);
    }

    deleteMember(memberId) {
        this.members = this.members.filter(member => member.id !== memberId);
    }

    getMembers() {
        return this.members;
    }
}

module.exports = Group;
