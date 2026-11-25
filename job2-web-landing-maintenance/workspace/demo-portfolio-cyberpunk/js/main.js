/* ==========================================================================
   NIGHT//SHIFT — interaction layer
   No dependencies. Progressive enhancement, reduced-motion aware.
   ========================================================================== */

(() => {
  "use strict";

  const html = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  /* ------------------------------------------------------------------------
     Boot sequence
     ------------------------------------------------------------------------ */

  const boot = $("#boot");
  let bootFinished = false;

  const finishBoot = () => {
    if (bootFinished) return;
    bootFinished = true;
    html.classList.add("is-ready");

    if (boot) {
      boot.classList.add("is-done");
      window.setTimeout(() => boot.remove(), 900);
    }

    window.setTimeout(() => {
      $$(".count").forEach(animateCount);
      if (!reduceMotion.matches) startScramble();
    }, 420);
  };

  const skipBoot = new URLSearchParams(window.location.search).has("noboot");
  window.setTimeout(finishBoot, reduceMotion.matches || skipBoot ? 40 : 1550);

  /* ------------------------------------------------------------------------
     Hero count-up
     ------------------------------------------------------------------------ */

  function animateCount(element) {
    if (element.dataset.counted === "true") return;
    element.dataset.counted = "true";

    const target = Number(element.dataset.count || element.textContent || 0);
    if (!Number.isFinite(target)) return;

    if (reduceMotion.matches) {
      element.textContent = String(target);
      return;
    }

    const duration = 1250;
    const started = performance.now();

    const tick = (now) => {
      const progress = clamp((now - started) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------------
     Hero scramble
     ------------------------------------------------------------------------ */

  const scrambleTarget = $("#hero-scramble");
  let scrambleTimer = null;

  function startScramble() {
    if (!scrambleTarget) return;
    const finalText = scrambleTarget.textContent.trim() || "DIABAIKAN.";
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+/<>";
    let frame = 0;
    const totalFrames = 34;

    const finish = () => {
      scrambleTarget.textContent = finalText;
      window.clearTimeout(scrambleTimer);
      scrambleTimer = window.setTimeout(startScramble, 14000);
    };

    const run = () => {
      frame += 1;
      const revealed = Math.floor((frame / totalFrames) * finalText.length);
      let output = "";

      for (let index = 0; index < finalText.length; index += 1) {
        const character = finalText[index];
        if (character === " " || index < revealed) {
          output += character;
        } else {
          output += glyphs[Math.floor(Math.random() * glyphs.length)];
        }
      }

      scrambleTarget.textContent = output;

      if (frame >= totalFrames) {
        finish();
      } else {
        window.clearTimeout(scrambleTimer);
        scrambleTimer = window.setTimeout(run, 38);
      }
    };

    run();
  }

  /* ------------------------------------------------------------------------
     Header, scroll progress and hero parallax
     ------------------------------------------------------------------------ */

  const header = $("#site-header");
  const progressBar = $("#scroll-progress");
  const heroTitle = $(".hero-title");
  const heroOrb = $(".hero-orb");
  const heroGrid = $(".hero-grid");
  const processList = $("#process-list");
  const processFill = $("#process-fill");
  const processSteps = $$(".process-step");

  let lastScrollY = window.scrollY;
  let scrollQueued = false;
  let menuOpen = false;

  function updateScroll() {
    scrollQueued = false;
    const y = window.scrollY;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

    if (progressBar) {
      progressBar.style.width = `${clamp((y / maxScroll) * 100, 0, 100)}%`;
    }

    if (header) {
      header.classList.toggle("is-scrolled", y > 24);

      if (!menuOpen && y > 240 && y > lastScrollY + 6) {
        header.classList.add("is-hidden");
      } else if (y < lastScrollY - 6 || y <= 240) {
        header.classList.remove("is-hidden");
      }
    }

    if (!reduceMotion.matches && window.innerWidth > 760 && y < window.innerHeight * 1.15) {
      if (heroTitle) {
        heroTitle.style.transform = `translate3d(0, ${y * 0.035}px, 0)`;
      }
      if (heroOrb) {
        if (y > 0) {
          heroOrb.style.transform = `rotate(-6deg) translate3d(0, ${y * 0.07}px, 0) scale(${1 - Math.min(y / 7000, 0.04)})`;
        } else {
          heroOrb.style.removeProperty("transform");
        }
      }
      if (heroGrid) {
        heroGrid.style.backgroundPositionY = `${y * 0.08}px`;
      }
    }

    updateProcess();
    lastScrollY = y;
  }

  function queueScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(updateScroll);
  }

  function updateProcess() {
    if (!processList || !processFill) return;

    const rect = processList.getBoundingClientRect();
    const lineStart = window.innerHeight * 0.58;
    const progress = clamp((lineStart - rect.top) / Math.max(rect.height, 1), 0, 1);
    processFill.style.height = `${progress * 100}%`;

    processSteps.forEach((step) => {
      const stepRect = step.getBoundingClientRect();
      step.classList.toggle("is-active", stepRect.top < window.innerHeight * 0.66);
    });
  }

  window.addEventListener("scroll", queueScroll, { passive: true });
  window.addEventListener("resize", queueScroll);
  updateScroll();

  /* ------------------------------------------------------------------------
     Reveal + word stagger
     ------------------------------------------------------------------------ */

  const wordBlock = $("[data-words]");

  if (wordBlock) {
    const words = wordBlock.textContent.trim().split(/\s+/);
    const fragment = document.createDocumentFragment();

    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.className = "word";
      span.style.setProperty("--w", String(index));
      span.textContent = word;
      fragment.append(span, document.createTextNode(" "));
    });

    wordBlock.replaceChildren(fragment);
  }

  const revealElements = $$(".reveal");
  const observedElements = [...revealElements];
  if (wordBlock) observedElements.push(wordBlock);

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -7% 0px" }
    );

    observedElements.forEach((element) => revealObserver.observe(element));
  } else {
    observedElements.forEach((element) => element.classList.add("is-in"));
  }

  /* ------------------------------------------------------------------------
     Ghost cursors + scan box (hero choreography)
     ------------------------------------------------------------------------ */

  const ghostLayer = $("#ghost-layer");
  const ghostCursors = $$("[data-ghost]");
  const scanBox = $("#scan-box");
  const scanLabel = $("#scan-label");
  const heroSection = $("#top");
  let ghostRaf = 0;
  let ghostLast = 0;
  let ghostRunning = false;

  const ghostState = ghostCursors.map((element, index) => ({
    el: element,
    tag: $(".ghost-tag", element),
    x: 120 + index * 120,
    y: 120 + index * 60,
    tx: 120 + index * 120,
    ty: 120 + index * 60,
    speed: 0.045 + index * 0.008,
    visible: false,
  }));

  function setGhost(index, x, y, label, visible = true, clicking = false) {
    const ghost = ghostState[index];
    if (!ghost) return;
    ghost.tx = x;
    ghost.ty = y;
    ghost.visible = visible;
    ghost.el.style.opacity = visible ? "1" : "0";
    ghost.el.classList.toggle("is-clicking", clicking);
    if (label && ghost.tag) ghost.tag.textContent = label;
  }

  function showScanBox(rect, label) {
    if (!scanBox || !heroSection) return;
    const heroRect = heroSection.getBoundingClientRect();
    const pad = 14;
    const left = clamp(rect.left - heroRect.left - pad, 12, heroRect.width - 40);
    const top = clamp(rect.top - heroRect.top - pad, 12, heroRect.height - 40);
    const width = clamp(rect.width + pad * 2, 60, heroRect.width - left - 12);
    const height = clamp(rect.height + pad * 2, 40, heroRect.height - top - 12);
    scanBox.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    scanBox.style.width = `${width}px`;
    scanBox.style.height = `${height}px`;
    if (scanLabel) scanLabel.textContent = label;
    scanBox.classList.add("is-active");
  }

  function hideScanBox() {
    scanBox?.classList.remove("is-active");
  }

  function hideGhosts() {
    ghostState.forEach((ghost) => {
      ghost.visible = false;
      ghost.el.style.opacity = "0";
      ghost.el.classList.remove("is-clicking");
    });
  }

  function renderGhosts(now) {
    if (!ghostRunning) return;
    const delta = Math.min((now - ghostLast) / 16.67, 2);
    ghostLast = now;

    ghostState.forEach((ghost) => {
      if (!ghost.visible) return;
      const lerp = 1 - Math.pow(1 - ghost.speed, delta);
      ghost.x += (ghost.tx - ghost.x) * lerp;
      ghost.y += (ghost.ty - ghost.y) * lerp;
      ghost.el.style.transform = `translate3d(${ghost.x}px, ${ghost.y}px, 0)`;
    });

    ghostRaf = requestAnimationFrame(renderGhosts);
  }

  function startGhosts() {
    if (ghostRunning || !ghostLayer || ghostCursors.length === 0) return;
    ghostRunning = true;
    ghostLast = performance.now();
    ghostRaf = requestAnimationFrame(renderGhosts);
  }

  function stopGhosts() {
    ghostRunning = false;
    cancelAnimationFrame(ghostRaf);
    hideGhosts();
    hideScanBox();
  }

  function rectPoint(rect, anchorX = 0.5, anchorY = 0.5, offsetX = 0, offsetY = 0) {
    const heroRect = heroSection.getBoundingClientRect();
    return {
      x: clamp(rect.left - heroRect.left + rect.width * anchorX + offsetX, 16, heroRect.width - 24),
      y: clamp(rect.top - heroRect.top + rect.height * anchorY + offsetY, 16, heroRect.height - 24),
    };
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  async function ghostSequence() {
    if (!ghostRunning || !heroSection) return;

    const title = $(".hero-title");
    const primaryCta = $('.hero-actions .btn--primary');
    const ghostCta = $('.hero-actions .btn--ghost');
    const stats = $(".hero-stats");
    if (!title || !primaryCta || !stats) return;

    const t = rectPoint(title.getBoundingClientRect(), 0.18, 0.22, -20, -10);
    const t2 = rectPoint(title.getBoundingClientRect(), 0.72, 0.78, 20, 18);
    const cta = rectPoint(primaryCta.getBoundingClientRect(), 0.55, 0.45, 12, 10);
    const cta2 = ghostCta ? rectPoint(ghostCta.getBoundingClientRect(), 0.55, 0.45, 12, 10) : cta;
    const stat = rectPoint(stats.getBoundingClientRect(), 0.75, 0.35, 8, 8);

    hideScanBox();
    hideGhosts();
    setGhost(0, t.x - 50, t.y + 80, "SCAN", true);
    setGhost(1, cta.x + 110, cta.y - 90, "SELECT", true);
    setGhost(2, stat.x - 90, stat.y + 100, "READ", true);
    await wait(120);
    if (!ghostRunning) return;

    setGhost(0, t.x, t.y, "SCAN", true);
    setGhost(1, cta.x + 40, cta.y - 40, "SELECT", true);
    await wait(520);
    if (!ghostRunning) return;

    showScanBox(title.getBoundingClientRect(), "HERO / TITLE");
    setGhost(0, t2.x, t2.y, "TRACE", true);
    setGhost(2, stat.x, stat.y, "READ", true);
    await wait(720);
    if (!ghostRunning) return;

    showScanBox(primaryCta.getBoundingClientRect(), "CTA / PRIMARY");
    setGhost(0, cta.x - 28, cta.y - 24, "TARGET", true);
    setGhost(1, cta.x, cta.y, "CLICK", true, true);
    setGhost(2, cta2.x, cta2.y, "ALT", true);
    await wait(180);
    setGhost(1, cta.x, cta.y, "CLICK", true, false);
    await wait(620);
    if (!ghostRunning) return;

    showScanBox(stats.getBoundingClientRect(), "METRICS / LIVE");
    setGhost(0, stat.x - 40, stat.y - 20, "VERIFY", true);
    setGhost(1, cta2.x + 30, cta2.y - 20, "SELECT", true);
    setGhost(2, stat.x, stat.y, "SCAN", true);
    await wait(900);
    if (!ghostRunning) return;

    hideScanBox();
    hideGhosts();
  }

  async function playGhostIntro() {
    if (ghostPlayed || !ghostRunning) return;
    ghostPlayed = true;

    // Play once on load; if the user already scrolled away, skip quietly.
    if (document.hidden || window.scrollY > window.innerHeight * 0.45) {
      stopGhosts();
      return;
    }

    await ghostSequence();
    await wait(350);
    stopGhosts();
  }

  let ghostPlayed = false;

  const canGhost =
    ghostLayer &&
    ghostCursors.length > 0 &&
    !reduceMotion.matches &&
    window.matchMedia("(min-width: 980px)").matches &&
    !window.matchMedia("(pointer: coarse)").matches;

  if (canGhost) {
    const startWhenReady = () => {
      if (ghostPlayed || ghostRunning) return;
      startGhosts();
      playGhostIntro();
    };

    if (html.classList.contains("is-ready")) {
      window.setTimeout(startWhenReady, 900);
    } else {
      const readyObserver = new MutationObserver(() => {
        if (!html.classList.contains("is-ready")) return;
        readyObserver.disconnect();
        window.setTimeout(startWhenReady, 900);
      });
      readyObserver.observe(html, { attributes: true, attributeFilter: ["class"] });
    }
  }

  /* ------------------------------------------------------------------------
     Custom cursor
     ------------------------------------------------------------------------ */

  if (finePointer.matches && !reduceMotion.matches) {
    html.classList.add("has-cursor");

    const cursor = $("#cursor");
    const ring = $("#cursor-ring");
    const dot = $("#cursor-dot");
    const label = $(".cursor-label", cursor);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let rafId = 0;

    const renderCursor = () => {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      const ringTransform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      const dotTransform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = ringTransform;
      dot.style.transform = dotTransform;
      rafId = requestAnimationFrame(renderCursor);
    };

    const setActive = (element) => {
      const interactive = element.closest("a, button, .project-card");
      if (!interactive) {
        ring.classList.remove("is-active");
        return;
      }

      let text = "GO";
      if (interactive.matches(".project-card") || interactive.closest("[data-open-project]")) {
        text = "OPEN";
      } else if (interactive.matches('a[href^="mailto:"]')) {
        text = "MAIL";
      } else if (interactive.matches('a[href^="http"]')) {
        text = "VISIT";
      } else if (interactive.matches("button")) {
        text = interactive.id === "copy-email" ? "COPY" : "CLICK";
      }

      label.textContent = text;
      ring.classList.add("is-active");
    };

    document.addEventListener("mousemove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.classList.remove("is-hidden");
      setActive(event.target);
    });

    document.addEventListener("mousedown", () => ring.classList.add("is-down"));
    document.addEventListener("mouseup", () => ring.classList.remove("is-down"));
    document.documentElement.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
    document.documentElement.addEventListener("mouseenter", () => cursor.classList.remove("is-hidden"));

    rafId = requestAnimationFrame(renderCursor);

    reduceMotion.addEventListener("change", (event) => {
      if (!event.matches) return;
      cancelAnimationFrame(rafId);
      html.classList.remove("has-cursor");
    });
  }

  /* ------------------------------------------------------------------------
     Magnetic buttons + project spotlight
     ------------------------------------------------------------------------ */

  if (finePointer.matches && !reduceMotion.matches) {
    $$(".magnetic").forEach((element) => {
      element.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)";

      element.addEventListener("mousemove", (event) => {
        const rect = element.getBoundingClientRect();
        const offsetX = (event.clientX - (rect.left + rect.width / 2)) * 0.16;
        const offsetY = (event.clientY - (rect.top + rect.height / 2)) * 0.18;
        element.style.transform = `translate3d(${clamp(offsetX, -9, 9)}px, ${clamp(offsetY, -7, 7)}px, 0)`;
      });

      element.addEventListener("mouseleave", () => {
        element.style.transform = "translate3d(0, 0, 0)";
      });
    });

    $$(".project-visual").forEach((visual) => {
      visual.addEventListener("mousemove", (event) => {
        const rect = visual.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        visual.style.setProperty("--mx", `${x}%`);
        visual.style.setProperty("--my", `${y}%`);
      });

      visual.addEventListener("mouseleave", () => {
        visual.style.setProperty("--mx", "50%");
        visual.style.setProperty("--my", "50%");
      });
    });
  }

  /* ------------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------------ */

  const menuButton = $("#menu-btn");
  const mobileMenu = $("#mobile-menu");
  const menuLinks = $$("a", mobileMenu);
  const firstMenuLink = menuLinks[0];

  function setMenu(open, restoreFocus = true) {
    if (!menuButton || !mobileMenu) return;

    menuOpen = open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    mobileMenu.inert = !open;
    body.classList.toggle("menu-open", open);

    if (open) {
      header?.classList.remove("is-hidden");
      window.setTimeout(() => firstMenuLink?.focus(), 160);
    } else if (restoreFocus) {
      menuButton.focus();
    }
  }

  menuButton?.addEventListener("click", () => setMenu(!menuOpen));
  menuLinks.forEach((link) => link.addEventListener("click", () => setMenu(false, false)));
  $(".brand")?.addEventListener("click", () => {
    if (menuOpen) setMenu(false, false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuOpen) setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && menuOpen) setMenu(false, false);
  });

  /* ------------------------------------------------------------------------
     Project case-file dialog
     ------------------------------------------------------------------------ */

  const projects = {
    hypermart: {
      title: "HYPERMART",
      kicker: "CASE FILE 01 / E-COMMERCE",
      tags: ["Art direction", "E-commerce", "Next.js"],
      summary:
        "Platform drop streetwear untuk generasi yang tidak sabar. Katalog cepat, hitung mundur rilis, dan checkout yang dibuat sesingkat mungkin.",
      meta: [
        ["TAHUN", "2026"],
        ["PERAN", "Art direction, UX, frontend"],
        ["STACK", "Next.js, Shopify, GSAP"],
      ],
      challenge:
        "Rilis terbatas selalu berakhir dengan server melambat dan keranjang yang membingungkan. Brand butuh pengalaman yang terasa seperti event, bukan halaman toko biasa.",
      approach:
        "Kami membangun ritme visual bertingkat, micro-interaction pada kartu produk, dan alur checkout tiga langkah. Semua aset berat dimuat setelah konten utama tampil.",
      metrics: [
        ["+38%", "conversion"],
        ["120+", "SKU aktif"],
        ["2.4s", "LCP mobile"],
      ],
    },
    aegis: {
      title: "AEGIS",
      kicker: "CASE FILE 02 / AI AUTOMATION",
      tags: ["AI workflow", "n8n", "WhatsApp"],
      summary:
        "Asisten AI customer service yang menjawab pertanyaan berulang, membaca status pesanan, dan meneruskan sisanya ke manusia dengan konteks lengkap.",
      meta: [
        ["TAHUN", "2026"],
        ["PERAN", "Workflow design, prompt, integration"],
        ["STACK", "n8n, OpenAI, WhatsApp API"],
      ],
      challenge:
        "Tim CS menghabiskan sebagian besar waktu untuk pertanyaan yang sama. Eskalasi ke manusia juga kehilangan konteks sehingga pelanggan harus mengulang cerita.",
      approach:
        "Percakapan diklasifikasi lebih dulu, lalu diarahkan ke knowledge base atau data pesanan. Semua langkah tercatat, dan eskalasi membawa ringkasan otomatis ke agen manusia.",
      metrics: [
        ["-72%", "response time"],
        ["84%", "auto-resolved"],
        ["24/7", "coverage"],
      ],
    },
    voidhotel: {
      title: "VOID HOTEL",
      kicker: "CASE FILE 03 / HOSPITALITY",
      tags: ["Hospitality", "Booking", "CMS"],
      summary:
        "Website booking langsung untuk hotel butik. Kamar terasa nyata sebelum check-in, tanpa komisi marketplace yang menggerus margin.",
      meta: [
        ["TAHUN", "2025"],
        ["PERAN", "Web design, development, CMS"],
        ["STACK", "Astro, Sanity, Booking API"],
      ],
      challenge:
        "Hampir seluruh reservasi datang dari marketplace. Hotel kehilangan margin dan tidak punya hubungan langsung dengan tamu.",
      approach:
        "Kami membuat pengalaman visual yang tenang dan sinematik, lalu menyederhanakan pemilihan tanggal, tipe kamar, dan konfirmasi menjadi satu alur yang jelas.",
      metrics: [
        ["+54%", "direct booking"],
        ["-31%", "bounce rate"],
        ["4.8/5", "guest rating"],
      ],
    },
  };

  const dialog = $("#project-dialog");
  const dialogContent = $("#dialog-content");
  const dialogClose = $("#dialog-close");
  let dialogTrigger = null;

  function projectTemplate(project, slug) {
    return `
      <article>
        <div class="case-banner case-banner--${slug}">
          <div class="case-head">
            <span class="case-kicker">${project.kicker}</span>
            <h2 class="case-title">${project.title}</h2>
            <ul class="case-tags">${project.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
          </div>
        </div>
        <div class="case-main">
          <p class="case-summary">${project.summary}</p>
          <dl class="case-meta">
            ${project.meta.map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join("")}
          </dl>
          <div class="case-grid">
            <div class="case-block">
              <h4>Challenge</h4>
              <p>${project.challenge}</p>
            </div>
            <div class="case-block">
              <h4>Approach</h4>
              <p>${project.approach}</p>
            </div>
          </div>
          <div class="case-metrics">
            ${project.metrics
              .map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`)
              .join("")}
          </div>
          <p class="case-note">Demo concept — studi kasus fiktif untuk keperluan portofolio.</p>
        </div>
      </article>
    `;
  }

  $$("[data-open-project]").forEach((button) => {
    button.addEventListener("click", () => {
      const project = projects[button.dataset.openProject];
      if (!project || !dialog || !dialogContent) return;
      dialogTrigger = button;
      dialogContent.innerHTML = projectTemplate(project, button.dataset.openProject);
      dialog.showModal();
      body.classList.add("has-dialog");
      dialogClose?.focus();
    });
  });

  dialogClose?.addEventListener("click", () => dialog.close());

  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog?.addEventListener("close", () => {
    body.classList.remove("has-dialog");
    if (dialogContent) dialogContent.innerHTML = "";
    dialogTrigger?.focus();
  });

  /* ------------------------------------------------------------------------
     Copy email + toast
     ------------------------------------------------------------------------ */

  const toast = $("#toast");
  const copyButton = $("#copy-email");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function legacyCopy(text) {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.left = "-9999px";
    body.appendChild(field);
    field.select();
    try {
      document.execCommand("copy");
    } catch (error) {
      // Silently ignore; the toast below still tells the user what to do.
    }
    field.remove();
  }

  copyButton?.addEventListener("click", async () => {
    const email = copyButton.dataset.email;
    if (!email) return;
    const label = copyButton.querySelector("span");

    try {
      await navigator.clipboard.writeText(email);
    } catch (error) {
      legacyCopy(email);
    }

    showToast(`EMAIL COPIED — ${email}`);
    if (label) {
      const original = label.textContent;
      label.textContent = "Tersalin";
      window.setTimeout(() => {
        label.textContent = original;
      }, 1800);
    }
  });

  /* ------------------------------------------------------------------------
     Clock + footer year
     ------------------------------------------------------------------------ */

  const clock = $("#clock");
  const timeFormatter = (() => {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    } catch (error) {
      return null;
    }
  })();

  function updateClock() {
    if (!clock) return;
    const now = new Date();
    clock.textContent = timeFormatter
      ? `${timeFormatter.format(now)} WIB`
      : now.toLocaleTimeString("en-GB", { hour12: false });
  }

  updateClock();
  window.setInterval(updateClock, 1000);

  $$("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------------------------------------
     Current section in navigation
     ------------------------------------------------------------------------ */

  const navLinks = $$(".site-nav a[href^='#']");
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${entry.target.id}`;
            if (active) {
              link.setAttribute("aria-current", "page");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-38% 0px -52% 0px", threshold: 0 }
    );

    sections.forEach((section) => navObserver.observe(section));
  }
})();
