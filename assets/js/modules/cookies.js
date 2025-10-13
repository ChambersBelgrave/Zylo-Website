// assets/js/modules/cookies.js
export default function initCookies() {
  const banner = document.getElementById("cookie-banner");
  const accept = document.getElementById("accept-cookies");
  const prefsBtn = document.getElementById("cookie-preferences");
  const modal = document.getElementById("cookie-modal");
  const save = document.getElementById("save-preferences");

  // Show banner if not accepted
  if (banner && !localStorage.getItem("cookiesAccepted")) {
    setTimeout(() => banner.classList.add("show"), 1000);
  }

  accept?.addEventListener("click", () => {
    localStorage.setItem("cookiesAccepted", "true");
    banner?.classList.remove("show");
  });

  prefsBtn?.addEventListener("click", () => {
    if (modal) modal.style.display = "flex";
  });

  // Toggle switches
  const toggles = document.querySelectorAll(".toggle-checkbox");
  toggles.forEach((checkbox) => {
    const label = checkbox.nextElementSibling;
    const dot = label?.querySelector(".toggle-dot");
    const prefName = checkbox.id + "Cookies";
    const saved = localStorage.getItem(prefName);

    // Initialize from saved state
    if (saved !== null) {
      checkbox.checked = saved === "true";
    }
    // Apply visuals
    applyToggleVisuals(label, dot, checkbox.checked);

    // Clicking label moves the toggle
    label?.addEventListener("click", (e) => {
      e.preventDefault();
      checkbox.checked = !checkbox.checked;
      applyToggleVisuals(label, dot, checkbox.checked);
    });
  });

  save?.addEventListener("click", () => {
    const analytics = document.getElementById("analytics");
    const marketing = document.getElementById("marketing");
    if (analytics) localStorage.setItem("analyticsCookies", String(analytics.checked));
    if (marketing) localStorage.setItem("marketingCookies", String(marketing.checked));
    localStorage.setItem("cookiesAccepted", "true");

    if (modal) modal.style.display = "none";
    banner?.classList.remove("show");
  });
}

function applyToggleVisuals(label, dot, isOn) {
  if (!label || !dot) return;
  dot.style.transform = isOn ? "translateX(1rem)" : "translateX(0)";
  label.style.backgroundColor = isOn ? "#22c55e" : "#334155";
}
