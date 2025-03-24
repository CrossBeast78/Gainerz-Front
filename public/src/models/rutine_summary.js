class rutinesummary {
    constructor(routine_id, name, description, muscles) {
        this.routine_id = routine_id;
        this.name = name;
        this.description = description;
        this.muscles = muscles;
    }

    get_routine_summary() {
        return `
            <div class="routine-summary">
                <h2 class="routine-name">${this.name}</h2>
                <p class="routine-text routine-description"><strong>Description:</strong> ${this.description}</p>
                <p class="routine-text routine-muscles"><strong>Muscles:</strong> ${this.muscles.join(', ')}</p>
            </div>
        `;
    }


}

window.rutinesummary = rutinesummary;