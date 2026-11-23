(function () {
  "use strict";

  const state = {
    query: "",
    priority: "all",
    status: "all",
    activeLeadId: null,
    lastTrigger: null
  };

  const els = {
    total: document.querySelector("#kpi-total"),
    high: document.querySelector("#kpi-high"),
    highNote: document.querySelector("#kpi-high-note"),
    response: document.querySelector("#kpi-response"),
    followup: document.querySelector("#kpi-followup"),
    navCount: document.querySelector("#nav-lead-count"),
    workflowCount: document.querySelector("#workflow-lead-count"),
    dailyChart: document.querySelector("#daily-chart"),
    chartTotal: document.querySelector("#chart-total"),
    sourceList: document.querySelector("#source-list"),
    rows: document.querySelector("#lead-rows"),
    tableWrap: document.querySelector(".table-wrap"),
    empty: document.querySelector("#table-empty"),
    countLabel: document.querySelector("#lead-count-label"),
    search: document.querySelector("#lead-search"),
    statusSelect: document.querySelector("#status-select"),
    chips: document.querySelector("#priority-chips"),
    reset: document.querySelector("#reset-filters"),
    drawer: document.querySelector("#drawer"),
    drawerContent: document.querySelector("#drawer-content"),
    drawerOverlay: document.querySelector("#drawer-overlay"),
    simulateBtn: document.querySelector("#simulate-btn"),
    simulateOverlay: document.querySelector("#simulate-overlay"),
    simulateForm: document.querySelector("#simulate-form"),
    simulateClose: document.querySelector("#simulate-close"),
    simulateCancel: document.querySelector("#simulate-cancel"),
    sidebar: document.querySelector("#sidebar"),
    sidebarScrim: document.querySelector("#sidebar-scrim"),
    menuBtn: document.querySelector("#menu-btn"),
    toast: document.querySelector("#toast")
  };

  const SOURCE_ICONS = {
    "Landing Page": "globe",
    Instagram: "camera",
    WhatsApp: "chat",
    Referral: "users"
  };

  const TL_ICONS = {
    in: "inbox",
    ai: "sparkles",
    mail: "mail",
    chat: "chat",
    clock: "clock",
    bell: "bell",
    doc: "doc",
    won: "check"
  };

  const PRIORITY_RING = {
    high: "#e11d48",
    medium: "#d97706",
    low: "#0f766e"
  };

  const INTENT_RULES = [
    { intent: "otomasi_whatsapp", label: "Otomasi WhatsApp", keywords: ["whatsapp", "follow-up", "follow up", "chat"] },
    { intent: "web_landing", label: "Website / Landing Page", keywords: ["landing", "website", "web", "katalog", "company profile"] },
    { intent: "integrasi_workflow", label: "Integrasi workflow", keywords: ["integrasi", "otomasi", "workflow", "google sheets", "crm", "api"] },
    { intent: "booking_system", label: "Sistem booking", keywords: ["booking", "reservasi", "jadwal", "antrean"] },
    { intent: "dashboard_analitik", label: "Dashboard analitik", keywords: ["dashboard", "laporan", "analitik", "report"] }
  ];

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function icon(name) {
    return `<svg aria-hidden="true"><use href="#icon-${name}"/></svg>`;
  }

  function initials(name) {
    return String(name)
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function avatarClass(index) {
    return "avatar-" + (index % 6);
  }

  function timeAgo(iso) {
    const diff = Math.max(0, Date.now() - new Date(iso).getTime());
    const minutes = Math.max(1, Math.round(diff / 60000));
    if (minutes < 60) return minutes + " menit lalu";
    const hours = Math.round(minutes / 60);
    if (hours < 24) return hours + " jam lalu";
    const days = Math.round(hours / 24);
    if (days < 7) return days + " hari lalu";
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  }

  function fullDate(iso) {
    return new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  }

  function formatPhone(phone) {
    if (!phone) return "Tidak ada";
    const digits = String(phone).replace(/\D/g, "");
    if (!digits) return "Tidak ada";
    const local = digits.startsWith("62") ? digits.slice(2) : digits;
    const groups = local.replace(/(\d{3})(?=\d)/g, "$1-").replace(/-(\d{3,4})$/, "-$1");
    return "+62 " + groups;
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      els.toast.classList.remove("is-visible");
    }, 3200);
  }

  function priorityLabel(priority) {
    return PRIORITY_LABELS[priority] || priority;
  }

  function statusLabel(status) {
    return STATUS_LABELS[status] || status;
  }

  function updateKpis() {
    const total = LEADS.length;
    const high = LEADS.filter((lead) => lead.priority === "high").length;
    const responded = LEADS.filter((lead) => typeof lead.responseMins === "number");
    const avg = responded.length
      ? Math.round(responded.reduce((sum, lead) => sum + lead.responseMins, 0) / responded.length)
      : 0;
    const followups = LEADS.reduce((sum, lead) => sum + lead.timeline.filter((item) => item.type === "clock").length, 0);

    els.total.textContent = String(total);
    els.high.textContent = String(high);
    els.highNote.textContent = Math.round((high / total) * 100) + "% dari total lead";
    els.response.textContent = avg + " mnt";
    els.followup.textContent = String(FOLLOWUPS_ARCHIVED + followups);
    els.navCount.textContent = String(total);
    if (els.workflowCount) els.workflowCount.textContent = String(total);

    document.querySelectorAll("#priority-chips .chip").forEach((chip) => {
      const key = chip.dataset.priority;
      const count = key === "all" ? total : LEADS.filter((lead) => lead.priority === key).length;
      const label = chip.querySelector("span");
      if (label) label.textContent = String(count);
    });
  }

  function renderChart() {
    const max = Math.max(...DAILY_LEADS.map((item) => item.value));
    els.dailyChart.innerHTML = DAILY_LEADS.map((item, index) => {
      const height = Math.round((item.value / max) * 100);
      const today = index === DAILY_LEADS.length - 1 ? " is-today" : "";
      return `
        <div class="bar-col${today}">
          <span class="bar-value">${item.value}</span>
          <div class="bar-track"><div class="bar-fill" style="--h:${height}%"></div></div>
          <span class="bar-day">${esc(item.day)}</span>
        </div>`;
    }).join("");
    els.chartTotal.textContent = String(DAILY_LEADS.reduce((sum, item) => sum + item.value, 0));
  }

  function renderSources() {
    els.sourceList.innerHTML = SOURCES.map((source) => `
      <li class="source-row">
        <div class="source-top">
          ${icon(SOURCE_ICONS[source.name] || "globe")}
          <span>${esc(source.name)}</span>
          <strong>${source.percent}%</strong>
        </div>
        <div class="source-track">
          <div class="source-fill" style="width:${source.percent}%;--bar:${source.color}"></div>
        </div>
      </li>`).join("");
  }

  function getFilteredLeads() {
    const query = state.query.trim().toLowerCase();

    return LEADS.filter((lead) => {
      const matchesPriority = state.priority === "all" || lead.priority === state.priority;
      const matchesStatus = state.status === "all" || lead.status === state.status;
      const haystack = [lead.name, lead.company, lead.source, lead.intent, lead.message].join(" ").toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      return matchesPriority && matchesStatus && matchesQuery;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function renderLeads() {
    const items = getFilteredLeads();

    els.rows.innerHTML = items.map((lead, index) => `
      <tr data-id="${esc(lead.id)}" tabindex="0" aria-label="Buka detail ${esc(lead.name)}">
        <td>
          <div class="lead-cell">
            <span class="avatar ${avatarClass(index)}">${esc(initials(lead.name))}</span>
            <div>
              <strong>${esc(lead.name)}</strong>
              <span>${esc(lead.company || "Personal")}</span>
            </div>
          </div>
        </td>
        <td>
          <span class="source-cell">${icon(SOURCE_ICONS[lead.source] || "globe")}${esc(lead.source)}</span>
        </td>
        <td><span class="priority ${esc(lead.priority)}">${priorityLabel(lead.priority)} · ${lead.score}</span></td>
        <td><span class="status ${esc(lead.status)}">${statusLabel(lead.status)}</span></td>
        <td class="time-cell">${timeAgo(lead.createdAt)}</td>
        <td>
          <button class="icon-btn row-open" type="button" tabindex="-1" aria-label="Buka detail ${esc(lead.name)}">
            ${icon("chevron")}
          </button>
        </td>
      </tr>`).join("");

    els.tableWrap.hidden = items.length === 0;
    els.empty.hidden = items.length > 0;
    els.countLabel.textContent = items.length
      ? `Menampilkan ${items.length} dari ${LEADS.length} lead`
      : "Tidak ada lead yang cocok";
  }

  function renderAll() {
    updateKpis();
    renderLeads();
  }

  function timelineHtml(lead) {
    return lead.timeline.map((item) => `
      <li>
        <span class="tl-dot ${esc(item.type)}">${icon(TL_ICONS[item.type] || "clock")}</span>
        <div class="tl-body">
          <strong>${esc(item.title)}</strong>
          <span>${fullDate(item.time)}</span>
        </div>
      </li>`).join("");
  }

  function drawerHtml(lead) {
    return `
      <div class="drawer-scroll">
        <div class="drawer-top">
          <div class="drawer-profile">
            <span class="avatar">${esc(initials(lead.name))}</span>
            <div>
              <h2 id="drawer-title">${esc(lead.name)}</h2>
              <p>${esc(lead.role || "Lead")} · ${esc(lead.company || "Personal")}</p>
            </div>
          </div>
          <button class="icon-btn" type="button" id="drawer-close" aria-label="Tutup detail">
            ${icon("x")}
          </button>
        </div>

        <div class="drawer-badges">
          <span class="badge ${esc(lead.priority)}">${priorityLabel(lead.priority)} · skor ${lead.score}</span>
          <span class="badge neutral">${statusLabel(lead.status)}</span>
          <span class="badge ai">${icon("sparkles")} AI classified</span>
        </div>

        <div class="drawer-section">
          <h3>Kontak &amp; sumber</h3>
          <div class="contact-grid">
            <div class="contact-item"><span>${icon("mail")} Email</span><strong>${esc(lead.email || "Tidak ada")}</strong></div>
            <div class="contact-item"><span>${icon("phone")} WhatsApp</span><strong>${esc(formatPhone(lead.whatsapp))}</strong></div>
            <div class="contact-item"><span>${icon("globe")} Sumber</span><strong>${esc(lead.source)}</strong></div>
            <div class="contact-item"><span>${icon("clock")} Masuk</span><strong>${fullDate(lead.createdAt)}</strong></div>
          </div>
        </div>

        <div class="drawer-section">
          <h3>Ringkasan AI</h3>
          <div class="ai-card">
            <div class="ai-card-head">
              <span class="ai-card-title">${icon("sparkles")} Analisis otomatis</span>
              <span class="badge neutral">${esc(lead.intent)}</span>
            </div>
            <p>${esc(lead.summary)}</p>
            <div class="ai-meta">
              <div class="score-ring" style="--score:${lead.score};--ring:${PRIORITY_RING[lead.priority] || "#4f46e5"}">
                <span>${lead.score}</span>
              </div>
              <div>
                <strong style="display:block;font-size:.76rem;">Skor kualifikasi</strong>
                <span style="color:var(--muted);font-size:.72rem;">${priorityLabel(lead.priority)} — ${lead.priority === "high" ? "prioritas untuk dihubungi hari ini" : lead.priority === "medium" ? "ikuti up dengan penawaran" : "masuk daftar nurture"}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="drawer-section">
          <h3>Draft balasan AI</h3>
          <div class="reply-box">
            <button class="copy-btn" type="button" id="copy-reply">${icon("copy")} Copy</button>
            <p>${esc(lead.reply)}</p>
          </div>
        </div>

        <div class="drawer-section">
          <h3>Aktivitas</h3>
          <ul class="timeline">${timelineHtml(lead)}</ul>
        </div>
      </div>

      <div class="drawer-actions">
        <button class="btn btn-ghost" type="button" data-drawer-action="won">${icon("check")} Tandai closing</button>
        <button class="btn btn-primary" type="button" data-drawer-action="contacted">${icon("chat")} Tandai dihubungi</button>
      </div>`;
  }

  function openDrawer(id, trigger) {
    const lead = LEADS.find((item) => item.id === id);
    if (!lead) return;

    state.activeLeadId = id;
    state.lastTrigger = trigger || document.activeElement;
    els.drawerContent.innerHTML = drawerHtml(lead);
    els.drawer.classList.add("is-open");
    els.drawer.setAttribute("aria-hidden", "false");
    els.drawerOverlay.hidden = false;
    document.body.style.overflow = "hidden";

    const closeBtn = els.drawer.querySelector("#drawer-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    els.drawer.classList.remove("is-open");
    els.drawer.setAttribute("aria-hidden", "true");
    els.drawerOverlay.hidden = true;
    document.body.style.overflow = "";
    state.activeLeadId = null;
    if (state.lastTrigger && typeof state.lastTrigger.focus === "function") {
      state.lastTrigger.focus();
    }
  }

  function refreshDrawer(lead) {
    const scroll = els.drawer.querySelector(".drawer-scroll");
    const top = scroll ? scroll.scrollTop : 0;
    els.drawerContent.innerHTML = drawerHtml(lead);
    const nextScroll = els.drawer.querySelector(".drawer-scroll");
    if (nextScroll) nextScroll.scrollTop = top;
  }

  function setStatus(id, status) {
    const lead = LEADS.find((item) => item.id === id);
    if (!lead || lead.status === status) {
      showToast("Status lead sudah sama.");
      return;
    }

    lead.status = status;
    lead.timeline.push({
      time: new Date().toISOString(),
      title: status === "won" ? "Lead ditandai closing oleh tim sales" : "Lead ditandai sudah dihubungi",
      type: status === "won" ? "won" : "chat"
    });

    renderLeads();
    refreshDrawer(lead);
    showToast(status === "won" ? "Lead ditandai closing." : "Lead ditandai sudah dihubungi.");
  }

  function copyReply() {
    const lead = LEADS.find((item) => item.id === state.activeLeadId);
    if (!lead) return;

    const done = () => showToast("Draft balasan disalin ke clipboard.");
    const fallback = () => {
      const area = document.createElement("textarea");
      area.value = lead.reply;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        done();
      } catch (error) {
        showToast("Gagal menyalin. Pilih teks secara manual.");
      }
      document.body.removeChild(area);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(lead.reply).then(done).catch(fallback);
    } else {
      fallback();
    }
  }

  function openSimulate() {
    els.simulateOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    els.simulateForm.reset();
    clearFormErrors();
    const first = els.simulateForm.querySelector('[name="name"]');
    if (first) window.setTimeout(() => first.focus(), 30);
  }

  function closeSimulate() {
    els.simulateOverlay.hidden = true;
    if (!els.drawer.classList.contains("is-open")) document.body.style.overflow = "";
    els.simulateBtn.focus();
  }

  function clearFormErrors() {
    els.simulateForm.querySelectorAll(".error").forEach((element) => {
      element.textContent = "";
    });
    els.simulateForm.querySelectorAll(".input, .textarea").forEach((element) => {
      element.removeAttribute("aria-invalid");
    });
  }

  function setFormError(name, message) {
    const error = els.simulateForm.querySelector(`[data-error="${name}"]`);
    if (error) error.textContent = message;
    const input = els.simulateForm.querySelector(`[name="${name}"]`);
    if (input) input.setAttribute("aria-invalid", "true");
  }

  function detectIntent(text) {
    for (const rule of INTENT_RULES) {
      if (rule.keywords.some((keyword) => text.includes(keyword))) return rule;
    }
    return { intent: "general_inquiry", label: "Pertanyaan umum" };
  }

  function classifyLead(input) {
    const text = [input.message, input.budget, input.company].join(" ").toLowerCase();
    let score = 42;

    if (/(budget|anggaran|rp|juta|miliar)/.test(text)) score += 16;
    if (/(demo|proposal|penawaran|meeting|diskusi|call)/.test(text)) score += 14;
    if (/(segera|minggu ini|bulan ini|cepat|urgent|sekarang)/.test(text)) score += 14;
    if (/(otomasi|integrasi|workflow|ai|n8n|whatsapp|website|landing|dashboard|booking)/.test(text)) score += 9;
    if (/(belum ada anggaran|belum ada budget|hanya tanya|info dulu|nanti|belum tahu)/.test(text)) score -= 18;
    if (input.message.length > 120) score += 4;
    if (input.company.trim()) score += 3;

    score = Math.max(15, Math.min(97, score));

    const priority = score >= 75 ? "high" : score >= 45 ? "medium" : "low";
    const intent = detectIntent(text);

    const summary = input.message.length > 140
      ? input.message.slice(0, 140).trim() + "…"
      : input.message.trim();

    const company = input.company.trim() || "bisnis Anda";
    const reply = priority === "low"
      ? `Halo ${input.name.split(" ")[0]}, terima kasih sudah menghubungi kami. Kami sudah menerima pertanyaan Anda terkait ${intent.label.toLowerCase()}. Kami kirimkan informasi singkat dan contoh yang relevan. Jika nanti sudah ada kebutuhan atau anggaran, kami siap membantu.`
      : `Halo ${input.name.split(" ")[0]}, terima kasih sudah menghubungi kami. Untuk kebutuhan ${company} terkait ${intent.label.toLowerCase()}, kami bisa menyiapkan demo singkat dan estimasi biaya sesuai ruang lingkup. Apakah minggu ini ada waktu untuk diskusi 15 menit?`;

    return { priority, score, intent: intent.intent, summary, reply };
  }

  function addSimulatedLead(input) {
    const ai = classifyLead(input);
    const now = new Date().toISOString();
    const id = "LD-" + Math.random().toString(36).slice(2, 6).toUpperCase();

    const lead = {
      id,
      name: input.name.trim(),
      company: input.company.trim(),
      role: "Lead baru",
      email: "",
      whatsapp: "",
      source: input.source,
      priority: ai.priority,
      score: ai.score,
      status: "new",
      intent: ai.intent,
      summary: ai.summary,
      message: input.message.trim(),
      createdAt: now,
      responseMins: null,
      reply: ai.reply,
      timeline: [
        { time: now, title: "Lead ditambahkan lewat simulasi dashboard", type: "in" },
        { time: now, title: `AI mengklasifikasi: prioritas ${priorityLabel(ai.priority).toLowerCase()} (${ai.score}/100)`, type: "ai" },
        {
          time: now,
          title: ai.priority === "high" ? "Notifikasi sales disiapkan" : ai.priority === "low" ? "Masuk daftar nurture" : "Draft balasan disiapkan",
          type: ai.priority === "low" ? "clock" : "doc"
        }
      ]
    };

    LEADS.unshift(lead);
    state.query = "";
    state.priority = "all";
    state.status = "all";
    els.search.value = "";
    els.statusSelect.value = "all";
    syncChips();

    renderAll();
    closeSimulate();
    openDrawer(id, document.querySelector("#simulate-btn"));
    showToast(`Lead baru diklasifikasi: prioritas ${priorityLabel(ai.priority).toLowerCase()} (${ai.score}/100).`);
  }

  function syncChips() {
    els.chips.querySelectorAll(".chip").forEach((chip) => {
      const active = chip.dataset.priority === state.priority;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
  }

  function resetFilters() {
    state.query = "";
    state.priority = "all";
    state.status = "all";
    els.search.value = "";
    els.statusSelect.value = "all";
    syncChips();
    renderLeads();
    els.search.focus();
  }

  /* Sidebar */
  function openSidebar() {
    els.sidebar.classList.add("is-open");
    els.sidebarScrim.hidden = false;
    els.menuBtn.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    els.sidebar.classList.remove("is-open");
    els.sidebarScrim.hidden = true;
    els.menuBtn.setAttribute("aria-expanded", "false");
  }

  /* Events */
  els.search.addEventListener("input", () => {
    state.query = els.search.value;
    renderLeads();
  });

  els.statusSelect.addEventListener("change", () => {
    state.status = els.statusSelect.value;
    renderLeads();
  });

  els.chips.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;
    state.priority = chip.dataset.priority;
    syncChips();
    renderLeads();
  });

  els.rows.addEventListener("click", (event) => {
    const row = event.target.closest("tr[data-id]");
    if (row) openDrawer(row.dataset.id, row);
  });

  els.rows.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const row = event.target.closest("tr[data-id]");
    if (!row) return;
    event.preventDefault();
    openDrawer(row.dataset.id, row);
  });

  els.reset.addEventListener("click", resetFilters);

  els.drawerOverlay.addEventListener("click", closeDrawer);

  els.drawer.addEventListener("click", (event) => {
    if (event.target.closest("#drawer-close")) {
      closeDrawer();
      return;
    }

    if (event.target.closest("#copy-reply")) {
      copyReply();
      return;
    }

    const action = event.target.closest("[data-drawer-action]");
    if (action && state.activeLeadId) {
      setStatus(state.activeLeadId, action.dataset.drawerAction);
    }
  });

  els.simulateBtn.addEventListener("click", openSimulate);
  els.simulateClose.addEventListener("click", closeSimulate);
  els.simulateCancel.addEventListener("click", closeSimulate);

  els.simulateOverlay.addEventListener("click", (event) => {
    if (event.target === els.simulateOverlay) closeSimulate();
  });

  els.simulateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormErrors();

    const data = new FormData(els.simulateForm);
    const input = {
      name: String(data.get("name") || "").trim(),
      company: String(data.get("company") || "").trim(),
      source: String(data.get("source") || "Landing Page"),
      budget: String(data.get("budget") || "").trim(),
      message: String(data.get("message") || "").trim()
    };

    let valid = true;

    if (input.name.length < 3) {
      setFormError("name", "Nama minimal 3 karakter.");
      valid = false;
    }

    if (input.message.length < 10) {
      setFormError("message", "Pesan minimal 10 karakter agar AI bisa menganalisis.");
      valid = false;
    }

    if (!valid) {
      const firstError = els.simulateForm.querySelector('[aria-invalid="true"]');
      if (firstError) firstError.focus();
      return;
    }

    addSimulatedLead(input);
  });

  els.menuBtn.addEventListener("click", () => {
    if (els.sidebar.classList.contains("is-open")) closeSidebar();
    else openSidebar();
  });

  els.sidebarScrim.addEventListener("click", closeSidebar);

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const key = item.dataset.nav;

      if (key === "dashboard" || key === "leads") {
        document.querySelectorAll(".nav-item").forEach((nav) => nav.classList.remove("is-active"));
        item.classList.add("is-active");
        const target = document.getElementById(key === "dashboard" ? "dashboard" : "leads");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (key === "workflow") {
        showToast("Workflow n8n tersedia di workflow/lead-capture-ai-followup.json.");
      } else if (key === "integrations") {
        showToast("Integrasi demo: Google Sheets, OpenAI, Slack, dan Gmail.");
      } else {
        showToast("Halaman pengaturan tidak termasuk dalam demo.");
      }

      if (window.matchMedia("(max-width: 980px)").matches) closeSidebar();
    });
  });

  document.querySelectorAll("[data-toast]").forEach((element) => {
    element.addEventListener("click", () => showToast(element.dataset.toast));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (!els.simulateOverlay.hidden) {
      closeSimulate();
    } else if (els.drawer.classList.contains("is-open")) {
      closeDrawer();
    } else if (els.sidebar.classList.contains("is-open")) {
      closeSidebar();
    }
  });

  /* Init */
  renderChart();
  renderSources();
  renderAll();
  els.chips.querySelectorAll(".chip").forEach((chip) => {
    chip.setAttribute("aria-pressed", String(chip.classList.contains("is-active")));
  });
})();
