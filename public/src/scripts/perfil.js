document.addEventListener("DOMContentLoaded", () => {
    const content = document.createElement("div");
    content.className = "content";

    // Perfil principal
    const perfilPrincipal = document.createElement("div");
    perfilPrincipal.className = "perfil-principal";

    const fotoPerfil = document.createElement("div");
    fotoPerfil.className = "foto-perfil";

    const img = document.createElement("img");
    img.src = "#";
    img.alt = "img perfil";

    const iconoEditar = document.createElement("i");
    iconoEditar.className = "fa-solid fa-pen-to-square";

    fotoPerfil.appendChild(img);
    fotoPerfil.appendChild(iconoEditar);

    const btnEditar = document.createElement("button");
    btnEditar.className = "editar-datos squada-one-regular";
    btnEditar.textContent = "Editar Datos";

    const joined = document.createElement("p");
    joined.className = "perfil-info squada-one-regular";
    joined.textContent = "Se unió desde 2022";

    const edad = document.createElement("p");
    edad.className = "perfil-info squada-one-regular";
    edad.textContent = "21 Años";

    perfilPrincipal.appendChild(fotoPerfil);
    perfilPrincipal.appendChild(btnEditar);
    perfilPrincipal.appendChild(joined);
    perfilPrincipal.appendChild(edad);

    // Perfil datos
    const perfilDatos = document.createElement("div");
    perfilDatos.className = "perfil-datos";

    const nombre = document.createElement("h1");
    nombre.className = "nombre squada-one-regular";
    nombre.textContent = "Pancho Lolito";

    const fila = document.createElement("div");
    fila.className = "squada-one-regular";
    fila.style.display = "flex";
    fila.style.flexDirection = "row";
    fila.style.justifyContent = "space-around";

    const col1 = document.createElement("div");
    col1.style.display = "flex";
    col1.style.flexDirection = "column";
    col1.style.width = "50%";

    const atributos = ["Mi Gym: ", "Mi Peso: ", "Mi IMC: ", "Mi Coach: "];
    atributos.forEach(text => {
        const p = document.createElement("p");
        p.className = "perfil-atributo border";
        p.textContent = text;
        col1.appendChild(p);
    });

    const col2 = document.createElement("div");
    col2.style.display = "flex";
    col2.style.flexDirection = "column";
    col2.style.width = "50%";

    const datosUsuario = ["Default", "53.4 KG", "28.5 KG/M2", "Default"];
    datosUsuario.forEach(text => {
        const p = document.createElement("p");
        p.className = "perfil-datos-usuario border";
        p.textContent = text;
        col2.appendChild(p);
    });

    fila.appendChild(col1);
    fila.appendChild(col2);

    perfilDatos.appendChild(nombre);
    perfilDatos.appendChild(fila);

    // Añadir todo al content
    content.appendChild(perfilPrincipal);
    content.appendChild(perfilDatos);

    // Agregar al body o a un contenedor específico
    document.body.appendChild(content);
});