class CoachProfile {
    constructor(name, groups = []) {
        this.id = crypto.randomUUID();  // ID único del coach
        this.name = name;
        this.groups = groups;  // Lista de Group
    }

    addGroup(group) {
        this.groups.push(group);
    }

    deleteGroup(groupId) {
        this.groups = this.groups.filter(g => g.groupId !== groupId);
    }

    getGroups() {
        return this.groups.map(group => group.toJSON());
    }

}

module.exports=CoachProfile;
