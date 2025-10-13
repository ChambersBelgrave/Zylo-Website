// assets/js/modules/lightbox.js
export default function initLightbox() {
  const items = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const img = lightbox ? lightbox.querySelector("img") : null;
  const closeBtn = document.getElementById("close-lightbox");

  if (!items.length || !lightbox || !img) return;

  items.forEach((item) => {
    item.addEventListener("click", function () {
      const src = this.querySelector("img")?.src;
      if (!src) return;
      img.src = src;
      lightbox.style.display = "flex";
    });
  });

  const close = () => (lightbox.style.display = "none");
  closeBtn?.addEventListener("click", close);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
}
