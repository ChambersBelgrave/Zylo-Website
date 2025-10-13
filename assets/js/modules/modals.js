// assets/js/modules/modals.js
export default function initModals() {
  const triggers = document.querySelectorAll(".modal-trigger");
  const modals = document.querySelectorAll(".modal");
  const closes = document.querySelectorAll(".modal-close");

  if (!triggers.length && !modals.length) return;

  triggers.forEach((t) => {
    t.addEventListener("click", function () {
      const id = this.getAttribute("data-modal");
      if (!id) return;
      const modal = document.getElementById(`${id}-modal`);
      if (modal) modal.style.display = "flex";
    });
  });

  closes.forEach((btn) => {
    btn.addEventListener("click", function () {
      this.closest(".modal").style.display = "none";
    });
  });

  modals.forEach((m) => {
    m.addEventListener("click", function (e) {
      if (e.target === this) this.style.display = "none";
    });
  });
}
