(function () {
  "use strict";

  const grid = document.querySelector("#featured-grid");
  if (!grid) return;

  const featured = ["avanza", "agya", "fortuner"]
    .map((id) => getCarById(id))
    .filter(Boolean);

  grid.innerHTML = featured.map((car) => carCardHtml(car)).join("");
})();
