document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("requestModal");
    const closeBtn = document.getElementById("close");
    const requestContainer = document.querySelector(".notifications-container");
    const links = document.querySelectorAll(".navLink");

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    console.log("Token que se está enviando:", AppStorage.getToken());

    async function fetchNotifications() {
        try {
            const token = AppStorage.getToken();
            const response = await fetch("http://192.168.1.70:8083/notifications", {
                method: "GET",
                headers: { "token": token }
            });

            const data = await response.json();
            console.log("Respuesta de notificaciones:", data);
            renderNotifications(data);
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
        }
    }

    function renderNotifications(notifications) {
        requestContainer.innerHTML = "";
        notifications.forEach(notification => {
            const notificationElement = document.createElement("div");
            notificationElement.classList.add("request-container");
            notificationElement.style.marginBottom = "15px";
            notificationElement.innerHTML = `
                <div class="request-header" style="cursor: pointer;">
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

   /* Renderizar anuncios
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
    }*/

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
  fetchNotifications();
  //renderAnnouncements();
});
