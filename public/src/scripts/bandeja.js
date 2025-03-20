document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("requestModal");
    const openBtn = document.getElementById("Op");
    const closeBtn = document.querySelector("close");
  
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
      });czc
  });