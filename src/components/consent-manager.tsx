"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GoogleTagManager } from "@next/third-parties/google";
import * as CookieConsent from "vanilla-cookieconsent";
import { consentConfig } from "@/lib/consent-config";

function clearAnalyticsCookies() {
  const pattern = /^_ga(?:_|$)/;
  CookieConsent.eraseCookies(pattern);
  // GA peut déposer ses cookies sur le domaine parent (ex. .webdesignord.fr)
  // alors que le site est servi sur webperfs.webdesignord.fr.
  const labels = window.location.hostname.split(".");
  for (let index = 0; index < labels.length - 1; index += 1) {
    CookieConsent.eraseCookies(pattern, "/", labels.slice(index).join("."));
  }
}

export function ConsentManager({ gtmId }: { gtmId?: string }) {
  // Même état au serveur et au premier rendu client : aucun script Analytics.
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function synchronizeConsent() {
      const accepted = CookieConsent.acceptedCategory("analytics");
      setAnalyticsAllowed(accepted);
      if (!accepted) {
        // Nettoie aussi les anciens cookies créés avant l'ajout du gestionnaire.
        clearAnalyticsCookies();
      }
    }

    // Le SDK modifie <html> et ajoute ses modales : uniquement après le montage
    // React, jamais via un script exécuté avant l'hydratation.
    // run() est idempotent : le SDK protège sa configuration contre le second
    // appel de l'effet en Strict Mode. Le layout reste monté entre les routes.
    void CookieConsent.run({
      ...consentConfig,
      autoShow: false, // L’effet ci-dessous laisse la page d’information accessible.
      onConsent: synchronizeConsent,
      onChange: ({ changedCategories }) => {
        synchronizeConsent();
        if (
          changedCategories.includes("analytics") &&
          !CookieConsent.acceptedCategory("analytics")
        ) {
          // Démonter GoogleTagManager ne décharge pas le code déjà exécuté.
          // Le choix est enregistré et les cookies sont effacés avant ce reload.
          // Le nouveau document repart sans GTM et sans ses écouteurs Analytics.
          window.location.reload();
        }
      },
    }).then(() => {
      setReady(true);
      if (!CookieConsent.acceptedCategory("analytics")) {
        clearAnalyticsCookies();
      }
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    // Lire l’information ne doit pas imposer de faire un choix au préalable.
    if (pathname === "/confidentialite") {
      CookieConsent.hide();
      CookieConsent.hidePreferences();
    } else if (!CookieConsent.validConsent()) {
      CookieConsent.show(true);
    }
  }, [pathname, ready]);

  // Blocage préalable : aucun ping Google sans accord.
  return analyticsAllowed && gtmId ? <GoogleTagManager gtmId={gtmId} /> : null;
}

// Un vrai gestionnaire React reste actif même si un footer est recréé lors
// d'une navigation. Les attributs data-cc seuls sont liés au DOM initial du SDK.
export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => CookieConsent.showPreferences()}
      className="cursor-pointer font-medium text-zinc-700 underline decoration-zinc-300 underline-offset-4 hover:text-teal-800"
    >
      Gérer mes cookies
    </button>
  );
}
