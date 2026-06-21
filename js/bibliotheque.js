/* ============================================================
   BIBLIOTHÈQUE & PARTENAIRES — Interactions
   - Flip 3D des cartes de livres (clic ou touche Entrée/Espace)
   - Filtres par catégorie (livres ET partenaires)
   - Fermeture des autres cartes flippées au clic ailleurs
   ============================================================ */
(function () {
  'use strict';

  /* ── Flip des couvertures de livres ───────────────────────── */
  const bookCards = document.querySelectorAll('.book-card');
  bookCards.forEach(card => {
    card.addEventListener('click', () => {
      // Ne pas flipper si on clique sur un lien à l'intérieur de la carte retournée
      if (card.classList.contains('is-flipped')) return;
      bookCards.forEach(c => c.classList.remove('is-flipped'));
      card.classList.add('is-flipped');
    });

    // Accessibilité clavier (Entrée / Espace)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
      if (e.key === 'Escape') {
        card.classList.remove('is-flipped');
      }
    });
  });

  // Clic sur le bouton retour / fond de carte → re-flip
  document.querySelectorAll('.book-card__back').forEach(back => {
    back.addEventListener('click', (e) => {
      // Si on clique sur un lien (Open Library), on laisse passer
      if (e.target.closest('a')) return;
      e.stopPropagation();
      back.closest('.book-card').classList.remove('is-flipped');
    });
  });

  // Fermer une carte flippée si on clique à l'extérieur
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.book-card')) {
      bookCards.forEach(c => c.classList.remove('is-flipped'));
    }
  });

  /* ── Filtres par catégorie : livres ───────────────────────── */
  const filtersBooks = document.getElementById('filtersBooks');
  const noBookResults = document.getElementById('noBookResults');
  if (filtersBooks) {
    filtersBooks.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filtersBooks.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        let visible = 0;
        bookCards.forEach(card => {
          card.classList.remove('is-flipped');
          const ok = filter === 'all' || card.dataset.category === filter;
          card.style.display = ok ? '' : 'none';
          if (ok) visible++;
        });
        if (noBookResults) noBookResults.style.display = visible === 0 ? 'block' : 'none';
      });
    });
  }

  /* ── Filtres par catégorie : partenaires ──────────────────── */
  const filtersPartners = document.getElementById('filtersPartners');
  if (filtersPartners) {
    const partnerCards = document.querySelectorAll('.partner-card');
    filtersPartners.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filtersPartners.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        partnerCards.forEach(card => {
          const ok = filter === 'all' || card.dataset.category === filter;
          card.style.display = ok ? '' : 'none';
        });
        // Cacher les sections vides (titres de catégories)
        document.querySelectorAll('.partners-grid').forEach(grid => {
          const visibleInGrid = grid.querySelectorAll('.partner-card:not([style*="display: none"])').length;
          const section = grid.closest('section');
          if (section) section.style.display = visibleInGrid === 0 ? 'none' : '';
        });
      });
    });
  }

  /* ── Fallback image : ajouter une classe au parent en cas d'erreur ─ */
  document.querySelectorAll('.partner-card__media img, .book-card__front img').forEach(img => {
    img.addEventListener('error', () => {
      const media = img.closest('.partner-card__media');
      if (media) media.classList.add('partner-card__media--fallback');
      img.classList.add('book-cover--fallback');
    }, { once: true });
  });
})();
