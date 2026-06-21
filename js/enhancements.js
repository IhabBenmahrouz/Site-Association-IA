/* ============================================================
   ENHANCEMENTS — Interactions modernes
   - Scroll progress bar
   - Card 3D tilt au hover (souris)
   - Bouton ripple effect au clic
   - Magnetic effect sur boutons primaires
   - Lazy image fade-in
   - Recherche bibliothèque
   - Respect de prefers-reduced-motion
   ============================================================ */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Scroll progress bar ──────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progressBar);

  let ticking = false;
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    progressBar.style.width = pct + '%';
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  /* ── 2. Tilt 3D sur les cartes (desktop only) ────────────── */
  if (!reduce && window.matchMedia('(hover: hover) and (min-width: 768px)').matches) {
    const tiltSelectors = '.card, .partner-card, .source-card, .study-card, .news-card';
    document.querySelectorAll(tiltSelectors).forEach(card => {
      // Skip si déjà géré ailleurs (book-card a son propre flip)
      if (card.classList.contains('book-card')) return;

      let rafId = null;
      function handleMove(e) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          const rotX = (y - 0.5) * -6;  // max 6deg
          const rotY = (x - 0.5) * 6;
          card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
        });
      }
      function handleLeave() {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transform = '';
      }
      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', handleLeave);
    });
  }

  /* ── 3. Ripple effect sur les boutons ────────────────────── */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn || reduce) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });

  /* ── 4. Magnetic effect sur boutons primaires ────────────── */
  if (!reduce && window.matchMedia('(hover: hover) and (min-width: 768px)').matches) {
    document.querySelectorAll('.btn--primary, .btn--outline').forEach(btn => {
      let rafId = null;
      btn.addEventListener('mousemove', (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const rect = btn.getBoundingClientRect();
          const mx = e.clientX - rect.left;
          const my = e.clientY - rect.top;
          const dx = (mx - rect.width / 2) * 0.18;
          const dy = (my - rect.height / 2) * 0.18;
          btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
          btn.style.setProperty('--mx', (mx / rect.width * 100) + '%');
          btn.style.setProperty('--my', (my / rect.height * 100) + '%');
        });
      });
      btn.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        btn.style.transform = '';
      });
    });
  }

  /* ── 5. Lazy image fade-in ───────────────────────────────── */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
    }
  });

  /* ── 6. Recherche bibliothèque ───────────────────────────── */
  const bookSearch = document.getElementById('bookSearch');
  if (bookSearch) {
    const bookCards = document.querySelectorAll('.book-card');
    const noResults = document.getElementById('noBookResults');
    let debounceId;
    bookSearch.addEventListener('input', () => {
      clearTimeout(debounceId);
      debounceId = setTimeout(() => {
        const q = bookSearch.value.trim().toLowerCase();
        let visible = 0;
        bookCards.forEach(card => {
          card.classList.remove('is-flipped');
          const text = (card.textContent || '').toLowerCase();
          const ok = !q || text.includes(q);
          card.style.display = ok ? '' : 'none';
          if (ok) visible++;
        });
        if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
        // Reset filtres actifs visuellement quand on tape
        const activeBtn = document.querySelector('#filtersBooks .filter-btn.active');
        if (activeBtn && q) {
          document.querySelectorAll('#filtersBooks .filter-btn').forEach(b => b.classList.remove('active'));
          document.querySelector('#filtersBooks .filter-btn[data-filter="all"]')?.classList.add('active');
        }
      }, 150);
    });
  }

  /* ── 7. Skip-link injection (accessibilité) ──────────────── */
  if (!document.querySelector('.skip-link')) {
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#main, main, [role="main"]';
    skip.textContent = 'Aller au contenu principal';
    skip.setAttribute('aria-label', 'Aller au contenu principal');
    skip.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('main, [role="main"]');
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      }
    });
    document.body.insertBefore(skip, document.body.firstChild);
  }

  /* ── 8. Navbar : effet de masquage au scroll vers le bas ── */
  let lastScroll = 0;
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      const cur = window.scrollY;
      if (cur > lastScroll && cur > 200) {
        navbar.classList.add('navbar--hidden');
      } else {
        navbar.classList.remove('navbar--hidden');
      }
      lastScroll = cur;
    }, { passive: true });
  }

  /* ── 9. Préchargement intelligent des liens internes ────── */
  // Quand on survole un lien interne, on précharge la page (gain de vitesse)
  if ('connection' in navigator && navigator.connection.saveData) {
    // L'utilisateur est en mode économie de données : on ne précharge pas
  } else {
    const preloaded = new Set();
    document.addEventListener('mouseover', (e) => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
          href.startsWith('tel:') || /^https?:/.test(href)) return;
      if (preloaded.has(href)) return;
      preloaded.add(href);
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      link.as = 'document';
      document.head.appendChild(link);
    }, { passive: true });
  }
})();
