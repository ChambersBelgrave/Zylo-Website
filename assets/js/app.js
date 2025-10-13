// assets/js/app.js
// Entry point – loads partials, then wires up all interactive modules.

import initNav from "./modules/nav.js";
import initFAQ from "./modules/faq.js";
import initLightbox from "./modules/lightbox.js";
import initCookies from "./modules/cookies.js";
import initModals from "./modules/modals.js";
import initSmoothScroll from "./modules/smoothscroll.js";
import initNewsletter from "./modules/newsletter.js";
import initIcons from "./modules/icons.js";
import initTickets from "./modules/tickets.js"; // NEW: ticket selection modal

/**
 * Load HTML partials into any element that has a [data-include] attribute.
 * Ensures all markup (header, sections, modals) exists before modules run.
 */
async function loadPartials() {
  const hosts = document.querySelectorAll("[data-include]");
  if (!hosts.length) return;

  await Promise.all(
    Array.from(hosts).map(async (el) => {
      const url = el.getAttribute("data-include");
      if (!url) return;
      try {
        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const html = await res.text();
        el.innerHTML = html;
      } catch (err) {
        console.error("Failed to load partial:", url, err);
        el.innerHTML = `<div class="p-4 text-sm text-red-400 border border-red-600/40 rounded-lg">Failed to load ${url}</div>`;
      }
    })
  );
}

async function boot() {
  // 1) Inject partials
  await loadPartials();

  // 2) Init icons AFTER partials so icons in included HTML are processed
  initIcons();

  // 3) Wire up all behaviour
  initNav();
  initFAQ();
  initLightbox();
  initCookies();
  initModals();
  initSmoothScroll();
  initNewsletter();
  initTickets(); // NEW: attach Book Now modal logic (requires modals + events partials)
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
