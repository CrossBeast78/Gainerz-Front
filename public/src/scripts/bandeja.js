document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("requestModal");
    const closeBtn = document.getElementById("close");
    const requestContainer = document.querySelector(".notifications-container");
    const links = document.querySelectorAll(".navLink");

    let allNotifications = [];

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    function renderNotifications(notifications) {
        requestContainer.innerHTML = "";
        notifications.forEach(notification => {
            const notificationElement = document.createElement("div");
            notificationElement.classList.add("request-container");
            notificationElement.style.marginBottom = "15px";
            notificationElement.innerHTML = `
                <div class="request-header" style="cursor: pointer;">
                    <span class="request-title">${notification._Title}</span>
                    <span class="request-text">${notification._Message}</span>
                    <div class="request-actions">
                        <button class="approve-btn" data-id="${notification._NotificationId}">✔</button>
                        <button class="desapprove-btn" data-id="${notification._NotificationId}">🗑</button>
                    </div>
                </div>
            `;
            requestContainer.appendChild(notificationElement);
        });

        addEventListeners();
    }

    function filterByCategory(category) {
        if (category === "all") {
            renderNotifications(allNotifications);
        } else {
            const filtered = allNotifications.filter(n => n._Type === category);
            renderNotifications(filtered);
        }
    }

    async function fetchNotifications() {
        try {
            const token = AppStorage.getToken();
            const response = await fetch("http://192.168.1.119:8083/notifications", {
                method: "GET",
                headers: { "token": token }
            });

            const data = await response.json();
            console.log("Respuesta de notificaciones:", data);

            if (Array.isArray(data)) {
                allNotifications = data;
                renderNotifications(allNotifications);
            } else {
                console.warn("respuesta no valida", data);
            }
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
        }
    }

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

    // ✅ Listeners para filtrar categorías
    document.querySelectorAll(".weekDay").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const category = button.dataset.category;
            filterByCategory(category);
        });
    });

    // ✅ Cargar notificaciones al iniciar
    fetchNotifications();
});