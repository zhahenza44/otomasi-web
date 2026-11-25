// Mobile menu
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('#nav-menu');

function closeMenu() {
  if (!navMenu || !menuToggle) return;
  navMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Buka menu');
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

// Header shadow on scroll
const header = document.querySelector('.site-header');
if (header) {
  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

// Portfolio filter
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const projects = Array.from(document.querySelectorAll('.project'));
const filterCount = document.querySelector('.filter-count');

function setFilter(filter) {
  let shown = 0;

  projects.forEach((project) => {
    const matches = filter === 'all' || project.dataset.category === filter;
    project.hidden = !matches;
    if (matches) shown += 1;
  });

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  if (filterCount) {
    filterCount.textContent = `${shown} contoh`;
  }
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.dataset.filter || 'all'));
});

const lightbox = document.querySelector('#project-lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxTitle = document.querySelector('#lightbox-title');
const lightboxCopy = document.querySelector('#lightbox-copy');
const lightboxClose = document.querySelector('#lightbox-close');
const lightboxPrev = document.querySelector('#lightbox-prev');
const lightboxNext = document.querySelector('#lightbox-next');
const lightboxWa = document.querySelector('#lightbox-wa');
let activeProjectIndex = -1;
let lastFocusedElement = null;

function openProject(index) {
  if (!lightbox || !projects[index]) return;

  if (activeProjectIndex === -1) {
    lastFocusedElement = document.activeElement;
  }

  activeProjectIndex = index;
  const project = projects[index];
  const title = project.dataset.title || '';
  lightboxImage.src = project.dataset.image || '';
  lightboxImage.alt = `Ilustrasi contoh proyek: ${title}`;
  lightboxTitle.textContent = title;
  lightboxCopy.textContent = project.dataset.copy || '';
  lightboxWa.href = `https://wa.me/6281234567890?text=${encodeURIComponent(`Halo Ruang Rapi, saya tertarik dengan contoh ${title}. Bisa dibantu?`)}`;

  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeProject() {
  if (!lightbox || lightbox.hidden) return;

  lightbox.hidden = true;
  document.body.style.overflow = '';
  activeProjectIndex = -1;

  if (lastFocusedElement && lastFocusedElement.isConnected) {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

function moveProject(direction) {
  if (projects.length === 0) return;
  const nextIndex = (activeProjectIndex + direction + projects.length) % projects.length;
  openProject(nextIndex);
}

projects.forEach((project, index) => {
  project.addEventListener('click', () => openProject(index));
  project.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProject(index);
    }
  });
});

if (lightbox) {
  lightboxClose.addEventListener('click', closeProject);
  lightboxPrev.addEventListener('click', () => moveProject(-1));
  lightboxNext.addEventListener('click', () => moveProject(1));

  lightbox.querySelector('[data-close-lightbox]').addEventListener('click', closeProject);

  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeProject();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveProject(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveProject(1);
    } else if (event.key === 'Tab') {
      const focusable = Array.from(lightbox.querySelectorAll('button, a[href]'));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

// Before / after slider
const slider = document.querySelector('#ba-slider');
const sliderHandle = document.querySelector('#ba-handle');

if (slider && sliderHandle) {
  let position = 55;
  let dragging = false;

  const setPosition = (value) => {
    position = Math.max(0, Math.min(100, value));
    slider.style.setProperty('--pos', `${position}%`);
    sliderHandle.setAttribute('aria-valuenow', String(Math.round(position)));
    sliderHandle.setAttribute('aria-valuetext', `Menampilkan ${Math.round(position)}% bagian sesudah`);
  };

  const updateFromPointer = (event) => {
    const rect = slider.getBoundingClientRect();
    if (rect.width === 0) return;
    setPosition(((event.clientX - rect.left) / rect.width) * 100);
  };

  slider.addEventListener('pointerdown', (event) => {
    dragging = true;
    try {
      slider.setPointerCapture(event.pointerId);
    } catch (error) {
      // Pointer capture can fail on older browsers; dragging still works.
    }
    updateFromPointer(event);
  });

  slider.addEventListener('pointermove', (event) => {
    if (dragging) updateFromPointer(event);
  });

  const stopDragging = (event) => {
    dragging = false;
    try {
      slider.releasePointerCapture(event.pointerId);
    } catch (error) {
      // Ignore if the pointer was already released.
    }
  };

  slider.addEventListener('pointerup', stopDragging);
  slider.addEventListener('pointercancel', stopDragging);
  slider.addEventListener('dragstart', (event) => event.preventDefault());

  sliderHandle.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 10 : 4;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      setPosition(position - step);
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      setPosition(position + step);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setPosition(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setPosition(100);
    }
  });
}

// Consultation form -> WhatsApp
const consultForm = document.querySelector('#consult-form');
const formStatus = document.querySelector('#form-status');

if (consultForm) {
  consultForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!consultForm.checkValidity()) {
      consultForm.reportValidity();
      return;
    }

    const data = new FormData(consultForm);
    const get = (key) => String(data.get(key) || '').trim();

    const message = [
      'Halo Ruang Rapi, saya ingin konsultasi.',
      '',
      `Nama: ${get('nama')}`,
      `WhatsApp: ${get('wa')}`,
      `Kebutuhan: ${get('layanan')}`,
      `Budget: ${get('budget') || 'Belum ditentukan'}`,
      '',
      `Catatan: ${get('pesan') || '-'}`,
    ].join('\n');

    const url = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    const opened = window.open(url, '_blank');

    if (opened) {
      opened.opener = null;
    }

    if (formStatus) {
      formStatus.textContent = '';
      if (opened) {
        formStatus.textContent = 'Pesan sudah disiapkan. Lanjutkan kirim di WhatsApp yang terbuka.';
      } else {
        formStatus.textContent = 'Popup diblokir browser. ';
        const fallback = document.createElement('a');
        fallback.href = url;
        fallback.target = '_blank';
        fallback.rel = 'noopener noreferrer';
        fallback.textContent = 'Buka WhatsApp manual';
        formStatus.appendChild(fallback);
      }
    }
  });
}

const stickyConsult = document.querySelector('#sticky-consult');
const consultSection = document.querySelector('#konsultasi');

if (stickyConsult) {
  if ('IntersectionObserver' in window && consultSection) {
    const stickyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          stickyConsult.classList.toggle('is-hidden', entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );
    stickyObserver.observe(consultSection);
  } else {
    stickyConsult.classList.add('is-hidden');
  }
}

// Reveal sections on scroll
const revealElements = Array.from(document.querySelectorAll('.reveal'));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (revealElements.length > 0) {
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }
}

// Tell the inline head script that reveal setup is ready.
document.documentElement.classList.add('reveal-ready');
