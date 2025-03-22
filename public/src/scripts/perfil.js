
document.addEventListener("DOMContentLoaded", () => {
    const content = document.querySelector(".content");

    function cargarPerfilDesdeAppStorage() {
        const userData = AppStorage.getUser();

        if (!userData) {
            content.innerHTML = "<p>No hay información de perfil guardada.</p>";
            return;
        }

        const perfil = new window.Profiles(
            userData.id,
            "user", // o "coach"
            userData.name,
            userData.photoLink,
            userData.email,
            userData.gender,
            userData.age,
            userData.height,
            userData.weight
        );

        renderizarPerfil(perfil);
    }

    function renderizarPerfil(perfil) {
        content.innerHTML = "";

        const perfilPrincipal = document.createElement("div");
        perfilPrincipal.className = "perfil-principal";

        const fotoPerfil = document.createElement("div");
        fotoPerfil.className = "foto-perfil";

        const img = document.createElement("img");
        img.src = perfil.photoLink;
        img.alt = "Foto de perfil";

        const iconoEditar = document.createElement("i");
        iconoEditar.className = "fa-solid fa-pen-to-square";

        fotoPerfil.appendChild(img);
        fotoPerfil.appendChild(iconoEditar);

        const btnEditar = document.createElement("button");
        btnEditar.className = "editar-datos squada-one-regular";
        btnEditar.textContent = "Editar Datos";

        const edad = document.createElement("p");
        edad.className = "perfil-info squada-one-regular";
        edad.textContent = `${perfil.age} años`;

        perfilPrincipal.appendChild(fotoPerfil);
        perfilPrincipal.appendChild(btnEditar);
        perfilPrincipal.appendChild(edad);

        const perfilDatos = document.createElement("div");
        perfilDatos.className = "perfil-datos";

        const nombre = document.createElement("h1");
        nombre.className = "nombre squada-one-regular";
        nombre.textContent = perfil.name;

        const fila = document.createElement("div");
        fila.className = "squada-one-regular";
        fila.style.display = "flex";
        fila.style.flexDirection = "row";
        fila.style.justifyContent = "space-around";

        const col1 = document.createElement("div");
        col1.style.display = "flex";
        col1.style.flexDirection = "column";
        col1.style.width = "50%";

        const col2 = document.createElement("div");
        col2.style.display = "flex";
        col2.style.flexDirection = "column";
        col2.style.width = "50%";

        const atributos = [
            "Correo:",
            "Género:",
            "Altura:",
            "Peso:",
            "IMC:"
          ];
          
          const valores = [
            perfil.email,          // ✅ Correo
            perfil.gender,         // ✅ Género
            `${perfil.height} cm`, // ✅ Altura
            `${perfil.weight} kg`, // ✅ Peso
            calcularIMC(perfil.height, perfil.weight) // ✅ IMC
          ];

        atributos.forEach((attr, i) => {
            const label = document.createElement("p");
            label.className = "perfil-atributo border";
            label.textContent = attr;

            const valor = document.createElement("p");
            valor.className = "perfil-datos-usuario border";
            valor.textContent = valores[i];

            col1.appendChild(label);
            col2.appendChild(valor);
        });

        fila.appendChild(col1);
        fila.appendChild(col2);
        perfilDatos.appendChild(nombre);
        perfilDatos.appendChild(fila);

        content.appendChild(perfilPrincipal);
        content.appendChild(perfilDatos);
    }

    function calcularIMC(alturaCm, pesoKg) {
        const alturaM = alturaCm / 100;
        const imc = pesoKg / (alturaM * alturaM);
        return imc.toFixed(1) + " kg/m²";
    }

    cargarPerfilDesdeAppStorage();
});