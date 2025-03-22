document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.querySelector(".login-button a");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    loginBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        try {
            const response = await fetch("http://192.168.1.72:8080/account", {
                method: "GET",
                headers: {
                    "email": email,
                    "password": password
                }
            });

            if (response.status === 200) {
                // Login exitoso
                const data = await response.json();

                // Si recibes token o ID, puedes guardarlo
                if (data.token) {
                    sessionStorage.setItem("token", data.token);
                }

                alert("Login exitoso");
                window.location.href = "/bandeja";
            } else if (response.status === 400) {
                alert("Credenciales incorrectas.");
            } else if (response.status === 404) {
                alert("Usuario no encontrado.");
            } else if (response.status === 500) {
                alert("Error en el servidor. Intenta más tarde.");
            } else {
                alert(`Error inesperado (código ${response.status})`);
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Error de red o conexión con el servidor.");
        }
    });
});