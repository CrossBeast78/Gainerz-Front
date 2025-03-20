document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("requestModal");
    const openBtn = document.getElementById("Op_modal");
    const closeBtn = document.getElementById("close");
  
    console.log("Modal:", modal);
    console.log("Botón Abrir:", openBtn);
    console.log("Botón Cerrar:", closeBtn);
  
    
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

      document.querySelector(".approve-btn").addEventListener("click", function (event) {
        event.stopPropagation(); // Evita que el clic active el modal
        alert("Solicitud aprobada ✅");
    });

    document.querySelector(".desapprove-btn").addEventListener("click", function (event) {
        event.stopPropagation(); // Evita que el clic active el modal
        alert("Solicitud rechazada ❌");
    });
  });