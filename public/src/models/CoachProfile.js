const Profiles = require('./Profiles')

export class CoachProfile extends Profiles {
    constructor(id) {
        super(id, "coach");
        this.groups = []; 
    }

    set groups(groups) {
        this.groups = groups;
    }

    nuevoGrupo(groupId, groupName, members) {
        this.groups.push({
            group_id: groupId,
            group_name: groupName,
            members: members
        });
    }

    meterMiembroAGrupo(groupId, member) {
        const group = this.groups.find(g => g.group_id === groupId);
        if (group) {
            group.members.push(member);
        }
    }
}