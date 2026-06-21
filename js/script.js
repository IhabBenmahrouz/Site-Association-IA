/* ============================================================
   SENSIBILISATION À L'IA — Script principal
   Fonctionnalités : Nav · Filtres · Recherche · Animations · Compteurs
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Navbar : scroll + burger + dropdown ──────────────── */
  const navbar  = document.querySelector('.navbar');
  const burger  = document.querySelector('.navbar__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const dropdownTriggers = document.querySelectorAll('.nav-item.has-dropdown');

  // Scroll navbar
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 40);
    toggleBackToTop();
  });

  // Burger toggle
  burger?.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu?.classList.toggle('open');
    document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
  });

  // Fermer menu mobile sur lien
  document.querySelectorAll('.mobile-nav-link, .mobile-sub-link').forEach(link => {
    link.addEventListener('click', () => {
      burger?.classList.remove('active');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Dropdown desktop (keyboard + touch)
  dropdownTriggers.forEach(item => {
    const link = item.querySelector('.nav-link');
    link?.addEventListener('click', (e) => {
      e.preventDefault();
      item.classList.toggle('open');
    });
  });

  // Fermer dropdowns au clic extérieur
  document.addEventListener('click', (e) => {
    dropdownTriggers.forEach(item => {
      if (!item.contains(e.target)) item.classList.remove('open');
    });
  });

  /* ── 2. Lien actif dans la nav ───────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.php';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.php')) {
      link.classList.add('active');
    }
  });

  /* ── 3. Révélation au scroll (IntersectionObserver) ─────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── 4. Compteurs animés ─────────────────────────────────── */
  function animateCounter(el) {
    const target  = parseFloat(el.dataset.target) || 0;
    const suffix  = el.dataset.suffix  || '';
    const prefix  = el.dataset.prefix  || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current  = target * ease;

      el.textContent = prefix + current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  /* ── 5. Filtres dynamiques ───────────────────────────────── */
  function initFilters(filterSelector, itemSelector, attribute) {
    const filterBtns = document.querySelectorAll(filterSelector);
    const items      = document.querySelectorAll(itemSelector);
    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        items.forEach(item => {
          const val = item.dataset[attribute] || '';
          const show = filter === 'all' || val.includes(filter);
          item.style.display = show ? '' : 'none';
          item.style.animation = show ? 'fadeInUp 0.4s ease both' : '';
        });
      });
    });
  }

  initFilters('.filter-btn[data-filter]', '.study-card',   'category');
  initFilters('.filter-btn[data-filter]', '.news-card',    'category');
  initFilters('.filter-btn[data-filter]', '.source-card',  'category');
  initFilters('.filter-btn[data-filter]', '.company-card', 'category');

  /* ── 6. Barre de recherche ───────────────────────────────── */
  function initSearch(inputSelector, itemSelector, fields) {
    const input = document.querySelector(inputSelector);
    if (!input) return;
    const items = document.querySelectorAll(itemSelector);

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      items.forEach(item => {
        const text = fields.map(f => item.dataset[f] || '').join(' ').toLowerCase()
          + ' ' + (item.textContent || '').toLowerCase();
        item.style.display = (!q || text.includes(q)) ? '' : 'none';
      });
    });
  }

  initSearch('#searchStudies',   '.study-card',   ['title','category','org']);
  initSearch('#searchNews',      '.news-card',    ['title','category']);
  initSearch('#searchSources',   '.source-card',  ['name','category']);
  initSearch('#searchCompanies', '.company-card', ['name','domain']);

  /* ── 7. Accordion ────────────────────────────────────────── */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      // Fermer tous
      document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── 8. Bouton retour en haut ────────────────────────────── */
  const backToTop = document.querySelector('.back-to-top');

  function toggleBackToTop() {
    backToTop?.classList.toggle('visible', window.scrollY > 400);
  }

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 9. Validation formulaire de contact ─────────────────────
     Gérée plus bas dans une IIFE dédiée (validation complète +
     honeypot + RGPD). Ne pas dupliquer le handler ici. */

  /* ── 10. Smooth scroll liens internes ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ── 11. Tabs ────────────────────────────────────────────── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('[data-tabs]');
      if (!group) return;
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = group.querySelector(`[data-panel="${btn.dataset.tab}"]`);
      panel?.classList.add('active');
    });
  });

}); // fin DOMContentLoaded

/* ═══════════════════════════════════════════════
   FONCTIONS ADDITIONNELLES — Pages manquantes
   ═══════════════════════════════════════════════ */

/* ── Filtres & recherche Actualités ────────────── */
(function() {
  const grid    = document.getElementById('newsGrid');
  const search  = document.getElementById('searchNews');
  const filters = document.getElementById('filtersNews');
  if (!grid) return;

  let currentFilter = 'all';
  let currentSearch = '';

  function applyNews() {
    const cards = grid.querySelectorAll('.news-card');
    let visible = 0;
    cards.forEach(card => {
      const cat   = card.dataset.category || '';
      const text  = card.textContent.toLowerCase();
      const okCat = currentFilter === 'all' || cat === currentFilter;
      const okSrc = !currentSearch || text.includes(currentSearch);
      card.style.display = (okCat && okSrc) ? '' : 'none';
      if (okCat && okSrc) visible++;
    });
    const noRes = document.getElementById('noResults');
    if (noRes) noRes.style.display = visible === 0 ? 'block' : 'none';
  }

  if (filters) {
    filters.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        applyNews();
      });
    });
  }
  if (search) {
    search.addEventListener('input', () => {
      currentSearch = search.value.toLowerCase().trim();
      applyNews();
    });
  }
})();

/* ── Filtres & recherche Sources ─────────────────── */
(function() {
  const grid    = document.getElementById('sourcesGrid');
  const search  = document.getElementById('searchSources');
  const filters = document.getElementById('filtersSources');
  if (!grid) return;

  let currentFilter = 'all';
  let currentSearch = '';

  function applySources() {
    const cards = grid.querySelectorAll('.source-card');
    let visible = 0;
    cards.forEach(card => {
      const cat   = card.dataset.category || '';
      const text  = card.textContent.toLowerCase();
      const okCat = currentFilter === 'all' || cat === currentFilter;
      const okSrc = !currentSearch || text.includes(currentSearch);
      card.style.display = (okCat && okSrc) ? '' : 'none';
      if (okCat && okSrc) visible++;
    });
    const noRes = document.getElementById('noResults');
    if (noRes) noRes.style.display = visible === 0 ? 'block' : 'none';
  }

  if (filters) {
    filters.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        applySources();
      });
    });
  }
  if (search) {
    search.addEventListener('input', () => {
      currentSearch = search.value.toLowerCase().trim();
      applySources();
    });
  }
})();

/* ── Tabs (usage responsable) ─────────────────────── */
(function() {
  const tabs = document.getElementById('publicTabs');
  if (!tabs) return;
  tabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.style.display = 'none';
      });
      const target = document.getElementById('tab-' + btn.dataset.tab);
      if (target) target.style.display = 'block';
    });
  });
})();

/* ── Validation formulaire contact (mode démo AP1 — pas d'envoi serveur) ───
   Conforme RGPD : minimisation des données, validation côté client,
   honeypot anti-spam (art. 32), aucune donnée stockée ni transmise.
   Pour la mise en production : remplacer la simulation par un POST
   vers un endpoint serveur respectant l'art. 32 (HTTPS, sanitation, logs).
   ─────────────────────────────────────────────────────────────── */
(function() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(id, msg) {
    const el = document.getElementById('error-' + id);
    const input = document.getElementById(id) || form.querySelector('[name="' + id + '"]');
    if (el) el.textContent = msg;
    if (input) {
      input.classList.toggle('is-invalid', !!msg);
      input.classList.toggle('is-valid', !msg && input.value.trim() !== '');
    }
  }

  function validate() {
    let ok = true;
    const prenom  = document.getElementById('prenom');
    const nom     = document.getElementById('nom');
    const email   = document.getElementById('email');
    const sujet   = document.getElementById('sujet');
    const message = document.getElementById('message');
    const rgpd    = document.getElementById('rgpd');

    if (!prenom  || prenom.value.trim().length < 2)  { setError('prenom',  'Le prénom doit contenir au moins 2 caractères.'); ok = false; } else setError('prenom',  '');
    if (!nom     || nom.value.trim().length < 2)      { setError('nom',     'Le nom doit contenir au moins 2 caractères.'); ok = false; }     else setError('nom',     '');
    if (!email   || !EMAIL_RE.test(email.value.trim())) { setError('email', 'Veuillez saisir une adresse e-mail valide.'); ok = false; }       else setError('email',   '');
    if (!sujet   || !sujet.value)                     { setError('sujet',   'Veuillez sélectionner un sujet.'); ok = false; }                 else setError('sujet',   '');
    if (!message || message.value.trim().length < 15) { setError('message', 'Votre message doit comporter au moins 15 caractères.'); ok = false; } else setError('message', '');
    if (!rgpd    || !rgpd.checked)                    { setError('rgpd',    'Vous devez accepter la politique de confidentialité.'); ok = false; } else setError('rgpd',  '');
    return ok;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const success = document.getElementById('formSuccess');
    const errGlob = document.getElementById('formError');

    // Honeypot : si le champ piège est rempli, c'est un bot — on simule un succès
    // silencieux pour ne pas l'alerter (recommandation OWASP).
    const honeypot = form.querySelector('[name="website"]');
    if (honeypot && honeypot.value.trim() !== '') {
      form.reset();
      if (success) { success.style.display = 'block'; }
      if (errGlob) { errGlob.style.display = 'none'; }
      return;
    }

    if (validate()) {
      if (success) { success.style.display = 'block'; }
      if (errGlob) { errGlob.style.display = 'none'; }
      form.reset();
      form.querySelectorAll('.form-input').forEach(i => {
        i.classList.remove('is-valid', 'is-invalid');
      });
    } else {
      if (errGlob) { errGlob.style.display = 'block'; }
      if (success) { success.style.display = 'none'; }
    }
  });

  /* Validation à la sortie du champ */
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', validate);
  });
})();

/* Le smooth scroll des ancres internes (#rejoindre, #partenariat, …)
   est déjà géré dans le bloc 10 ci-dessus, avec décalage du navbar fixe. */
