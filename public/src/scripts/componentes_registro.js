class Registro {
    constructor() {
        this.container = document.getElementById("register-container");
        this.datosPrimeraParte = {};
        this.init();
    }

    init() {
        this.container.innerHTML = this.htmlPrimeraParte();
        this.container.querySelector("#continue").addEventListener("click", () => this.enviarPrimeraParte());
    }

    htmlPrimeraParte() {
        return `
            <form id="form1">
                <div class="mb-3">
                <input type="text" id="name" placeholder="Name" class="formControl ubuntu-condensed-regular" required><br>
                </div>
                <div class="mb-3">
                <input type="email" id="email" placeholder="Email" class="formControl ubuntu-condensed-regular" required><br>
                </div>
                <div class="mb-3">
                <input type="password" id="password" placeholder="Password" class="formControl ubuntu-condensed-regular" required><br>
                </div>
                <div class="mb-3">
                <input type="password" id="password-confirm" placeholder="Confirm Password" class="formControl ubuntu-condensed-regular" required><br>
                </div>
                <div class="mb-3">
                <label style="color: #caa60a;" ><input type="checkbox" id="terms" class="checkbox"> I accept the terms</label><br>
                </div>
                <button type="button" id="continue" class="squada-one-regular register-button mb-2">Continue Registration</button>
            </form>
        `;
    }

    htmlSegundaParte() {
        return `
            <form id="form2">
                <div class="mb-3">
                <input type="number" id="age" placeholder="Age" class="formControl ubuntu-condensed-regular" required><br>
                </div>
                <div class="mb-3">
                <input type="number" id="weight" placeholder="Weight (kg)" class="formControl ubuntu-condensed-regular" required><br>
                </div>
                <div class="mb-3">
                <input type="number" id="height" placeholder="Height (cm)" class="formControl ubuntu-condensed-regular" required><br>
                </div>
                <div class="mb-3">
                <select id="gender" class="formControl ubuntu-condensed-regular" required>
                    <option value="">Select gender</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Prefiero no contestar">Prefiero no contestar</option>
                </select><br>
                </div>
                <div class="mb-3">
                <input type="text" id="injuries_and_contradictions" placeholder="Injuries or contradictions (optional)" class="formControl ubuntu-condensed-regular"><br>
                </div>
                <div class="mb-3">
                <input type="text" id="objective" placeholder="Objective" class="formControl ubuntu-condensed-regular"><br>
                </div>
                <div class="mb-3">
                <button type="button" id="finish" class="squada-one-regular register-button mb-2">Finish Registration</button>
                </div>
            </form>
        `;
    }

    enviarPrimeraParte() {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const passwordConfirm = document.getElementById("password-confirm").value;
        const terms = document.getElementById("terms").checked;

        if (!name || !email || !password || !passwordConfirm || !terms) {
            alert("All fields are required.");
            return;
        }

        if (password !== passwordConfirm) {
            alert("Passwords do not match.");
            return;
        }

        const datosPreVerif = {
            name: name,
            email: email,
            password: password,
            terms: terms
        };

        // Guardar temporalmente para usar en el segundo paso
        this.datosPrimeraParte = datosPreVerif;

        // Enviar al endpoint /account/pre-verif
        fetch("http://192.168.1.72:8080/account/pre-verif", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosPreVerif)
        })
        .then(res => {
            if (res.status === 200) {
                // Continuamos con segunda parte del registro
                this.container.innerHTML = this.htmlSegundaParte();
                this.container.querySelector("#finish").addEventListener("click", () => this.enviarSegundaParte());
            } else {
                alert("Pre-verification failed. Status code: " + res.status);
            }
        })
        .catch(err => {
            console.error("❌ Connection error:", err);
            alert("Failed to connect to server.");
        });
    }

    enviarSegundaParte() {
        const age = parseInt(document.getElementById("age").value);
        const weight = parseFloat(document.getElementById("weight").value);
        const height = parseFloat(document.getElementById("height").value);
        const gender = document.getElementById("gender").value;
        const injuries = document.getElementById("injuries_and_contradictions").value;
        const objective = document.getElementById("objective").value;

        if (!age || !weight || !height || !gender) {
            alert("All fields are required.");
            return;
        }

        const finalUserData = {
            ...this.datosPrimeraParte,
            age,
            weight,
            height,
            gender,
            injuries_and_contradictions: injuries,
            objective
        };
        fetch("http://192.168.1.72:8080/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalUserData)
        })
        .then(async res => {
            console.log("Status:", res.status);
        
            const text = await res.text();
            console.log("Raw response text:", text);
        
            if (res.status === 200 || res.status === 201) {
                window.location.href = "/login";
            } else {
                alert("Unexpected response:\n" + text);
            }
        })
        .catch(err => {
            console.error("❌ Error:", err);
            alert("Connection error.");
        });
    }

}

window.addEventListener("DOMContentLoaded", () => {
    new Registro();
});