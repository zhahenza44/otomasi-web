(function () {
  "use strict";

  const root = document.querySelector("#booking-root");
  if (!root) return;

  const form = document.querySelector("#booking-form");
  const carSelect = document.querySelector("#car-select");
  const nameInput = document.querySelector("#nama");
  const waInput = document.querySelector("#whatsapp");
  const startInput = document.querySelector("#start");
  const daysSelect = document.querySelector("#days");
  const deliverySelect = document.querySelector("#delivery");
  const notesInput = document.querySelector("#notes");

  const summaryImage = document.querySelector("#summary-image");
  const summaryName = document.querySelector("#summary-name");
  const summaryType = document.querySelector("#summary-type");
  const summaryRows = document.querySelector("#summary-rows");
  const summaryTotal = document.querySelector("#summary-total");

  const requestedCar = getCarById(getParam("id"));

  carSelect.innerHTML = CARS.map((car) => {
    const selected = requestedCar && requestedCar.id === car.id ? " selected" : "";
    return `<option value="${car.id}"${selected}>${car.name} — ${formatRupiah(car.price)}/hari</option>`;
  }).join("");

  const paramDays = getParam("days");
  if (paramDays && daysSelect.querySelector(`option[value="${paramDays}"]`)) {
    daysSelect.value = paramDays;
  }

  const today = new Date();
  startInput.min = today.toISOString().split("T")[0];
  const paramStart = getParam("start");
  if (paramStart) {
    startInput.value = paramStart;
  } else {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    startInput.value = tomorrow.toISOString().split("T")[0];
  }

  function selectedCar() {
    return getCarById(carSelect.value) || CARS[0];
  }

  function selectedDriver() {
    const checked = form.querySelector('input[name="driver"]:checked');
    return checked ? checked.value === "driver" : false;
  }

  function renderSummary() {
    const car = selectedCar();
    const calc = calcBooking(car, daysSelect.value, selectedDriver(), deliverySelect.value);

    summaryImage.src = car.image;
    summaryImage.alt = "Ilustrasi " + car.name;
    summaryName.textContent = car.name;
    summaryType.textContent = `${car.typeLabel} • ${car.seats} penumpang • ${car.transmission}`;

    const rows = [
      { label: `${formatRupiah(car.price)} × ${calc.days} hari`, value: formatRupiah(calc.base) }
    ];

    if (calc.driverFee > 0) {
      rows.push({ label: "Sopir", value: formatRupiah(calc.driverFee) });
    }

    if (calc.deliveryFee > 0) {
      rows.push({ label: "Antar-jemput", value: formatRupiah(calc.deliveryFee) });
    }

    if (calc.discount > 0) {
      rows.push({ label: "Diskon sewa 7+ hari", value: "−" + formatRupiah(calc.discount), discount: true });
    }

    summaryRows.innerHTML = rows
      .map(
        (row) => `
        <div class="summary-row${row.discount ? " is-discount" : ""}">
          <span>${row.label}</span>
          <strong>${row.value}</strong>
        </div>`
      )
      .join("");

    summaryTotal.textContent = formatRupiah(calc.total);
  }

  function clearErrors() {
    form.querySelectorAll(".field-error").forEach((element) => {
      element.textContent = "";
    });
    form.querySelectorAll(".input, .select, .textarea").forEach((element) => {
      element.removeAttribute("aria-invalid");
    });
  }

  function setError(fieldName, message) {
    const error = form.querySelector(`[data-error-for="${fieldName}"]`);
    if (error) error.textContent = message;
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (field) field.setAttribute("aria-invalid", "true");
  }

  function validate() {
    clearErrors();
    let valid = true;

    if (!carSelect.value) {
      setError("car", "Pilih mobil terlebih dahulu.");
      valid = false;
    }

    if (nameInput.value.trim().length < 3) {
      setError("nama", "Nama minimal 3 karakter.");
      valid = false;
    }

    const digits = waInput.value.replace(/\D/g, "");
    if (!/^(?:62|0)8[0-9]{7,12}$/.test(digits)) {
      setError("whatsapp", "Masukkan nomor WhatsApp yang valid, misalnya 081234567890.");
      valid = false;
    }

    if (!startInput.value) {
      setError("start", "Pilih tanggal mulai sewa.");
      valid = false;
    } else {
      const selectedDate = new Date(startInput.value + "T00:00:00");
      const minDate = new Date(startInput.min + "T00:00:00");
      if (selectedDate < minDate) {
        setError("start", "Tanggal mulai tidak boleh di masa lalu.");
        valid = false;
      }
    }

    if (!daysSelect.value) {
      setError("days", "Pilih durasi sewa.");
      valid = false;
    }

    return valid;
  }

  function formatDate(value) {
    if (!value) return "-";
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(
      new Date(value + "T00:00:00")
    );
  }

  function showSuccess(payload) {
    const waUrl = getWhatsAppUrl(payload.message);

    root.innerHTML = `
      <div class="success-card">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>
        </div>
        <h2>Booking siap dikonfirmasi</h2>
        <p>Terima kasih, ${payload.name}. Ringkasan booking sudah disiapkan. Klik tombol di bawah untuk mengirim detail ke tim kami via WhatsApp dan mengecek ketersediaan unit.</p>
        <div class="summary-card" style="max-width: 460px; margin: 0 auto 1.4rem; text-align: left; position: static;">
          <div class="summary-rows" style="margin-bottom: .9rem;">
            <div class="summary-row"><span>Mobil</span><strong>${payload.car.name}</strong></div>
            <div class="summary-row"><span>Mulai</span><strong>${formatDate(payload.start)}</strong></div>
            <div class="summary-row"><span>Durasi</span><strong>${payload.calc.days} hari</strong></div>
            <div class="summary-row"><span>Pengemudi</span><strong>${payload.withDriver ? "Dengan sopir" : "Lepas kunci"}</strong></div>
            <div class="summary-row"><span>Serah terima</span><strong>${payload.deliveryLabel}</strong></div>
          </div>
          <div class="summary-total" style="margin-bottom: 0;">
            <span>Total estimasi</span>
            <strong>${formatRupiah(payload.calc.total)}</strong>
          </div>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: .7rem; justify-content: center;">
          <a class="btn" href="${waUrl}" target="_blank" rel="noopener">Kirim via WhatsApp</a>
          <a class="btn btn-ghost" href="katalog.html">Kembali ke katalog</a>
        </div>
      </div>`;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) {
      const firstError = form.querySelector('[aria-invalid="true"]');
      if (firstError) firstError.focus();
      return;
    }

    const car = selectedCar();
    const withDriver = selectedDriver();
    const calc = calcBooking(car, daysSelect.value, withDriver, deliverySelect.value);
    const deliveryLabel = DELIVERY_LABELS[deliverySelect.value] || DELIVERY_LABELS.office;
    const notes = notesInput.value.trim();

    const lines = [
      "Halo Arunika Drive, saya ingin booking mobil:",
      "",
      `Mobil: ${car.name}`,
      `Nama: ${nameInput.value.trim()}`,
      `WhatsApp: ${waInput.value.trim()}`,
      `Tanggal mulai: ${formatDate(startInput.value)}`,
      `Durasi: ${calc.days} hari`,
      `Pengemudi: ${withDriver ? "Dengan sopir" : "Lepas kunci"}`,
      `Serah terima: ${deliveryLabel}`,
      `Estimasi total: ${formatRupiah(calc.total)}`
    ];

    if (notes) lines.push(`Catatan: ${notes}`);
    lines.push("", "Mohon konfirmasi ketersediaan unit. Terima kasih.");

    showSuccess({
      car,
      calc,
      withDriver,
      deliveryLabel,
      start: startInput.value,
      name: nameInput.value.trim(),
      message: lines.join("\n")
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  [carSelect, daysSelect, deliverySelect].forEach((element) => {
    element.addEventListener("change", renderSummary);
  });

  form.querySelectorAll('input[name="driver"]').forEach((radio) => {
    radio.addEventListener("change", renderSummary);
  });

  renderSummary();
})();
