(function () {
  "use strict";

  const grid = document.querySelector("#catalog-grid");
  if (!grid) return;

  const searchInput = document.querySelector("#catalog-search");
  const sortSelect = document.querySelector("#sort-select");
  const resultCount = document.querySelector("#result-count");
  const emptyState = document.querySelector("#empty-state");
  const resetButton = document.querySelector("#reset-filter");
  const emptyReset = document.querySelector("#empty-reset");
  const chips = Array.from(document.querySelectorAll(".chip"));

  const validTypes = ["all", "mpv", "suv", "sedan", "hatchback"];
  const initialType = getParam("type");

  const state = {
    type: validTypes.includes(initialType) ? initialType : "all",
    q: getParam("q") || "",
    sort: "recommended",
    days: getParam("days") || "",
    start: getParam("start") || ""
  };

  searchInput.value = state.q;

  function syncUrl() {
    const params = new URLSearchParams();

    if (state.type !== "all") params.set("type", state.type);
    if (state.q.trim()) params.set("q", state.q.trim());
    if (state.days) params.set("days", state.days);
    if (state.start) params.set("start", state.start);
    if (state.sort !== "recommended") params.set("sort", state.sort);

    const query = params.toString();
    history.replaceState(null, "", "katalog.html" + (query ? "?" + query : ""));
  }

  function render() {
    const query = state.q.trim().toLowerCase();

    let items = CARS.filter((car) => {
      const matchesType = state.type === "all" || car.type === state.type;
      const haystack = [car.name, car.typeLabel, car.fuel, car.transmission].join(" ").toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      return matchesType && matchesQuery;
    });

    if (state.sort === "price-asc") items = items.slice().sort((a, b) => a.price - b.price);
    if (state.sort === "price-desc") items = items.slice().sort((a, b) => b.price - a.price);
    if (state.sort === "rating-desc") items = items.slice().sort((a, b) => b.rating - a.rating);

    const extras = [];
    if (state.days) extras.push("days=" + encodeURIComponent(state.days));
    if (state.start) extras.push("start=" + encodeURIComponent(state.start));

    grid.innerHTML = items.map((car) => carCardHtml(car, extras.join("&"))).join("");
    grid.hidden = items.length === 0;
    emptyState.hidden = items.length > 0;

    if (items.length === 0) {
      resultCount.textContent = "Tidak ada mobil yang cocok";
    } else {
      const durationNote = state.days ? ` • estimasi ${state.days} hari` : "";
      resultCount.textContent = `Menampilkan ${items.length} dari ${CARS.length} mobil${durationNote}`;
    }

    chips.forEach((chip) => {
      const active = chip.dataset.type === state.type;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    });

    syncUrl();
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      state.type = chip.dataset.type || "all";
      render();
    });
  });

  searchInput.addEventListener("input", () => {
    state.q = searchInput.value;
    render();
  });

  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    render();
  });

  function resetFilters() {
    state.type = "all";
    state.q = "";
    state.sort = "recommended";
    searchInput.value = "";
    sortSelect.value = "recommended";
    render();
    searchInput.focus();
  }

  resetButton.addEventListener("click", resetFilters);
  emptyReset.addEventListener("click", resetFilters);

  render();
})();
