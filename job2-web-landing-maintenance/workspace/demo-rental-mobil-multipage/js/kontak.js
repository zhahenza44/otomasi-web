(function () {
  "use strict";

  const form = document.querySelector("#contact-form");
  if (!form) return;

  const nameInput = form.querySelector("#contact-name");
  const waInput = form.querySelector("#contact-wa");
  const topicSelect = form.querySelector("#contact-topic");
  const messageInput = form.querySelector("#contact-message");

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

    if (nameInput.value.trim().length < 3) {
      setError("name", "Nama minimal 3 karakter.");
      valid = false;
    }

    const digits = waInput.value.replace(/\D/g, "");
    if (!/^(?:62|0)8[0-9]{7,12}$/.test(digits)) {
      setError("whatsapp", "Masukkan nomor WhatsApp yang valid, misalnya 081234567890.");
      valid = false;
    }

    if (messageInput.value.trim().length < 10) {
      setError("message", "Tulis pesan minimal 10 karakter agar kami bisa membantu.");
      valid = false;
    }

    return valid;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) {
      const firstError = form.querySelector('[aria-invalid="true"]');
      if (firstError) firstError.focus();
      return;
    }

    const message = [
      "Halo Arunika Drive, saya ingin bertanya.",
      "",
      `Nama: ${nameInput.value.trim()}`,
      `WhatsApp: ${waInput.value.trim()}`,
      `Kebutuhan: ${topicSelect.value}`,
      "",
      messageInput.value.trim()
    ].join("\n");

    window.open(getWhatsAppUrl(message), "_blank", "noopener");

    const card = document.querySelector("#contact-form-card");
    if (card) {
      card.innerHTML = `
        <div class="success-card" style="border: 0; background: transparent; padding: 1.5rem 0.5rem;">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>
          </div>
          <h2>Pesan siap dikirim</h2>
          <p>WhatsApp sudah dibuka di tab baru. Kirim pesan tersebut agar tim kami bisa membalas. Jika tab tidak terbuka, gunakan tombol di bawah.</p>
          <a class="btn" href="${getWhatsAppUrl(message)}" target="_blank" rel="noopener">Buka WhatsApp</a>
        </div>`;
    }
  });
})();
