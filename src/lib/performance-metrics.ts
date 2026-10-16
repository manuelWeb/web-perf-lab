export type PerformanceMetric = {
  id: string;
  name: string;
  fullName: string;
  status: "Core Web Vital" | "Lighthouse" | "Diagnostic";
  scoreWeight: string;
  description: string;
  hasAnalysisGuide: boolean;
  experimentRoutes: {
    optimized: boolean;
    slow: boolean;
  };
  seoImpact: string;
  tools: readonly string[];
};

export const performanceMetrics = [
  {
    id: "ttfb",
    name: "TTFB",
    fullName: "Time to First Byte",
    status: "Diagnostic",
    scoreWeight: "Pas de poids direct dans le score Lighthouse.",
    description:
      "Temps entre la requete navigateur et le premier octet de reponse serveur. Il aide a comprendre le cout serveur, reseau, cache et edge.",
    hasAnalysisGuide: false,
    experimentRoutes: {
      optimized: false,
      slow: false,
    },
    seoImpact:
      "Impact surtout indirect: un mauvais TTFB retarde souvent FCP et LCP.",
    tools: ["Chrome DevTools", "WebPageTest", "Datadog RUM"],
  },
  {
    id: "fcp",
    name: "FCP",
    fullName: "First Contentful Paint",
    status: "Lighthouse",
    scoreWeight: "10% du score Performance Lighthouse.",
    description:
      "Moment ou le premier contenu visible apparait: texte, image, SVG ou canvas non vide.",
    hasAnalysisGuide: false,
    experimentRoutes: {
      optimized: false,
      slow: false,
    },
    seoImpact:
      "Pas un Core Web Vital, mais un FCP lent signale souvent un rendu initial trop tardif.",
    tools: ["Lighthouse", "Chrome DevTools", "PageSpeed Insights"],
  },
  {
    id: "lcp",
    name: "LCP",
    fullName: "Largest Contentful Paint",
    status: "Core Web Vital",
    scoreWeight: "25% du score Performance Lighthouse.",
    description:
      "Temps necessaire pour afficher le plus grand element de contenu visible dans le viewport.",
    hasAnalysisGuide: false,
    experimentRoutes: {
      optimized: true,
      slow: true,
    },
    seoImpact:
      "Fait partie des Core Web Vitals utilises comme signal d'experience de page.",
    tools: ["PageSpeed Insights", "Chrome DevTools", "Datadog RUM"],
  },
  {
    id: "cls",
    name: "CLS",
    fullName: "Cumulative Layout Shift",
    status: "Core Web Vital",
    scoreWeight: "25% du score Performance Lighthouse.",
    description:
      "Mesure les decalages visuels inattendus pendant la vie de la page.",
    hasAnalysisGuide: false,
    experimentRoutes: {
      optimized: false,
      slow: false,
    },
    seoImpact:
      "Fait partie des Core Web Vitals: il aide a qualifier la stabilite percue.",
    tools: ["Lighthouse", "Chrome DevTools", "CrUX"],
  },
  {
    id: "inp",
    name: "INP",
    fullName: "Interaction to Next Paint",
    status: "Core Web Vital",
    scoreWeight:
      "Pas de poids direct dans Lighthouse; TBT sert souvent d'indicateur lab.",
    description:
      "Evalue la latence globale des interactions utilisateur, pas seulement la premiere interaction.",
    hasAnalysisGuide: true,
    experimentRoutes: {
      optimized: true,
      slow: true,
    },
    seoImpact:
      "Core Web Vital depuis mars 2024: utile pour juger la reactivite reelle.",
    tools: ["Chrome DevTools", "Web Vitals extension", "Datadog RUM"],
  },
  {
    id: "tbt",
    name: "TBT",
    fullName: "Total Blocking Time",
    status: "Lighthouse",
    scoreWeight: "30% du score Performance Lighthouse.",
    description:
      "Somme des periodes ou le thread principal reste bloque assez longtemps pour retarder les interactions.",
    hasAnalysisGuide: false,
    experimentRoutes: {
      optimized: false,
      slow: false,
    },
    seoImpact:
      "Pas un signal SEO direct, mais souvent correle aux problemes d'INP.",
    tools: ["Lighthouse", "Chrome DevTools Performance", "WebPageTest"],
  },
  {
    id: "speed-index",
    name: "Speed Index",
    fullName: "Speed Index",
    status: "Lighthouse",
    scoreWeight: "10% du score Performance Lighthouse.",
    description:
      "Resume la vitesse a laquelle le contenu visible se remplit pendant le chargement.",
    hasAnalysisGuide: false,
    experimentRoutes: {
      optimized: false,
      slow: false,
    },
    seoImpact:
      "Indicateur lab utile pour diagnostiquer le ressenti visuel, sans statut Core Web Vital.",
    tools: ["Lighthouse", "WebPageTest"],
  },
] as const satisfies readonly PerformanceMetric[];

/**
* Ici on choisit `as const` pour conserver les ids et statuts en types littéraux,
  tout en gardant `satisfies` pour verifier le contrat metier.
* Ces donnees peuvent ainsi servir de source de verite pour l'index actuel,
  puis pour les futures routes slow/optimized et leurs paramètres types.
*/
