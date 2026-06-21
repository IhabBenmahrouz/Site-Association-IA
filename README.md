# Sensibilisation à l'IA — Site web

Site officiel de l'association **Sensibilisation à l'IA**, association loi 1901
basée à Nîmes (n° RNA : W302023332), dédiée à la veille, l'analyse et la
sensibilisation citoyenne autour de l'intelligence artificielle.

## Présentation

Plateforme indépendante d'information et de pédagogie autour de l'IA :
- Études et rapports vérifiés (institutions, universités, ONG).
- Acteurs de l'IA : entreprises, universités, gouvernements, experts.
- Thématiques transversales : santé, cerveau, environnement, emploi,
  robotique, usage responsable, actualités.

Chaque carte d'étude ou d'actualité comporte un bouton **« Voir la source »**
qui ouvre l'article officiel d'origine dans un nouvel onglet, afin de garantir
la traçabilité et la véracité des informations présentées.

## Stack technique

- HTML5 sémantique servi via **PHP** (includes, pas de framework)
- En-tête et pied de page mutualisés dans `partials/header.php` et
  `partials/footer.php` (le lien de navigation actif est calculé côté serveur)
- CSS3 (un seul fichier `css/style.css`)
- JavaScript Vanilla — `js/script.js`, `js/cookies.js`,
  `js/enhancements.js`, `js/bibliotheque.js`
- Polices Google Fonts (Syne + DM Sans)
- Aucune dépendance externe, aucun framework, aucun build step
  (PHP sert uniquement à factoriser les parties communes)

## Structure du projet

```
.
├── index.php                           Accueil
├── association.php                     Présentation de l'association
├── etudes.php                          Études & rapports
├── entreprises.php                     Entreprises IA
├── universites.php                     Universités & recherche
├── institutions.php                    Gouvernements & institutions
├── experts.php                         Professionnels & experts
├── sante-cerveau.php                   Santé & cerveau
├── environnement-datacenters.php       Environnement & data centers
├── emploi-societe.php                  Emploi & société
├── robotique.php                       Évolution robotique
├── actualites.php                      Actualités IA
├── utilisation-responsable.php         Usage responsable
├── sources.php                         Bibliothèque de sources
├── bibliotheque.php                    Bibliothèque IA
├── partenaires.php                     Partenaires
├── contact.php                         Formulaire de contact
├── mentions-legales.php                Mentions légales
├── politique-confidentialite.php       Politique de confidentialité (RGPD)
├── politique-cookies.php               Politique cookies
├── cgu.php                             Conditions d'utilisation
├── accessibilite.php                   Déclaration d'accessibilité
├── partials/header.php                 En-tête + navigation (mutualisé)
├── partials/footer.php                 Pied de page + scripts (mutualisé)
├── css/style.css                       Feuille de styles principale
├── js/                                 Scripts (navigation, cookies, etc.)
└── assets/                             Images, icônes, documents
```

## Lancer en local

Les pages étant en `.php`, un serveur PHP est nécessaire (ouvrir un `.php`
directement dans le navigateur ne fonctionne pas).

- **Laragon** : placez le dossier dans `C:\laragon\www\` et ouvrez
  `http://site-association-ia.test` (ou `http://localhost/site-association-ia/`).
- **Serveur PHP intégré** (sans Laragon) :

```bash
php -S localhost:8000
```

Puis ouvrez `http://localhost:8000`.

## Conformité légale (UE)

- **RGPD** : politique de confidentialité complète, droits d'accès /
  rectification / effacement / opposition / portabilité, contact saisie CNIL.
- **Cookies** : bandeau de consentement explicite (opt-in), refus aussi
  simple que l'acceptation, gestion granulaire par catégorie (nécessaires,
  analytics, marketing), durée 6 mois.
- **LCEN** : mentions légales (responsable, directeur de publication,
  hébergeur à compléter selon le déploiement).
- **Accessibilité** : déclaration RGAA 4.1 — conformité partielle déclarée.

## Avant déploiement public

Lorsque le site sera mis en ligne (GitHub Pages, Netlify, OVH, etc.),
compléter dans `mentions-legales.php` (section Hébergeur) :
- raison sociale de l'hébergeur,
- adresse postale,
- numéro de téléphone.

Le formulaire de contact (`contact.php`) est actuellement en mode démo
côté client (pas d'envoi serveur). Brancher un endpoint sécurisé HTTPS
(Formspree, Netlify Forms, Web3Forms, ou backend dédié) avant exploitation.

## Licence

Code source : tous droits réservés à l'association Sensibilisation à l'IA.
Les contenus rédactionnels sont la propriété de leurs auteurs respectifs ;
les liens externes pointent vers les sources officielles de chaque étude.

## Contact

Association Sensibilisation à l'IA
Nîmes (30000), Gard, France
RNA : W302023332
contact@sensibilisation-ia.fr
