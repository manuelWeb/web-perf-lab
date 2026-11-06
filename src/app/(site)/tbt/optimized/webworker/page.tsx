import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WorkerProductRecommendations } from "@/components/retail/worker-product-recommendations";

export const metadata: Metadata = {
  title: "TBT · calcul dans un Web Worker | Web Performance Lab",
  description:
    "Le même moteur de recommandations calcule les 3 628 800 permutations dans un Web Worker, sans occuper le thread principal pendant le calcul.",
};

export default function WorkerTbtPage() {
  return (
    <main className="flex-1 bg-stone-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
          <div className="flex flex-col justify-center">
            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-teal-700">
              Expérience TBT · version Web Worker
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
              Des recommandations sur un autre thread
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-700">
              Comme dans la version lente, le moteur démarre automatiquement
              après le premier affichage. Le même calcul s’exécute cette fois
              dans un Web Worker : le thread principal reste disponible pour
              traiter les interactions et le rendu de la page.
            </p>
            <Link
              className="mt-4 w-fit text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 transition-colors hover:text-teal-900"
              prefetch={false}
              href="/tbt/slow"
            >
              Comparer avec la version lente
            </Link>
            <Link
              className="mt-4 w-fit text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 transition-colors hover:text-teal-900"
              href="/tbt/analysis"
            >
              Comprendre les solutions TBT
            </Link>
            <Link
              className="mt-4 w-fit text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 transition-colors hover:text-teal-900"
              prefetch={false}
              href="/tbt/optimized/deferred"
            >
              Comparer avec la version différée
            </Link>
          </div>

          <figure className="overflow-hidden rounded-md border border-zinc-200 bg-stone-50">
            <div className="relative aspect-4/3 bg-stone-100">
              <Image
                alt="Capture de référence de la longue tâche du moteur dans la version lente"
                className="object-cover"
                fetchPriority="high"
                fill
                loading="eager"
                sizes="(min-width: 1024px) 544px, (min-width: 640px) calc(100vw - 64px), calc(100vw - 48px)"
                src="/images/tbt/perf-tab.png"
              />
            </div>
            <figcaption className="px-4 py-3 text-sm leading-6 text-zinc-600">
              Référence : la longue tâche de la version lente. Ici, le calcul
              est déplacé vers le thread du Worker.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-6 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
        <ExplainerCard
          title="Ce qui change"
          body="Après le FCP, la page crée un Web Worker et lui envoie une copie du catalogue avec postMessage. Le Worker renvoie la sélection calculée ; React l’affiche sur le thread principal. Le calcul démarre même si les recommandations sont hors du viewport."
        />
        <ExplainerCard
          title="Ce qui reste coûteux"
          body="Le moteur explore toujours les 3 628 800 permutations. Le Worker consomme du CPU, et son démarrage ainsi que les échanges de données ont un coût : le résultat n’arrive pas forcément plus vite. Le gain recherché est la disponibilité de Main. Le rendu des produits reste sur ce thread."
        />
        <ExplainerCard
          title="À observer"
          body="Enregistre un rechargement, puis déplie le thread du Worker tbt-recommendations dans Performance. Le calcul et sa mesure tbt:recommendations sont sur ce thread. Sur Main, tbt:recommendations:roundtrip mesure l’attente du résultat, démarrage et échanges compris ; ce n’est pas du temps CPU ni le TBT. Compare avec slow : la longue tâche du moteur a quitté Main."
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
        <WorkerProductRecommendations />
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
