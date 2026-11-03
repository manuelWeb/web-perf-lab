import type { Metadata } from "next";
import Image from "next/image";
import { SlowProductRecommendations } from "@/components/retail/slow-product-recommendations";

export const metadata: Metadata = {
  title: "TBT lent | Web Performance Lab",
  description:
    "Un moteur de recommandations e-commerce monopolise le thread principal au chargement initial.",
};

export default function SlowTbtPage() {
  return (
    <main className="flex-1 bg-stone-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
          <div className="flex flex-col justify-center">
            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-rose-700">
              Expérience TBT · version lente
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
              Des recommandations qui occupent le navigateur
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-700">
              À l’ouverture de cette boutique, un moteur compose une sélection
              personnalisée. La page apparaît, mais la préparation des
              recommandations mobilise le thread principal et retarde la
              disponibilité du navigateur.
            </p>
          </div>

          <article className="overflow-hidden rounded-md border border-zinc-200 bg-stone-50">
            <div className="relative aspect-4/3 bg-stone-100">
              <Image
                alt="TBT performance tab screenshot"
                className="object-cover"
                fetchPriority="high"
                fill
                loading="eager"
                sizes="(min-width: 1024px) 544px, (min-width: 640px) calc(100vw - 64px), calc(100vw - 48px)"
                src="/images/tbt/perf-tab.png"
              />
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-6 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
        <ExplainerCard
          title="Ce qui est mesuré"
          body="Le TBT additionne, après le FCP et dans la fenêtre retenue par Lighthouse, la partie de chaque tâche qui dépasse 50 ms. Une tâche de 900 ms entièrement dans cette fenêtre contribue donc pour 850 ms. Le Self time d’une fonction et le Total CPU time d’un script ne sont pas le TBT."
        />
        <ExplainerCard
          title="Le scénario"
          body="Le calcul démarre automatiquement à l’ouverture, avec un profil et un catalogue fixes. Aucune interaction ni connexion n’est nécessaire pour reproduire le problème."
        />
        <ExplainerCard
          title="À observer"
          body="Enregistre un rechargement dans Performance. Le FCP est un instant, pas une barre de durée : son étiquette repère l’apparition du premier contenu. Dans Main, à droite de ce repère, sélectionne la longue tâche qui recouvre tbt:recommendations. Trie Bottom-up par Self time et ouvre le lien source pour identifier le code coûteux. La mesure tbt:recommendations est la durée du calcul, pas le TBT."
        />
      </section>

      <section
        aria-labelledby="recommendations-title"
        className="mx-auto w-full max-w-6xl px-6 pb-12 sm:px-8 lg:px-10"
      >
        <h2 id="recommendations-title" className="text-2xl font-semibold">
          Recommandé pour vous
        </h2>
        <p className="mt-2 mb-6 text-sm leading-6 text-zinc-600">
          Une sélection issue des dix produits du catalogue, calculée dans votre
          navigateur.
        </p>
        <SlowProductRecommendations />
      </section>
    </main>
  );
}

function ExplainerCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-md border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-700">{body}</p>
    </article>
  );
}
