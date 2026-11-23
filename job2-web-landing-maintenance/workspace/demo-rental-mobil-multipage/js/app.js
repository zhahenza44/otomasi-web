(function () {
  "use strict";

  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Buka menu");
      });
    });

    document.addEventListener("click", (event) => {
      if (menu.classList.contains("open") && !menu.contains(event.target) && !toggle.contains(event.target)) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Buka menu");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("open")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Buka menu");
        toggle.focus();
      }
    });
  }

  const header = document.querySelector(".site-header");
  if (header) {
    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  const page = document.body.dataset.page || "";
  const navKey = page === "detail" || page === "booking" ? "katalog" : page;

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const active = link.dataset.nav === navKey;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
  });

  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());

  const floatWa = document.querySelector("[data-float-wa]");
  if (floatWa) {
    floatWa.href = getWhatsAppUrl("Halo Arunika Drive, saya ingin bertanya tentang sewa mobil.");
  }

  const searchForm = document.querySelector("#search-form");
  if (searchForm) {
    const dateInput = searchForm.querySelector('input[name="start"]');
    if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(searchForm);
      const params = new URLSearchParams();

      ["type", "days", "start"].forEach((key) => {
        const value = String(data.get(key) || "").trim();
        if (value) params.set(key, value);
      });

      window.location.href = "katalog.html" + (params.toString() ? "?" + params.toString() : "");
    });
  }

  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealElements.length > 0) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealElements.forEach((element) => observer.observe(element));
    } else {
      revealElements.forEach((element) => element.classList.add("is-visible"));
    }
  }
})();
