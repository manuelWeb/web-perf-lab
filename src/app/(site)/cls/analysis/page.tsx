import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Analyser le CLS | Web Performance Lab",
  description:
    "Méthode pour repérer, attribuer et corriger les décalages de mise en page mesurés par le CLS.",
};

const commonCauses = [
  {
    cause: "Images et médias sans dimensions réservées",
    signal:
      "Un élément apparaît après le chargement et repousse le contenu déjà visible.",
    fix: "Définir width et height, ou réserver le ratio avec aspect-ratio.",
  },
  {
    cause: "Contenu injecté tardivement",
    signal:
      "Une bannière, une publicité, un embed ou un bloc chargé après coup déplace la page.",
    fix: "Réserver son espace dès le rendu initial ou afficher le contenu en superposition si le contexte le permet.",
  },
  {
    cause: "Chargement ou remplacement de police",
    signal:
      "Le texte change de largeur ou de hauteur quand la police finale remplace la police de secours.",
    fix: "Choisir une police de secours aux métriques proches et ajuster sa taille si nécessaire.",
  },
  {
    cause: "Animations qui modifient la mise en page",
    signal:
      "Des changements de hauteur, largeur, marge ou position déplacent les éléments voisins.",
    fix: "Quand c’est adapté, animer transform ou opacity plutôt que des propriétés qui recalculent la mise en page.",
  },
];

const resources = [
  {
    title: "Cumulative Layout Shift (CLS)",
    source: "web.dev",
    href: "https://web.dev/articles/cls?hl=fr",
    description:
      "Définition de la métrique, fenêtres de session et seuils d’évaluation.",
  },
  {
    title: "Optimize Cumulative Layout Shift",
    source: "web.dev",
    href: "https://web.dev/articles/optimize-cls?hl=fr",
    description:
      "Causes fréquentes des décalages et pistes de correction concrètes.",
  },
  {
    title: "Layout shift culprits",
    source: "Chrome for Developers",
    href: "https://developer.chrome.com/docs/devtools/performance/insights/cls-culprit?hl=fr",
    description:
      "Insight DevTools qui suggère les causes possibles et renvoie à la piste Layout Shifts.",
  },
];

export default function ClsAnalysisPage() {
  return (
    <main className="flex-1 bg-stone-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-10 sm:px-8 lg:px-10">
          <Link
            className="w-fit text-sm font-semibold text-teal-700 transition-colors hover:text-teal-900"
            href="/"
          >
            Retour aux métriques
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-teal-700">
            Méthode CLS
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl">
            Diagnostiquer les décalages de mise en page
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-700">
            Le{" "}
            <abbr title="Cumulative Layout Shift (décalage cumulatif de mise en page)">
              CLS
            </abbr>{" "}
            mesure l’ampleur des déplacements visuels inattendus. Il n’a pas d’unité de
            temps : sa valeur dépend de la surface déplacée et de la distance du
            déplacement. L’objectif est de trouver ce qui a bougé, puis surtout
            ce qui l’a fait bouger.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal">
              Lire la valeur
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              Le CLS de terrain est évalué au 75e percentile des visites, en
              distinguant mobile et ordinateur. Une trace ou un audit isolé
              aide au diagnostic, mais ne représente pas à lui seul toutes les
              visites réelles.
            </p>
          </div>
          <dl className="grid gap-x-6 gap-y-4 border-l-2 border-zinc-200 pl-5 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-semibold text-[var(--color-green-500)]">
                Bon
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-[var(--color-green-500)]">
                ≤ 0.1
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-[var(--color-orange-400)]">
                À améliorer
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-[var(--color-orange-400)]">
                &gt; 0.1 à 0.25
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-[var(--color-red-500)]">
                Mauvais
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-[var(--color-red-500)]">
                &gt; 0.25
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
          <h2 className="text-2xl font-semibold tracking-normal">
            Trouver le décalage dans Chrome DevTools
          </h2>
          <ol className="mt-6 grid gap-6 md:grid-cols-2">
            <li className="border-l-2 border-teal-700 pl-4">
              <h3 className="font-semibold">1. Enregistrer le scénario</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Dans l’onglet Performance, démarre un enregistrement, recharge
                la page ou reproduis le scénario, puis arrête l’enregistrement.
                Le CLS peut survenir après le premier affichage.
              </p>
            </li>
            <li className="border-l-2 border-teal-700 pl-4">
              <h3 className="font-semibold">2. Commencer par le plus gros groupe</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Repère la piste Layout Shifts et commence par le groupe dont la
                fenêtre de session cumule le score le plus élevé. Les marqueurs
                indiquent quand les décalages se sont produits.
              </p>
            </li>
            <li className="border-l-2 border-teal-700 pl-4">
              <h3 className="font-semibold">3. Identifier les éléments concernés</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Sélectionne un marqueur ou un groupe. DevTools affiche le score,
                les éléments déplacés et, parfois, une cause probable. L’élément
                déplacé n’est pas nécessairement la cause : une image sans
                dimensions peut repousser tout le contenu situé dessous.
              </p>
            </li>
            <li className="border-l-2 border-teal-700 pl-4">
              <h3 className="font-semibold">4. Remonter à la ressource ou au code</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Corrèle l’instant du décalage avec les captures, le DOM et les
                pistes Network. Vérifie les dimensions des médias, l’injection
                de contenu, le chargement des polices et les styles du nœud
                signalé. Reproduis ensuite le cas à viewport identique.
              </p>
            </li>
          </ol>
          <p className="mt-6 border-l-2 border-amber-500 pl-4 text-sm leading-6 text-zinc-700">
            Attention : un décalage qui suit une interaction utilisateur dans
            les 500 ms est exclu du CLS. Un clic qui ouvre un panneau ou change
            immédiatement un avatar n’est donc pas, à lui seul, une
            démonstration fiable de CLS.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="mb-5 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-normal">
            Relier le symptôme à sa cause
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Le navigateur montre l’élément affecté ; l’enquête consiste à
            trouver pourquoi son espace ou celui de ses voisins a changé.
          </p>
        </div>
        <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
          {commonCauses.map((item) => (
            <article className="border-t border-zinc-300 pt-4" key={item.cause}>
              <h3 className="text-lg font-semibold">{item.cause}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                <strong>Signal :</strong> {item.signal}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                <strong>Piste :</strong> {item.fix}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
          <div className="mb-5 max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-normal">
              Ressources à consulter
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Références pour approfondir la mesure et le diagnostic.
            </p>
          </div>
          <ul className="grid gap-x-8 gap-y-5 md:grid-cols-3">
            {resources.map((resource) => (
              <li className="border-t border-zinc-300 pt-4" key={resource.href}>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                  {resource.source}
                </p>
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
                <p className="mt-2 text-sm leading-6 text-zinc-700">
                  {resource.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
