// assets/js/modules/faq.js
export default function initFAQ() {
  const questions = document.querySelectorAll(".faq-question");
  if (!questions.length) return;

  questions.forEach((q) => {
    q.addEventListener("click", function () {
      const answer = this.nextElementSibling;
      const icon = this.querySelector("i");
      const isOpening = answer.classList.contains("hidden");

      // Close all
      questions.forEach((other) => {
        const a = other.nextElementSibling;
        const i = other.querySelector("i");
        if (!a.classList.contains("hidden")) a.classList.add("hidden");
        if (i) i.style.transform = "rotate(0deg)";
      });

      // Toggle this one
      if (isOpening) {
        answer.classList.remove("hidden");
        if (icon) icon.style.transform = "rotate(180deg)";
      } else {
        answer.classList.add("hidden");
        if (icon) icon.style.transform = "rotate(0deg)";
      }
    });
  });
}
