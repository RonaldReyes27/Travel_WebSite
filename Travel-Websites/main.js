document.addEventListener('DOMContentLoaded', () => {
  // 🔹 Activa el modo SPA para que el CSS oculte/se muestre por .active-section
  document.body.classList.add('spa-enabled');

  // ==============================
  // 1) SELECTORES BASE (SPA)
  // ==============================
  const navLinks = document.querySelectorAll('.navegacion a[href^="#"]'); // solo internos
  const appSections = document.querySelectorAll('.app-section');

  // ==============================
  // 2) REVEAL PARA .fade-up (About)
  // ==============================
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  function observeFadeUps(rootEl) {
    if (!rootEl) return;
    rootEl.querySelectorAll('.fade-up').forEach(el => {
      if (!el.dataset.observed) {
        io.observe(el);
        el.dataset.observed = '1';
      }
    });
  }

  // ==============================
  // 3) ACTIVAR SECCIÓN (SPA)
  // ==============================
  function activateSectionById(targetId) {
    const section = document.querySelector(targetId);
    if (!section) {
      console.error(`Sección no encontrada para el ID: ${targetId}`);
      return;
    }

    // Ocultar todas
    appSections.forEach(s => s.classList.remove('active-section'));

    // Desactivar link activo previo (visual + accesibilidad)
    const prevActive = document.querySelector('.navegacion a.activo');
    if (prevActive) {
      prevActive.classList.remove('activo');
      prevActive.removeAttribute('aria-current');
    }

    // Mostrar la sección objetivo
    section.classList.add('active-section');

    // Activar el link correspondiente
    const newActive = document.querySelector(`.navegacion a[href="${targetId}"]`);
    if (newActive) {
      newActive.classList.add('activo');
      newActive.setAttribute('aria-current', 'page');
    }

    // Actualizar hash (sin recargar)
    if (location.hash !== targetId) {
      history.replaceState(null, '', targetId);
    }

    // Scroll a la sección (mejor UX)
    try {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (_) {
      // no-op en navegadores viejos
    }

    // Preparar reveal de esa sección
    observeFadeUps(section);
  }

  // ==============================
  // 4) CLICK EN MENÚ (SPA)
  // ==============================
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return; // por si acaso
      e.preventDefault();
      activateSectionById(targetId);
    });
  });

  // ==============================
  // 5) CARGA INICIAL
  // ==============================
  if (location.hash && document.querySelector(location.hash)) {
    activateSectionById(location.hash);
  } else {
    // Usa el enlace que ya viene con .activo en tu HTML
    const initialLink = document.querySelector('.navegacion a.activo') || navLinks[0];
    const initialSectionId = initialLink?.getAttribute('href');
    if (initialSectionId && document.querySelector(initialSectionId)) {
      // Normaliza también el hash inicial para coherencia con el navegador
      history.replaceState(null, '', initialSectionId);
      activateSectionById(initialSectionId);
    }
  }

  // ==============================
  // 6) Cambios manuales del hash
  // ==============================
  window.addEventListener('hashchange', () => {
    if (location.hash && document.querySelector(location.hash)) {
      activateSectionById(location.hash);
    }
  });
});
