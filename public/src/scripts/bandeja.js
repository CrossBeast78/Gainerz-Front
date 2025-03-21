document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("requestModal");
  const closeBtn = document.getElementById("close");
  const openBtn = document.getElementById("Op_modal");
  const requestContainer = document.querySelector(".content");
  const links = document.querySelectorAll(".navLink");

  openBtn.addEventListener("click", function () {
    modal.style.display = "flex";
  });

  closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
      if (event.target === modal) {
          modal.style.display = "none";
      }
  });

  // Función para cargar notificaciones desde la API
  async function fetchNotifications() {
      try {
          const response = await fetch("/api/notificaciones");
          const data = await response.json();
          renderNotifications(data);
      } catch (error) {
          console.error("Error al cargar notificaciones:", error);
      }
  }

  // Función para renderizar las notificaciones con espacio adecuado
  function renderNotifications(notifications) {
      requestContainer.innerHTML = ""; // Limpia el contenedor
      notifications.forEach(notification => {
          const notificationElement = document.createElement("div");
          notificationElement.classList.add("request-container");
          notificationElement.style.marginBottom = "15px"; // Agrega margen inferior
          notificationElement.innerHTML = `
              <div id="Op_modal" class="request-header">
                  <img class="img-perfil" src="${notification.profileImage}" alt="">
                  <span class="request-title">${notification.sender}</span>
                  <span class="request-text">${notification.message}</span>
                  <div class="request-actions">
                      <button class="approve-btn" data-id="${notification.id}">✔</button>
                      <button class="desapprove-btn" data-id="${notification.id}">🗑</button>
                  </div>
              </div>
          `;
          requestContainer.appendChild(notificationElement);
      });

      addEventListeners();
  }

   // Renderizar anuncios
   function renderAnnouncements(announcements) {
    announcementsContainer.innerHTML = "";
    announcements.forEach(announcement => {
        const announcementElement = document.createElement("div");
        announcementElement.classList.add("request-container", "btn-primary");
        announcementElement.style.marginBottom = "10px";
        announcementElement.style.padding = "10px";
        announcementElement.innerHTML = `
            <div class="anunce-header" style="display: flex; align-items: center; gap: 10px;">
                <img class="img-anunce" src="${announcement.image}" alt="" style="width: 50px; height: 50px; border-radius: 50%;">
                <div style="flex-grow: 1;">
                    <span class="anunce-title" style="font-size: 16px; font-weight: bold;">${announcement.title}</span>
                    <p class="anunce-text" style="font-size: 14px; margin: 5px 0;">${announcement.description}</p>
                </div>
            </div>
        `;
        announcementsContainer.appendChild(announcementElement);
    });
}

  // Agregar eventos a los botones de aprobación y rechazo
  function addEventListeners() {
      document.querySelectorAll(".approve-btn").forEach(button => {
          button.addEventListener("click", function () {
              const notificationId = this.getAttribute("data-id");
              alert("Solicitud aprobada ✅ (ID: " + notificationId + ")");
          });
      });

      document.querySelectorAll(".desapprove-btn").forEach(button => {
          button.addEventListener("click", function () {
              const notificationId = this.getAttribute("data-id");
              alert("Solicitud rechazada ❌ (ID: " + notificationId + ")");
          });
      });
  }

  links.forEach(link => {
    link.addEventListener("mouseover", function () {
        links.forEach(l => l.classList.remove("hover-active"));
        this.classList.add("hover-active");
    });

    link.addEventListener("mouseleave", function () {
        links.forEach(l => l.classList.remove("hover-active"));
    });
  });

  // Cargar las notificaciones al iniciar la página
  fetchData("/api/notificaciones", renderRequests);
  fetchData("/api/anuncios", renderAnnouncements);
});
