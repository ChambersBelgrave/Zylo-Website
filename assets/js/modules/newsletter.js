// assets/js/modules/newsletter.js
export default function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const firstName = /** @type {HTMLInputElement} */ (document.getElementById("first-name"))?.value || "";
    const lastName  = /** @type {HTMLInputElement} */ (document.getElementById("last-name"))?.value || "";
    const email     = /** @type {HTMLInputElement} */ (document.getElementById("email"))?.value || "";

    console.log("Form submitted:", { firstName, lastName, email });
    alert("Thank you for subscribing! You will receive updates about upcoming Lakay Events.");
    form.reset();
  });
}
