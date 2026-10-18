import Link from "next/link";

const inpSubparts = [
  {
    title: "Input delay",
    where:
      "Dans Performance, clique l'interaction dans la piste Interactions. Le panneau de détail affiche la durée entre l'action utilisateur et le début du traitement.",
    why: "Si cette partie est haute, le main thread était déjà occupé avant même que ton handler démarre. Il faut chercher une tâche précédente, un script tiers ou un rendu déjà en cours.",
  },
  {
    title: "Processing duration",
    where:
      "Toujours dans le détail de l'interaction, cette sous-partie couvre le temps passé à traiter l'événement : handler, React, calculs, mises à jour d'état.",
    why: "Si cette partie est haute, le problème vient souvent du code déclenché par l'interaction : calcul synchrone, re-render trop large, logique métier ou effet de bord.",
  },
  {
    title: "Presentation delay",
    where:
      "Dans le détail de l'interaction, cette sous-partie commence après le traitement JS et se termine quand le navigateur affiche le rendu suivant.",
    why: "Si cette partie est haute, le calcul est peut-être fini, mais le navigateur met du temps à produire le rendu : style, layout, paint, DOM trop lourd ou image coûteuse.",
  },
];

const costFamilies = [
  {
    title: "Traitement JavaScript",
    signal:
      "Bottom-up montre une fonction applicative avec un Self time élevé, par exemple dans page.tsx, lib ou un composant métier.",
    action:
      "Réduire l'algorithme, pré-calculer, filtrer moins de données, déplacer vers le serveur ou découper le travail.",
  },
  {
    title: "Rendu React trop large",
    signal:
      "La trace montre surtout React, beaucoup de petits composants, peu de fonction métier dominante, et une mise à jour qui touche trop d'interface.",
    action:
      "Réduire la zone qui re-render, isoler l'état, mémoriser les composants coûteux, limiter la liste rendue ou virtualiser.",
  },
  {
    title: "Layout, style et paint",
    signal:
      "Main montre Recalculate style, Layout, Pre-paint ou Paint avec des durées visibles autour de l'interaction.",
    action:
      "Réduire le DOM, stabiliser les dimensions, éviter les lectures/écritures layout répétées et simplifier les styles coûteux.",
  },
  {
    title: "Script tiers",
    signal:
      "Bottom-up ou Call tree montre un domaine externe, un tag manager, analytics, AB testing ou un bundle qui n'appartient pas au code produit.",
    action:
      "Mesurer l'impact, charger plus tard, limiter les déclencheurs, isoler le script ou négocier sa nécessité métier.",
  },
];

const inpResources = [
  {
    title: "Tips for making the Performance Panel less overwhelming",
    source: "PerfPlanet",
    type: "Article",
    url: "https://calendar.perfplanet.com/2025/tips-for-making-the-performance-panel-less-overwhelming/",
    description:
      "Une lecture pratique du panneau Performance pour réduire le bruit visuel, isoler les signaux utiles et analyser une trace sans se perdre.",
  },
  {
    title: "How To Improve INP: Yield Patterns",
    source: "kurtextrem -Jacob 'Kurt' Groß",
    type: "Article",
    url: "https://kurtextrem.de/posts/improve-inp",
    description: "Astuce pour une meilleure INP, await interaction VS yield",
  },
  {
    title: "Interaction to Next Paint",
    source: "Jeremy Wagner & Barry Pollard",
    type: "Article",
    url: "https://web.dev/articles/inp?hl=fr",
    description:
      "Lexique et explication de la métrique Interaction to Next Paint.",
  },
];

export default function InpAnalysisPage() {
  return (
    <main className="flex-1 bg-stone-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-10 sm:px-8 lg:px-10">
          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            <Link
              className="text-teal-700 transition-colors hover:text-teal-900"
              href="/"
            >
              Retour aux métriques
            </Link>
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-teal-700">
            Méthode INP
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl">
            Diagnostiquer une interaction lente
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-700">
            Je commence par l’interaction et la sous-partie{" "}
            <abbr title="Interaction to Next Paint">INP</abbr>. Ensuite,
            j’identifie si le coût vient du traitement JavaScript, du rendu
            React, du layout/paint ou d’un script tiers. Une fois la famille
            trouvée, je descends vers les sources via sourcemaps, noms de
            composants, URL de bundles ou instrumentation.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="mb-5 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-normal">
            Lire les sous-parties INP
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Dans Chrome DevTools Performance, enregistre une interaction, clique
            l’élément dans la piste Interactions, puis lis le détail Input
            delay, Processing duration et Presentation delay.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {inpSubparts.map((subpart) => (
            <article
              className="rounded-md border border-zinc-200 bg-white p-5"
              key={subpart.title}
            >
              <h3 className="text-lg font-semibold">{subpart.title}</h3>
              <p className="mt-3 text-sm font-semibold text-zinc-950">
                Où le trouver
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-700">
                {subpart.where}
              </p>
              <p className="mt-4 text-sm font-semibold text-zinc-950">
                Pourquoi ça compte
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-700">
                {subpart.why}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-10 sm:px-8 lg:px-10">
        <div className="mb-5 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-normal">
            Classer le coût avant de corriger
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Si la trace ne donne pas immédiatement une fonction métier évidente,
            il faut d’abord classer la famille du coût. C’est ce classement qui
            guide la correction.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {costFamilies.map((family) => (
            <article
              className="rounded-md border border-zinc-200 bg-white p-5"
              key={family.title}
            >
              <h3 className="text-lg font-semibold">{family.title}</h3>
              <p className="mt-3 text-sm font-semibold text-zinc-950">
                Signal dans DevTools
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-700">
                {family.signal}
              </p>
              <p className="mt-4 text-sm font-semibold text-zinc-950">
                Action probable
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-700">
                {family.action}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-12 sm:px-8 lg:px-10">
        <article className="rounded-md border border-zinc-200 bg-white p-5">
          <h2 className="text-2xl font-semibold tracking-normal">
            Rendu React trop large
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-700">
            Un rendu React trop large arrive quand une interaction modifie un
            état placé trop haut ou trop global, puis force une grande partie de
            l’arbre de composants à se recalculer alors que peu d’éléments
            visibles changent réellement.
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-700">
            Exemple catalogue : un filtre change une catégorie, mais toute la
            page re-render, toutes les cards recalculent leurs prix, badges,
            images, disponibilités et états, puis le navigateur doit réconcilier
            beaucoup trop de DOM avant de peindre la réponse.
          </p>
        </article>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-14 sm:px-8 lg:px-10">
        <div className="mb-5 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-normal">
            Ressources à relire
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Articles, conférences et vidéos à garder sous la main pour
            approfondir l’analyse des interactions et des traces Performance.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {inpResources.map((resource) => (
            <article
              className="rounded-md border border-zinc-200 bg-white p-5"
              key={resource.url}
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-700">
                <span>{resource.type}</span>
                <span aria-hidden="true">·</span>
                <span>{resource.source}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold">
                <a
                  className="transition-colors hover:text-teal-700"
                  href={resource.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {resource.title}
                </a>
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-700">
                {resource.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
