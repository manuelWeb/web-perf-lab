import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Analyser le TBT | Web Performance Lab",
  description:
    "Identifier les longues tâches et comparer exécution différée, chargement à la demande et Web Worker avec un même moteur de recommandations.",
};

const variants = [
  {
    title: "Version lente",
    href: "/tbt/slow",
    flow: "FCP → calcul sur Main → résultat",
    mechanism:
      "Après le FCP, un setTimeout programme le calcul dans une nouvelle tâche. Le timer ne crée pas un autre thread : les 3 628 800 permutations bloquent Main jusqu’au retour de la fonction.",
    observe:
      "Enregistre un rechargement sans interaction. Dans Main, sélectionne la tâche qui recouvre tbt:recommendations, puis retrouve le moteur dans Bottom-up.",
    limit:
      "C’est notre référence : une page peut être déjà visible tout en restant occupée par un long calcul synchrone.",
  },
  {
    title: "Exécution différée",
    href: "/tbt/optimized/deferred",
    flow: "Zone visible → calcul sur Main → résultat",
    mechanism:
      "Le code est chargé dès l’ouverture. Un IntersectionObserver attend que la zone réservée aux recommandations entre dans le viewport pour déclencher le calcul une seule fois.",
    observe:
      "Compare une capture au chargement sans défiler et une capture pendant le défilement. Le repère tbt:recommendations:visible précède le calcul sur Main.",
    limit:
      "Le blocage est reporté et peut gêner le défilement. Si la zone est déjà visible à l’ouverture, le calcul démarre aussitôt : un meilleur TBT initial dépend du scénario.",
  },
  {
    title: "Chargement à la demande",
    href: "/tbt/optimized/lazy-loading",
    flow: "Zone visible → chargement du code → calcul sur Main",
    mechanism:
      "L’observer déclenche le rendu d’un composant importé avec next/dynamic. Le composant slow et son moteur sont alors demandés. Le SSR reste activé par défaut ; c’est le rendu conditionnel qui reporte le chargement.",
    observe:
      "Sur une visite avec cache désactivé, regarde Network avant puis après l’entrée de la zone dans le viewport : le chunk du moteur est demandé à ce moment-là. Retrouve ensuite son exécution dans Main.",
    limit:
      "Le code peut déjà être en cache après une autre visite. Une fois lancé, le même calcul bloque toujours Main : séparer un bundle ne découpe pas une longue tâche.",
  },
  {
    title: "Web Worker",
    href: "/tbt/optimized/webworker",
    flow: "FCP → calcul dans le Worker → résultat affiché sur Main",
    mechanism:
      "La page crée le Worker après le FCP et lui envoie une copie du catalogue par postMessage. Le Worker appelle le même moteur, puis renvoie la sélection à React. Il ne manipule pas le DOM.",
    observe:
      "Déplie le thread du Worker tbt-recommendations. Le calcul et la mesure tbt:recommendations sont sur ce thread. Sur Main, tbt:recommendations:roundtrip représente l’attente de la réponse.",
    limit:
      "Le calcul consomme toujours du CPU. Le démarrage et les échanges ont un coût : le résultat n’arrive pas forcément plus vite. Le bénéfice est de libérer Main pendant le calcul ; l’affichage des produits reste sur Main.",
  },
];

const diagnosticSteps = [
  {
    title: "Fixer les conditions",
    body: "Utilise le build de production, le même viewport, les mêmes réglages CPU/réseau, le même état du cache et le même consentement. Note les valeurs et répète les mesures. Un profil iPhone règle le viewport, mais ne reproduit pas à lui seul les conditions Lighthouse.",
  },
  {
    title: "Repérer la tâche sur Main",
    body: "Dans Performance, lance Record and reload sur slow. Le FCP est un instant marqué par une étiquette, pas une barre de durée. À sa droite, sélectionne la Task qui recouvre tbt:recommendations dans Timings. Une longue tâche dépasse 50 ms ; les hachures rouges signalent sa partie bloquante.",
  },
  {
    title: "Attribuer le travail",
    body: "Ouvre Bottom-up, trie par Self time, puis utilise Group by 3rd parties pour distinguer les origines et Group by URL pour isoler un script. Déplie les lignes et ouvre le lien source. Avec les source maps, le chunk minifié doit renvoyer au fichier TypeScript du moteur.",
  },
  {
    title: "Vérifier au bon moment",
    body: "Mesure le chargement avec Lighthouse, puis enregistre aussi le défilement pour deferred et lazy loading. Pour le Worker, inspecte son thread en plus de Main. Un bon TBT sans défilement ne prouve pas que l’interface reste réactive lorsque le calcul démarre plus tard.",
  },
];

const readings = [
  {
    title: "Duration d’une requête Network",
    body: "Elle comprend les attentes et le transfert de la ressource. Une requête JavaScript de 1,9 s ne signifie pas 1,9 s de CPU. Les téléchargements peuvent se chevaucher ; leurs durées ne s’additionnent pas pour obtenir le TBT.",
  },
  {
    title: "Self time et Total time",
    body: "Dans Bottom-up, Self time est le temps directement attribué à la fonction. Total time inclut ses appels. Ne somme pas les Total time de lignes imbriquées, notamment dans la récursion : tu compterais plusieurs fois le même travail.",
  },
  {
    title: "Nos mesures dans Timings",
    body: "tbt:recommendations mesure la durée du calcul sur le thread qui l’exécute. Dans la version Web Worker, roundtrip mesure le temps écoulé entre la demande et la réponse, démarrage et échanges compris. Aucune de ces mesures n’est automatiquement le TBT.",
  },
  {
    title: "Total CPU time dans Lighthouse",
    body: "Le diagnostic peut regrouper plusieurs tâches d’un même script. Le TBT retient uniquement les portions bloquantes des tâches de Main dans sa fenêtre de mesure. Le résultat Lighthouse peut aussi être simulé : ses valeurs ne se comparent pas directement à celles d’une autre capture Performance.",
  },
];

const exampleTasks = [
  { name: "Tâche A", duration: 40, blocking: 0 },
  { name: "Tâche B", duration: 200, blocking: 150 },
  { name: "Tâche C", duration: 900, blocking: 850 },
];

const resources = [
  {
    title: "Total Blocking Time",
    source: "web.dev",
    href: "https://web.dev/articles/tbt",
    description: "Définition, longues tâches et fenêtre de mesure du TBT.",
  },
  {
    title: "Performance features reference",
    source: "Chrome for Developers",
    href: "https://developer.chrome.com/docs/devtools/performance/reference",
    description: "Lire les pistes, sélectionner une plage et attribuer le travail.",
  },
  {
    title: "Lazy loading",
    source: "Next.js",
    href: "https://nextjs.org/docs/app/guides/lazy-loading",
    description: "Chargement conditionnel des composants et rôle de l’option SSR.",
  },
  {
    title: "Using Web Workers",
    source: "MDN",
    href: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers",
    description: "Autre thread, messages, copie des données et arrêt du Worker.",
  },
];

export default function TbtAnalysisPage() {
  return (
    <main className="flex-1 bg-stone-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-10 sm:px-8 lg:px-10">
          <Link
            className="w-fit text-sm font-semibold text-teal-700 hover:text-teal-900"
            href="/"
          >
            Retour aux métriques
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-teal-700">
            Méthode TBT
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl">
            Comprendre ce qui bloque le navigateur
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-700">
            Le <abbr title="Total Blocking Time">TBT</abbr> mesure du temps de
            blocage sur le thread principal, appelé Main dans DevTools. C’est
            une métrique de laboratoire, pas un Core Web Vital. Notre moteur de
            recommandations permet de comparer trois solutions sans changer
            son calcul : attendre, charger à la demande ou exécuter ailleurs.
          </p>
          <nav aria-label="Versions de l’expérience TBT" className="mt-6 flex flex-wrap gap-2">
            {variants.map((variant) => (
              <Link
                className="inline-flex min-h-10 items-center rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
                href={variant.href}
                key={variant.href}
                prefetch={false}
              >
                {variant.title}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold">Ce que le TBT additionne</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              Pour chaque tâche de Main qui dépasse 50 ms, seule la partie
              au-delà de ces 50 ms compte. Lighthouse l’évalue après le FCP et
              jusqu’au TTI dans sa fenêtre de chargement. Le LCP et la fin de
              notre calcul ne définissent pas cette borne de fin.
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              Pour une tâche entièrement comprise dans cette fenêtre : temps
              bloquant = max(0, durée − 50 ms). On additionne les contributions
              des tâches, pas celles de chaque fonction appelée à l’intérieur.
            </p>
          </div>
          <figure className="rounded-md border border-zinc-200 bg-white p-5">
            <figcaption className="font-semibold">
              Exemple : trois tâches entièrement dans la fenêtre de mesure
            </figcaption>
            <div className="mt-5 space-y-5">
              {exampleTasks.map((task) => (
                <div key={task.name}>
                  <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-sm">
                    <span>{task.name} · {task.duration} ms</span>
                    <span className="font-semibold">{task.blocking} ms bloquantes</span>
                  </div>
                  <div aria-hidden="true" className="mt-2 h-5 rounded-sm bg-stone-100">
                    <div
                      className="flex h-full overflow-hidden rounded-sm"
                      style={{ width: `${(task.duration / 900) * 100}%` }}
                    >
                      <div
                        className="h-full shrink-0 bg-teal-600"
                        style={{ width: `${(Math.min(task.duration, 50) / task.duration) * 100}%` }}
                      />
                      {task.blocking > 0 && <div className="h-full flex-1 bg-rose-600" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-zinc-600">
              Même échelle, 900 ms sur toute la largeur. Vert : les 50 premières
              millisecondes au maximum. Rouge : le temps bloquant retenu.
            </p>
            <p className="mt-4 border-t border-zinc-200 pt-4 text-lg font-semibold">
              TBT = 0 + 150 + 850 = 1 000 ms
            </p>
          </figure>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold">Lire la valeur et le score</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-700">
                Les repères usuels Lighthouse mobile sont : bon jusqu’à 200 ms,
                à améliorer au-delà de 200 et jusqu’à 600 ms, mauvais au-delà.
                Les repères desktop diffèrent. Compare d’abord des valeurs en
                millisecondes obtenues dans les mêmes conditions.
              </p>
            </div>
            <div className="border-l-2 border-zinc-200 pl-5">
              <h3 className="font-semibold">30 % de la note Performance Lighthouse</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-700">
                La durée du TBT est transformée en un score sur 100, puis
                pondérée. Un score TBT de 6/100 apporte 6 × 0,30 = 1,8 point à
                la note globale, sur 30 possibles. Ce sont 28,2 points de moins
                qu’un score TBT de 100/100. Le poids de 30 % n’est pas un
                percentile de visiteurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <h2 className="text-2xl font-semibold">Trouver le code coûteux dans DevTools</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-2">
          {diagnosticSteps.map((step, index) => (
            <li className="border-l-2 border-teal-700 pl-4" key={step.title}>
              <h3 className="font-semibold">{index + 1}. {step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
          <h2 className="text-2xl font-semibold">Un même calcul, trois leviers</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-700">
            Les quatre versions utilisent les dix mêmes produits, le même profil
            et la même fonction calculateSlowRecommendations. Son parcours de
            10! = 3 628 800 permutations est conservé. La sélection finale reste
            identique ; seules la disponibilité du code, l’heure de démarrage
            et le thread d’exécution changent selon la variante.
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {variants.map((variant, index) => (
              <article className="rounded-md border border-zinc-200 bg-stone-50 p-5" key={variant.href}>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                  {index === 0 ? "Référence" : `Solution ${index}`}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{variant.title}</h3>
                <p className="mt-4 border-l-2 border-teal-700 pl-3 text-sm font-semibold leading-6">
                  {variant.flow}
                </p>
                <p className="mt-4 text-sm leading-6 text-zinc-700">{variant.mechanism}</p>
                <p className="mt-4 text-sm leading-6 text-zinc-700">
                  <strong>À observer :</strong> {variant.observe}
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  <strong>Ce qui reste à prendre en compte :</strong> {variant.limit}
                </p>
                <Link
                  className="mt-5 inline-block text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 hover:text-teal-900"
                  href={variant.href}
                  prefetch={false}
                >
                  Tester : {variant.title.toLocaleLowerCase("fr-FR")}
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-6 border-l-2 border-amber-500 pl-4 text-sm leading-6 text-zinc-700">
            Un TBT initial réduit ne garantit pas un bon INP. Deferred et lazy
            loading peuvent déplacer le blocage vers une interaction ultérieure.
            Le Worker retire ce calcul de Main, mais ne supprime ni son coût CPU
            ni le travail de rendu. Ici, le moteur est indépendant du DOM : un
            script tiers qui manipule la page ne pourrait pas être déplacé tel
            quel dans un Worker.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <h2 className="text-2xl font-semibold">Ne pas confondre les durées</h2>
        <div className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2">
          {readings.map((reading) => (
            <article className="border-t border-zinc-300 pt-4" key={reading.title}>
              <h3 className="text-lg font-semibold">{reading.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700">{reading.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
          <h2 className="text-2xl font-semibold">Ressources à consulter</h2>
          <ul className="mt-6 grid gap-x-8 gap-y-5 md:grid-cols-2">
            {resources.map((resource) => (
              <li className="border-t border-zinc-300 pt-4" key={resource.href}>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{resource.source}</p>
                <h3 className="mt-2 font-semibold">
                  <a
                    className="underline decoration-zinc-300 underline-offset-4 hover:text-teal-800"
                    href={resource.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {resource.title}
                  </a>
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-700">{resource.description}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-6 text-zinc-700">
            <a
              className="underline decoration-zinc-300 underline-offset-4 hover:text-teal-800"
              href="https://developer.chrome.com/docs/lighthouse/performance/performance-scoring"
              rel="noreferrer"
              target="_blank"
            >
              Comprendre la pondération et la variabilité du score Lighthouse
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
