// assets/js/modules/smoothscroll.js
export default function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  if (!anchors.length) return;

  anchors.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId.length <= 1) return;
      const el = document.querySelector(targetId);
      if (!el) return;

      e.preventDefault();
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth",
      });
    });
  });
}
