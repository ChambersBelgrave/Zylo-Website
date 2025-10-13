// assets/js/modules/nav.js
export default function initNav() {
  const btn = document.getElementById("mobile-menu-button");
  const menu = document.getElementById("mobile-menu");
  const nav = document.querySelector(".site-nav");

  const isOpen = () => menu && !menu.classList.contains("hidden");
  const openMenu = () => {
    if (!menu) return;
    menu.classList.remove("hidden");
    if (btn) btn.setAttribute("aria-expanded", "true");
  };
  const closeMenu = () => {
    if (!menu) return;
    if (!menu.classList.contains("hidden")) {
      menu.classList.add("hidden");
    }
    if (btn) btn.setAttribute("aria-expanded", "false");
  };
  const toggleMenu = () => (isOpen() ? closeMenu() : openMenu());

  // Mobile toggle
  if (btn && menu) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent outside-click handler from firing immediately
      toggleMenu();
    });

    // Close when a mobile nav link is chosen
    document.querySelectorAll('#mobile-menu a[href^="#"]').forEach((a) => {
      a.addEventListener("click", () => {
        closeMenu();
      });
    });

    // Prevent clicks inside the menu from bubbling to the document and closing it
    menu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // Fixed header layout adjustments + scroll shadow
  if (nav) {
    document.body.classList.add("with-fixed-nav");

    const setNavHeight = () => {
      const h = nav.offsetHeight || 64;
      document.documentElement.style.setProperty("--nav-height", `${h}px`);
    };

    // Update on load and resize (handles responsive header heights)
    setNavHeight();
    window.addEventListener("resize", () => {
      setNavHeight();
      // If we grow to desktop, ensure menu is closed and ARIA is reset
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    });

    // Add a subtle shadow when the user scrolls
    const onScroll = () => {
      if (window.scrollY > 2) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Close on outside click (anywhere outside the header/nav)
  document.addEventListener("click", (e) => {
    if (!menu || !nav) return;
    if (!isOpen()) return;
    // If the click is outside the entire fixed header (which contains the menu), close it
    if (!nav.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });
}
