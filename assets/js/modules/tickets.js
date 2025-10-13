// assets/js/modules/tickets.js
export default function initTickets() {
  const body = document.body;
  const modal = document.getElementById("ticket-modal");
  if (!modal) return; // modal partial not loaded yet

  const modalContent = modal.querySelector(".modal-content");
  const closeBtn = modal.querySelector(".modal-close");
  const subtitle = document.getElementById("ticket-modal-subtitle");
  const typeList = document.getElementById("ticket-type-list");
  const qtySelect = document.getElementById("ticket-quantity");
  const totalEl = document.getElementById("ticket-total");
  const form = document.getElementById("ticket-form");

  const bookNowButtons = document.querySelectorAll(".book-now");

  let lastTriggerBtn = null;
  let currentTickets = [];

  const gbp = (n) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

  function lockScroll() { body.classList.add("overflow-hidden"); }
  function unlockScroll() { body.classList.remove("overflow-hidden"); }

  function focusable(container) {
    return Array.from(
      container.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function renderTicketTypes(tickets) {
    typeList.innerHTML = "";
    tickets.forEach((t, idx) => {
      const id = `ticket-type-${idx}`;
      const row = document.createElement("label");
      row.setAttribute("for", id);
      row.className = "flex items-center justify-between p-3 rounded-lg border border-muted cursor-pointer hover:opacity-90";
      row.style.backgroundColor = "var(--bg-2)";

      const left = document.createElement("div");
      left.className = "flex items-center space-x-3";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "ticketType";
      radio.id = id;
      radio.value = t.label;
      radio.className = "h-4 w-4";
      if (idx === 0) radio.checked = true;

      const label = document.createElement("span");
      label.className = "font-medium";
      label.textContent = t.label;

      left.appendChild(radio);
      left.appendChild(label);

      const price = document.createElement("span");
      price.className = "text-sm text-[var(--text-1)]";
      price.textContent = gbp(t.price);

      row.appendChild(left);
      row.appendChild(price);
      typeList.appendChild(row);
    });
  }

  function getSelectedTicket() {
    const checked = modal.querySelector('input[name="ticketType"]:checked');
    if (!checked) return currentTickets[0];
    return currentTickets.find((t) => t.label === checked.value) || currentTickets[0];
  }

  function updateTotal() {
    const sel = getSelectedTicket();
    const qty = parseInt(qtySelect.value || "1", 10);
    const total = (sel?.price || 0) * qty;
    totalEl.textContent = gbp(total);
  }

  function openModal(eventName, tickets) {
    currentTickets = tickets || [];
    subtitle.textContent = eventName || "Tickets";

    // Build list + ensure qty 1..10
    renderTicketTypes(currentTickets);
    if (!qtySelect.options.length || qtySelect.options.length < 10) {
      qtySelect.innerHTML = "";
      for (let i = 1; i <= 10; i++) {
        const opt = document.createElement("option");
        opt.value = String(i);
        opt.textContent = String(i);
        qtySelect.appendChild(opt);
      }
    }
    qtySelect.value = "1";
    updateTotal();

    // Show
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    lockScroll();

    // Focus: move into modal
    const initial = modal.querySelector('input[name="ticketType"]:checked') || modalContent;
    initial.focus({ preventScroll: true });

    // Focus trap
    function onTab(e) {
      if (e.key !== "Tab") return;
      const nodes = focusable(modalContent);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
    modal._tabHandler = onTab;
    modal.addEventListener("keydown", onTab);

    // ESC
    function onEsc(e) { if (e.key === "Escape") closeModal(); }
    modal._escHandler = onEsc;
    window.addEventListener("keydown", onEsc);
  }

  function closeModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    unlockScroll();

    // cleanup
    modal.removeEventListener("keydown", modal._tabHandler || (() => {}));
    window.removeEventListener("keydown", modal._escHandler || (() => {}));
    modal._tabHandler = null;
    modal._escHandler = null;

    // return focus
    lastTriggerBtn?.focus({ preventScroll: true });
    lastTriggerBtn = null;
  }

  // Wire buttons
  bookNowButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      lastTriggerBtn = this;
      const name = this.getAttribute("data-event") || "Tickets";
      let tickets = [];
      try { tickets = JSON.parse(this.getAttribute("data-tickets") || "[]"); } catch {}
      if (!Array.isArray(tickets) || tickets.length === 0) tickets = [{ label: "General Admission", price: 0 }];
      openModal(name, tickets);
    });
  });

  // Recalc total on changes
  qtySelect.addEventListener("change", updateTotal);
  typeList.addEventListener("change", (e) => {
    if (e.target && e.target.name === "ticketType") updateTotal();
  });

  // Close: X and overlay
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  // Prevent form submit (demo)
  form.addEventListener("submit", (e) => e.preventDefault());
}
