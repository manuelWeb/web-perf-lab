import type { CookieConsentConfig } from "vanilla-cookieconsent";

// Configuration déclarative séparée du cycle de vie React pour rester lisible.
export const consentConfig: CookieConsentConfig = {
  mode: "opt-in",
  revision: 1,
  manageScriptTags: false, // React contrôle explicitement le montage de GTM.
  disablePageInteraction: true,
  cookie: {
    name: "wpl_consent",
    expiresAfterDays: 182, // Même durée pour une acceptation ou un refus.
    sameSite: "Lax",
  },
  guiOptions: {
    consentModal: {
      layout: "box wide",
      position: "middle center",
      equalWeightButtons: true,
    },
    preferencesModal: { layout: "box", equalWeightButtons: true },
  },
  categories: {
    necessary: { enabled: true, readOnly: true },
    analytics: {
      enabled: false,
      autoClear: { cookies: [{ name: /^_ga(?:_|$)/ }] },
    },
  },
  language: {
    default: "fr",
    translations: {
      fr: {
        consentModal: {
          title: "Vos préférences de confidentialité",
          description:
            "Ce site utilise des cookies nécessaires à son fonctionnement. Avec votre accord, Google Analytics mesure les visites et les pages consultées. Vous pouvez refuser cette mesure et continuer à consulter le site.",
          acceptAllBtn: "Tout accepter",
          acceptNecessaryBtn: "Tout refuser",
          showPreferencesBtn: "Personnaliser",
          footer: '<a href="/confidentialite">Confidentialité et cookies</a>',
        },
        preferencesModal: {
          title: "Gérer mes cookies",
          acceptAllBtn: "Tout accepter",
          acceptNecessaryBtn: "Tout refuser",
          savePreferencesBtn: "Enregistrer mes choix",
          closeIconLabel: "Fermer les préférences",
          sections: [
            {
              title: "Votre choix",
              description:
                "Vous pouvez modifier votre décision à tout moment depuis le lien « Gérer mes cookies » en pied de page. Retirer votre accord recharge la page pour arrêter les scripts de mesure déjà chargés.",
            },
            {
              title: "Cookies nécessaires",
              description:
                "Le cookie wpl_consent mémorise votre choix pendant six mois environ. Le compte simulé utilise également un cookie fonctionnel lors de son activation. Ces cookies ne servent pas à la mesure d’audience.",
              linkedCategory: "necessary",
            },
            {
              title: "Mesure d’audience — Google Analytics",
              description:
                "Google Analytics, chargé via Google Tag Manager, mesure les visites, les pages et les interactions. Les cookies _ga et _ga_* distinguent les visiteurs et les sessions. Aucun de ces scripts n’est chargé avant votre accord. Le retrait efface ces cookies accessibles sur ce domaine ; il ne supprime pas les données déjà transmises à Google.",
              linkedCategory: "analytics",
            },
            {
              title: "En savoir plus",
              description:
                '<a href="/confidentialite">Consulter les informations de confidentialité</a>.',
            },
          ],
        },
      },
    },
  },
};
