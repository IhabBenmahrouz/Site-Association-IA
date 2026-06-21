/* ============================================================
   GESTIONNAIRE DE CONSENTEMENT COOKIES — Conforme CNIL / RGPD
   - Recueil du consentement avant tout dépôt non essentiel
   - Refuser aussi facile qu'accepter (CNIL délibération 2020-091)
   - Choix granulaire par catégorie
   - Conservation du consentement : 6 mois (recommandation CNIL)
   - Possibilité de retrait à tout moment via le lien "Cookies"
   ============================================================ */
(function () {
  'use strict';

  const STORAGE_KEY = 'sia_cookie_consent_v1';
  const CONSENT_LIFETIME_DAYS = 180; // ~6 mois (CNIL)

  const DEFAULT_CONSENT = {
    necessary: true,   // toujours actif (pas de consentement requis)
    analytics: false,
    marketing: false,
    timestamp: null,
    version: 1
  };

  /* ── Stockage ─────────────────────────────────────────────── */
  function readConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data.timestamp) return null;
      const ageDays = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);
      if (ageDays > CONSENT_LIFETIME_DAYS) return null; // expiré → redemander
      return data;
    } catch (_) { return null; }
  }

  function saveConsent(consent) {
    consent.timestamp = Date.now();
    consent.version   = 1;
    consent.necessary = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    document.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consent }));
  }

  function clearConsent() {
    localStorage.removeItem(STORAGE_KEY);
  }

  /* ── Activation conditionnelle des scripts tiers ─────────── */
  function applyConsent(consent) {
    // Hook : analytics
    if (consent.analytics) {
      // Aucune intégration analytics activée à ce jour.
      // Pour activer Matomo / Plausible / etc., charger le script ici.
    }
    // Hook : marketing
    if (consent.marketing) {
      // Aucun pixel publicitaire activé à ce jour.
    }
  }

  /* ── Création de l'UI ─────────────────────────────────────── */
  function buildBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.id = 'cookieBanner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Bandeau de consentement aux cookies');
    banner.innerHTML = `
      <div class="cookie-banner__inner">
        <div class="cookie-banner__text">
          <div class="cookie-banner__title">🍪 Respect de votre vie privée</div>
          <p>
            Ce site utilise uniquement des cookies <strong>strictement nécessaires</strong> à son fonctionnement.
            Aucun cookie analytique ou publicitaire n'est déposé sans votre consentement explicite.
            Vous pouvez accepter, refuser ou personnaliser vos préférences. Pour en savoir plus,
            consultez notre <a href="politique-cookies.php">politique cookies</a>.
          </p>
        </div>
        <div class="cookie-banner__actions">
          <button type="button" class="btn btn--ghost"   data-cookie-action="customize">Personnaliser</button>
          <button type="button" class="btn btn--outline" data-cookie-action="reject">Tout refuser</button>
          <button type="button" class="btn btn--primary" data-cookie-action="accept">Tout accepter</button>
        </div>
      </div>
    `;
    return banner;
  }

  function buildModal() {
    const modal = document.createElement('div');
    modal.className = 'cookie-modal';
    modal.id = 'cookieModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'cookieModalTitle');
    modal.innerHTML = `
      <div class="cookie-modal__overlay" data-cookie-action="close-modal"></div>
      <div class="cookie-modal__panel">
        <header class="cookie-modal__head">
          <h2 id="cookieModalTitle">Préférences de cookies</h2>
          <button type="button" class="cookie-modal__close" data-cookie-action="close-modal" aria-label="Fermer">✕</button>
        </header>
        <div class="cookie-modal__body">
          <p class="cookie-modal__lead">
            Vous pouvez activer ou désactiver indépendamment chaque catégorie de cookies.
            Les cookies strictement nécessaires ne peuvent pas être désactivés car ils permettent le bon
            fonctionnement du site (article 82 de la loi Informatique et Libertés).
          </p>

          <div class="cookie-cat">
            <div class="cookie-cat__row">
              <div>
                <div class="cookie-cat__title">🔒 Cookies strictement nécessaires</div>
                <div class="cookie-cat__desc">Indispensables au fonctionnement du site (mémorisation du consentement, sécurité). Aucune donnée personnelle n'est partagée.</div>
              </div>
              <label class="cookie-switch is-disabled">
                <input type="checkbox" checked disabled>
                <span class="cookie-switch__slider"></span>
                <span class="cookie-switch__label">Toujours actif</span>
              </label>
            </div>
          </div>

          <div class="cookie-cat">
            <div class="cookie-cat__row">
              <div>
                <div class="cookie-cat__title">📊 Cookies de mesure d'audience</div>
                <div class="cookie-cat__desc">Nous permettent de mesurer la fréquentation du site de manière anonymisée. Aucun outil n'est actif tant que vous ne donnez pas votre accord.</div>
              </div>
              <label class="cookie-switch">
                <input type="checkbox" id="ck-analytics">
                <span class="cookie-switch__slider"></span>
                <span class="cookie-switch__label">Désactivé</span>
              </label>
            </div>
          </div>

          <div class="cookie-cat">
            <div class="cookie-cat__row">
              <div>
                <div class="cookie-cat__title">📣 Cookies marketing / réseaux sociaux</div>
                <div class="cookie-cat__desc">Permettraient de personnaliser des contenus ou de partager via des plateformes tierces. Aucun pixel publicitaire n'est déposé sans votre consentement.</div>
              </div>
              <label class="cookie-switch">
                <input type="checkbox" id="ck-marketing">
                <span class="cookie-switch__slider"></span>
                <span class="cookie-switch__label">Désactivé</span>
              </label>
            </div>
          </div>

          <p class="cookie-modal__legal">
            Vos préférences sont conservées 6 mois (recommandation CNIL).
            Vous pouvez modifier ou retirer votre consentement à tout moment via le lien
            <em>« Cookies »</em> en bas de page.
          </p>
        </div>
        <footer class="cookie-modal__foot">
          <button type="button" class="btn btn--outline" data-cookie-action="reject">Tout refuser</button>
          <button type="button" class="btn btn--ghost"   data-cookie-action="save">Enregistrer mes choix</button>
          <button type="button" class="btn btn--primary" data-cookie-action="accept">Tout accepter</button>
        </footer>
      </div>
    `;
    return modal;
  }

  /* ── Initialisation ───────────────────────────────────────── */
  function init() {
    const banner = buildBanner();
    const modal  = buildModal();
    document.body.appendChild(banner);
    document.body.appendChild(modal);

    const existing = readConsent();
    if (!existing) {
      banner.classList.add('is-visible');
    } else {
      applyConsent(existing);
    }

    function syncToggleLabels() {
      modal.querySelectorAll('.cookie-switch input[type="checkbox"]').forEach(cb => {
        const lbl = cb.closest('.cookie-switch')?.querySelector('.cookie-switch__label');
        if (lbl && !cb.disabled) lbl.textContent = cb.checked ? 'Activé' : 'Désactivé';
      });
    }

    function openModal() {
      const c = readConsent() || DEFAULT_CONSENT;
      const a = document.getElementById('ck-analytics');
      const m = document.getElementById('ck-marketing');
      if (a) a.checked = !!c.analytics;
      if (m) m.checked = !!c.marketing;
      syncToggleLabels();
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    function hideBanner() {
      banner.classList.remove('is-visible');
    }

    function acceptAll() {
      const c = { ...DEFAULT_CONSENT, analytics: true, marketing: true };
      saveConsent(c);
      applyConsent(c);
      hideBanner(); closeModal();
    }

    function rejectAll() {
      const c = { ...DEFAULT_CONSENT, analytics: false, marketing: false };
      saveConsent(c);
      applyConsent(c);
      hideBanner(); closeModal();
    }

    function saveCustom() {
      const a = document.getElementById('ck-analytics');
      const m = document.getElementById('ck-marketing');
      const c = {
        ...DEFAULT_CONSENT,
        analytics: !!(a && a.checked),
        marketing: !!(m && m.checked)
      };
      saveConsent(c);
      applyConsent(c);
      hideBanner(); closeModal();
    }

    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-cookie-action]');
      if (!t) return;
      const action = t.dataset.cookieAction;
      if (action === 'accept')       acceptAll();
      else if (action === 'reject')  rejectAll();
      else if (action === 'save')    saveCustom();
      else if (action === 'customize') openModal();
      else if (action === 'close-modal') closeModal();
      else if (action === 'open-preferences') { openModal(); }
      else if (action === 'withdraw-consent') {
        clearConsent();
        location.reload();
      }
    });

    modal.addEventListener('change', (e) => {
      if (e.target.matches('.cookie-switch input[type="checkbox"]')) syncToggleLabels();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    // API publique
    window.SIACookies = {
      open: openModal,
      reset: () => { clearConsent(); location.reload(); },
      get: readConsent
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
